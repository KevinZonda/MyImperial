import useSWR from "swr";
import { ComplexDate, Parser } from "ikalendar";
import { List } from "antd";
import { UserStore } from "./Store/UserStore";

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

export const ICSEvents = () => {
    if (!UserStore.ical) return null
    const { data, error, isLoading } = useSWR('/ics', async () => {
        const response = await fetch(UserStore.ical);
        const icsData = await response.text();
        const parser = new Parser()

        return parser.parse(icsData)
    })

    if (isLoading) return <div>Events Loading...</div>
    if (error) return <div>Error loading events</div>
    if (!data) return <div>No events data</div>

    const dt = data
    if (!dt) return <div>Error parsing events</div>
    const events = dt.events!.filter((event) => {
        if (!event.start) return false
        const dt = parseICSDate(event.start)
        if (!dt) return false
        return dt.getTime() > Date.now()
    }).slice(0, UserStore.icalCount);
    if (!events || events.length === 0) return <div>No upcoming events</div>

    return (
        <div className="ics-events">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <List
                itemLayout="horizontal"
                dataSource={events}
                renderItem={(event) => (
                    <List.Item>
                        <List.Item.Meta
                            title={event.summary}
                        />
                        <p style={{ margin: 0 }}>
                            {event.location ? event.location + ` · ` : "N/A"}
                            {iCSDateToString(event.start)} - {iCSDateToString(event.end)}
                        </p>
                    </List.Item>
                )} />

        </div>
    );
};
