import useSWR from "swr";
import { ComplexDate, Parser } from "ikalendar";
import { List } from "antd";
import { UserStore } from "./Store/UserStore";
import { Cache } from "./Store/Cache";
import { Event } from "ikalendar";
import { ParseCourseErr } from "./lib/Parser/parser";

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

function parseICSDate(x: string | ComplexDate): Date | undefined {
    if (typeof x === 'string') {
        return iCalDate(x)
    }
    return iCalDate(x.value)
}

function iCSDateToString(x: string | ComplexDate | undefined): string {
    if (!x) return "N/A"
    const date = parseICSDate(x)
    if (!date) return "N/A"
    const pad = (num: number) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function filterEventWithCourse(events: Event[] | undefined): Event[] | undefined {
    if (!UserStore.icalOnlyShowRelatedCourse) return events
    if (!events) return undefined
    const { courses, ok } = ParseCourseErr(UserStore.courses)
    if (!ok) return events
    if (!courses || courses.length === 0) return events
    const courseCodes = courses.flat().map((course) => 'COMP' + course.scientia + ' - ' + course.name)
    return events.filter((event) => {
        if (!event.summary) return true
        if (!event.summary.startsWith('COMP')) return true
        return courseCodes.includes(event.summary)
    })
}

export async function FetchICS() {
    const response = await fetch(UserStore.ical);
    const icsData = await response.text();

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
    const eventsRaw = filterEventWithCourse(data.events)

    if (!eventsRaw || eventsRaw.length === 0) return <div style={{ marginTop: 16 }}>No events</div>

    return <>
        <CurrentEvents eventsRaw={eventsRaw} />
        <UpcomingEvents eventsRaw={eventsRaw} />
    </>
}

const CurrentEvents = ({ eventsRaw }: { eventsRaw: Event[] }) => {
    const events = eventsRaw.filter((event) => {
        if (!event.start || !event.end) return false
        const left = parseICSDate(event.start)
        if (!left) return false
        const right = parseICSDate(event.end)
        if (!right) return false
        return left.getTime() <= Date.now() && right.getTime() >= Date.now()
    });
    if (!events || events.length === 0) return null
    return (
        <div className="ics-current-events">
            <h2 style={{ marginBottom: '0.4rem' }}>Current Events</h2>
            <Events events={events} />
        </div>
    )

}

const UpcomingEvents = ({ eventsRaw }: { eventsRaw: Event[] }) => {
    const events = eventsRaw.filter((event) => {
        if (!event.start) return true
        const dt = parseICSDate(event.start)
        if (!dt) return true
        return dt.getTime() > Date.now()
    }).slice(0, UserStore.icalCount);
    if (!events || events.length === 0) return <div>No upcoming events</div>

    return (
        <div className="ics-upcoming-events">
            <h2 style={{ marginBottom: '0.4rem' }}>Upcoming Events</h2>
            <Events events={events} />
        </div>
    );
};

const Events = ({ events }: { events: Event[] }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={events}
            renderItem={(event) => (
                <List.Item>
                    <List.Item.Meta
                        title={event.summary}
                        style={{ minWidth: '200px' }}
                    />
                    <p style={{ margin: 0 }}>
                        {event.location ? event.location + ` · ` : "N/A"}
                        {iCSDateToString(event.start)} - {iCSDateToString(event.end)}
                    </p>
                </List.Item>
            )} />
    )
}