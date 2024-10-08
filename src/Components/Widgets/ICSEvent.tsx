import { List, Modal } from "antd";
import { UserStore } from "../../Store/UserStore.ts";
import { Event } from "ikalendar";
import { CourseToEd, CourseToPanopto, CourseToScientia, ICourse, IdToScientia } from "../../lib/Parser/parser.ts";
import Link from "antd/es/typography/Link";
import React from "react";
import { useInterval } from "usehooks-ts";
import { useScreenSize } from "../../lib/helper/screen.tsx";
import { ICSDateRangeToString, parseICSDate } from "../../lib/ICS/Date.ts";
import { EventsWithCourse, EventToScientiaIDs, useICSData } from "./iCSData.tsx";
import { splitOnce } from "../../lib/helper/text.ts";

const MarginDiv = ({ children }: { children: React.ReactNode }) => <div style={{ marginTop: 16 }}>{children}</div>

export const ICSEvents = () => {
    if (!UserStore.ical) return null
    const { data, error, isLoading } = useICSData()

    if (isLoading) return <MarginDiv>Events Loading...</MarginDiv>
    if (error) {
        console.error(error)
        return <MarginDiv>Error loading events</MarginDiv>
    }
    if (!data) return <MarginDiv>No events data</MarginDiv>

    const { events, courses } = EventsWithCourse(data)

    if (!events || events.length === 0) return <div style={{ marginTop: 16 }}>No events</div>

    return <>
        <CurrentEvents eventsRaw={events} flatCourse={courses} />
        <UpcomingEvents eventsRaw={events} flatCourse={courses} />
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


                return <List.Item >
                    <div className="ant-list-item-meta" onClick={() => { ModalEvent(event, actions) }} style={{ cursor: 'pointer' }}>
                        <List.Item.Meta
                            title={event.summary}
                            style={{ minWidth: '200px' }}
                        />
                    </div>

                    <p style={{ margin: 0 }}>
                        {actions}
                        {actions && (wDim.width < 760 ? <br /> : ` · `)}
                        {event.location && event.location + ` · `}
                        {ICSDateRangeToString(event.start, event.end)}
                    </p>
                </List.Item>
            }} />
    )
}


export const ModalEvent = (e: Event, actions: React.ReactElement | null) => {
    Modal.info({
        title: e.summary,
        content: (
            <div>
                {e.description && <p style={{ margin: 0 }}>{
                    e.description.split('\n').map((x) => {
                        const sp = splitOnce(x, ':')

                        return sp.length === 2
                            ? <span><b>{sp[0]}:</b> {sp[1]}<br /></span>
                            : <>{x}<br /></>
                    })}</p>}
                <p>

                    <span><b>Location:</b> {e.location}</span><br />
                    <span><b>Time:</b> {ICSDateRangeToString(e.start, e.end)}</span>
                </p>
                {actions && <p>{actions}</p>}
            </div>
        ),
    });
}