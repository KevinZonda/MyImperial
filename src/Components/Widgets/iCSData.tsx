import useSWR from "swr"
import { Cache } from "../../Store/Cache.ts";
import { UserStore } from "../../Store/UserStore"
import { parseToCalendar } from "../../lib/ICS/parser.ts";
import { ICourse, ParseCourseErr } from "../../lib/Parser/parser.ts";
import { Calendar, Event } from "ikalendar";

export async function FetchICS() {
    const response = await fetch(UserStore.ical);
    const icsData = await response.text();
    if (response.status !== 200) {
        throw new Error(`Failed to fetch ics: ${response.statusText}`)
    }

    Cache.set('ics', icsData, 1000 * 60 * 60 * 24) // Cache for 24 hours
    return icsData
}

export const useICSData = () => {
    if (!UserStore.ical) return { data: null, error: undefined, isLoading: false }
    const { data, error, isLoading } = useSWR('/ics', async () => {
        const icsData = Cache.get('ics') || await FetchICS()
        return parseToCalendar(icsData)
    })
    return { data, error, isLoading }
}

export function filterEventWithCourse(events: Event[] | undefined, courses: ICourse[] | null): Event[] | undefined {
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

const regex = /COMP[0-9]+/g
export function EventToScientiaIDs(event: Event): string[] | undefined {
    if (!event.summary) return undefined
    const match = event.summary.match(regex)
    if (!match || match.length === 0) return undefined
    return match.map((m) => m.slice(4))
}

export function EventsWithCourse(data: Calendar) {
    const { courses, ok } = ParseCourseErr(UserStore.courses)
    const flatCourses = !ok ? null : (!courses ? null : courses.flat())
    return { events: filterEventWithCourse(data.events, flatCourses), courses: flatCourses }
}