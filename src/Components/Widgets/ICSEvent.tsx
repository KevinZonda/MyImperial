import useSWR from "swr";
import { List } from "antd";
import { UserStore } from "../../Store/UserStore.ts";
import { Cache } from "../../Store/Cache.ts";
import { Event } from "ikalendar";
import {CourseToEd, CourseToPanopto, CourseToScientia, ICourse, IdToScientia, ParseCourseErr} from "../../lib/Parser/parser.ts";
import Link from "antd/es/typography/Link";
import React from "react";
import {useInterval} from "usehooks-ts";
import {useScreenSize} from "../../lib/helper/screen.tsx";
import {ICSDateRangeToString, parseICSDate} from "../../lib/ICS/Date.ts";
import {parseToCalendar} from "../../lib/ICS/parser.ts";

function filterEventWithCourse(events: Event[] | undefined, courses: ICourse[] | null): Event[] | undefined {
    if (!UserStore.icalOnlyShowRelatedCourse) return events
    if (!events) return undefined
    if (!courses || courses.length === 0) return events
    const courseCodes = courses.map((course) => course.scientia);
    return events.filter((event) => {
        if (!event.summary) return true
        if (!event.summary.startsWith('COMP')) return true
        const parts = EventToScientiaIDs(event)
        if (!parts || parts.length === 0) return true
        return courseCodes.some((course) => parts.includes(course))
    })
}

export async function FetchICS() {
    const response = await fetch(UserStore.ical);
    const icsData = await response.text();
    if (response.status !== 200) {
        throw new Error(`Failed to fetch ics: ${response.statusText}`)
    }

    Cache.set('ics', icsData, 1000 * 60 * 60 * 24) // Cache for 24 hours
    return icsData
}

const MarginDiv = ({ children }: { children: React.ReactNode }) => <div style={{ marginTop: 16 }}>{children}</div>


export const ICSEvents = () => {
    if (!UserStore.ical) return null
    const { data, error, isLoading } = useSWR('/ics', async () => {
        const icsData = Cache.get('ics') || await FetchICS()
        return parseToCalendar(icsData)
    })

    if (isLoading) return <MarginDiv>Events Loading...</MarginDiv>
    if (error) {
        console.error(error)
        return <MarginDiv>Error loading events</MarginDiv>
    }
    if (!data) return <MarginDiv>No events data</MarginDiv>

    const { courses, ok } = ParseCourseErr(UserStore.courses)
    const flatCourses = !ok ? null : (!courses ? null : courses.flat())
    const eventsRaw = filterEventWithCourse(data.events, flatCourses)

    if (!eventsRaw || eventsRaw.length === 0) return <div style={{ marginTop: 16 }}>No events</div>

    return <>
        <CurrentEvents eventsRaw={eventsRaw} flatCourse={flatCourses} />
        <UpcomingEvents eventsRaw={eventsRaw} flatCourse={flatCourses} />
    </>
}

const CurrentEvents = ({ eventsRaw, flatCourse }: { eventsRaw: Event[], flatCourse: ICourse[] | null }) => {
    const filter = (events: Event[]) => events.filter((event) => {
        const left = parseICSDate(event.start)
        const right = parseICSDate(event.end)
        if (!left || !right) return false
        return left.getTime() <= Date.now() && right.getTime() >= Date.now()
    })

    return <FilteredEvents
        filter={filter}
        title="Current Events"
        noEvents={<></>}
        eventsRaw={eventsRaw}
        flatCourse={flatCourse}
    />

}

const UpcomingEvents = ({ eventsRaw, flatCourse }: { eventsRaw: Event[], flatCourse: ICourse[] | null }) => {
    const filter = (events: Event[]) => events.filter((event) => {
        const dt = parseICSDate(event.start)
        if (!dt) return true
        return dt.getTime() > Date.now()
    })

    return <FilteredEvents
        filter={filter}
        limit={UserStore.icalCount}
        title="Upcoming Events"
        noEvents={<div>No upcoming events</div>}
        eventsRaw={eventsRaw}
        flatCourse={flatCourse}
    />
};

type filterFx = (events: Event[]) => Event[] | undefined

interface IFilteredEvents {
    filter: filterFx
    limit?: number
    title: string
    noEvents?: React.ReactElement
    eventsRaw: Event[]
    flatCourse: ICourse[] | null
}

const FilteredEvents = ({ filter, limit, title, noEvents, eventsRaw, flatCourse }: IFilteredEvents) => {
    const process = () => {
        console.log('Processing', title)
        const evts = filter(eventsRaw)
        return limit ? evts?.slice(0, limit) : evts
    }

    const [events, setEvents] = React.useState(process())
    useInterval(() => setEvents(process()), 1000 * 60 * 60) // Refresh every hour

    if (!events || events.length === 0) return (
        noEvents ? noEvents : <div>No {title.toLowerCase()}</div>
    )

    return (
        <>
            <h2 style={{ marginBottom: '0.4rem' }}>{title}</h2>
            <Events events={events} flatCourse={flatCourse} />
        </>
    )

}

const Events = ({ events, flatCourse }: { events: Event[], flatCourse: ICourse[] | null }) => {
    const wDim = useScreenSize()
    return (
        <List
            itemLayout="horizontal"
            dataSource={events}
            renderItem={(event) => {
                const ids = EventToScientiaIDs(event)
                let actions = null
                if (ids && ids.length > 0) {
                    const course = flatCourse?.find((course) => ids.includes(course.scientia))
                    if (course) {
                        actions = <>
                            <Link target="_blank" href={CourseToScientia(course)}>Scientia</Link>
                            {` · `}
                            <Link target="_blank" disabled={!course.ed} href={CourseToEd(course)}>Ed</Link>
                            {` · `}
                            <Link target="_blank" disabled={!course.panopto} href={CourseToPanopto(course)}>Panopto</Link>
                        </>
                    } else {
                        actions = <>
                            <Link target="_blank" href={IdToScientia(ids[0])}>Scientia</Link>
                        </>
                    }
                }


                return <List.Item>
                    <List.Item.Meta
                        title={event.summary}
                        style={{ minWidth: '200px' }}
                    />
                    <p style={{ margin: 0 }}>
                        {actions}
                        {wDim.width < 760 ? <br /> : ` · `}
                        {event.location && event.location + ` · `}
                        {ICSDateRangeToString(event.start, event.end)}
                    </p>
                </List.Item>
            }} />
    )
}

const regex = /COMP[0-9]+/g
function EventToScientiaIDs(event: Event): string[] | undefined {
    if (!event.summary) return undefined
    const match = event.summary.match(regex)
    if (!match || match.length === 0) return undefined
    return match.map((m) => m.slice(4))
}