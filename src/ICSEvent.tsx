import useSWR from "swr";
import { ComplexDate, Parser } from "ikalendar";
import { List } from "antd";
import { UserStore } from "./Store/UserStore";
import { Cache } from "./Store/Cache";
import { Event } from "ikalendar";
import { CourseToEd, ICourse, IdToScientia, ParseCourseErr } from "./lib/Parser/parser";
import Link from "antd/es/typography/Link";

function iCalDate(x: string): Date | undefined {
    try {
        const year = parseInt(x.slice(0, 4));
        const month = parseInt(x.slice(4, 6)) - 1; // Month is 0-indexed in JS Date
        const day = parseInt(x.slice(6, 8));
        const hours = parseInt(x.slice(9, 11));
        const minutes = parseInt(x.slice(11, 13));
        const seconds = parseInt(x.slice(13, 15));
        return new Date(year, month, day, hours, minutes, seconds);
    } catch (e) {
        console.error(e)
        return undefined
    }
}

function parseICSDate(x: string | ComplexDate | undefined): Date | undefined {
    if (!x) return undefined
    if (typeof x === 'string') {
        return iCalDate(x)
    }
    return iCalDate(x.value)
}

const pad = (num: number) => num.toString().padStart(2, '0');

function dateToTime(date: Date) {
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${hours}:${minutes}`
}

function dateToDate(date: Date) {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`
}

function dateToFullDate(date: Date | undefined) {
    if (!date) return 'N/A'
    return `${dateToDate(date)} ${dateToTime(date)}`
}

function iCSTDateRangeToString(start: string | ComplexDate | undefined, end: string | ComplexDate | undefined): string {
    const left = parseICSDate(start)
    const right = parseICSDate(end)
    if (left && right) {
        const leftDate = dateToDate(left)
        const leftTime = dateToTime(left)
        const rightDate = dateToDate(right)
        const rightTime = dateToTime(right)
        return leftDate === rightDate
            ? `${leftDate} ${leftTime} - ${rightTime}`
            : `${leftDate} ${leftTime} - ${rightDate} ${rightTime}`
    }
    return `${dateToFullDate(left)} - ${dateToFullDate(right)}`
}

function filterEventWithCourse(events: Event[] | undefined, courses: ICourse[] | null): Event[] | undefined {
    if (!UserStore.icalOnlyShowRelatedCourse) return events
    if (!events) return undefined
    if (!courses || courses.length === 0) return events
    const courseCodes = courses.map((course) => 'COMP' + course.scientia + ' - ' + course.name)
    return events.filter((event) => {
        if (!event.summary) return true
        if (!event.summary.startsWith('COMP')) return true
        return courseCodes.includes(event.summary)
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

function parse(x: string) {
    const parser = new Parser()
    return parser.parse(x)
}


export const ICSEvents = () => {
    if (!UserStore.ical) return null
    const { data, error, isLoading } = useSWR('/ics', async () => {
        const cached = Cache.get('ics')
        if (cached) {
            return parse(cached)
        }
        const icsData = await FetchICS()
        return parse(icsData)
    })

    if (isLoading) return <div style={{ marginTop: 16 }}>Events Loading...</div>
    if (error) return <div style={{ marginTop: 16 }}>Error loading events</div>
    if (!data) return <div style={{ marginTop: 16 }}>No events data</div>

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
    const events = eventsRaw.filter((event) => {
        const left = parseICSDate(event.start)
        const right = parseICSDate(event.end)
        if (!left || !right) return false
        return left.getTime() <= Date.now() && right.getTime() >= Date.now()
    });
    if (!events || events.length === 0) return null
    return (
        <div className="ics-current-events">
            <h2 style={{ marginBottom: '0.4rem' }}>Current Events</h2>
            <Events events={events} flatCourse={flatCourse} />
        </div>
    )

}

const UpcomingEvents = ({ eventsRaw, flatCourse }: { eventsRaw: Event[], flatCourse: ICourse[] | null }) => {
    const events = eventsRaw.filter((event) => {
        const dt = parseICSDate(event.start)
        if (!dt) return true
        return dt.getTime() > Date.now()
    }).slice(0, UserStore.icalCount);
    if (!events || events.length === 0) return <div>No upcoming events</div>

    return (
        <div className="ics-upcoming-events">
            <h2 style={{ marginBottom: '0.4rem' }}>Upcoming Events</h2>
            <Events events={events} flatCourse={flatCourse} />
        </div>
    );
};

const Events = ({ events, flatCourse }: { events: Event[], flatCourse: ICourse[] | null }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={events}
            renderItem={(event) => {
                const id = EventToScientiaID(event)
                let actions = null
                if (id) {
                    const ed = flatCourse?.find((course) => course.scientia === id)

                    actions = <>
                        <Link target="_blank" href={IdToScientia(id)}>Scientia</Link>
                        {` · `}
                        {ed &&
                            <> <Link target="_blank" href={CourseToEd(ed)}>Ed</Link>
                                {` · `}
                            </>
                        }
                    </>
                }


                return <List.Item>
                    <List.Item.Meta
                        title={event.summary}
                        style={{ minWidth: '200px' }}
                    />
                    <p style={{ margin: 0 }}>
                        {actions}
                        {event.location ? event.location + ` · ` : "N/A"}
                        {iCSTDateRangeToString(event.start, event.end)}
                    </p>
                </List.Item>
            }} />
    )
}

const regex = /COMP[0-9]+/
function EventToScientiaID(event: Event): string | undefined {
    if (!event.summary) return undefined
    const match = event.summary.match(regex)
    if (!match || match.length === 0) return undefined
    // remove COMP prefix
    return match[0].slice(4)
}