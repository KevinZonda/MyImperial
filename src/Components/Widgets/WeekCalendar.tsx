import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { UserStore } from '../../Store/UserStore'
import { CourseToEd, CourseToPanopto, CourseToScientia, IdToScientia } from '../../lib/Parser/parser'
import { ICSDateRangeToString, parseICSDate } from '../../lib/ICS/Date'

import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { enGB } from 'date-fns/locale/en-GB'
import { Modal } from 'antd'
import { EventsWithCourse, EventToScientiaIDs, useICSData } from './iCSData'
import Link from 'antd/es/typography/Link'
import { splitOnce } from '../../lib/helper/text'


const locales = {
    'en-GB': enGB,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const WeekCalendar = () => {
    if (!UserStore.ical) return null
    const { data, error, isLoading } = useICSData()

    if (isLoading) return <NoEventCalendar />
    if (error) return <NoEventCalendar />
    if (!data) return <NoEventCalendar />

    const { events, courses } = EventsWithCourse(data)

    return (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
            <Calendar
                events={events?.map((event) => ({
                    title: event.summary,
                    start: parseICSDate(event.start),
                    end: parseICSDate(event.end),
                    data: event
                }))}
                startAccessor="start"
                endAccessor="end"
                localizer={localizer}
                style={{ height: 500 }}
                enableAutoScroll={true}
                defaultView='week'
                scrollToTime={new Date()}
                onSelectEvent={(e) => {
                    const ids = EventToScientiaIDs(e.data)
                    let actions = null
                    if (ids && ids.length > 0) {
                        const course = courses?.find((course) => ids.includes(course.scientia))
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

                    Modal.info({
                        title: e.title,
                        content: (
                            <div>
                                {e.data.description && <p>{
                                    e.data.description.split('\n').map((x) => {
                                        const sp = splitOnce(x, ':')

                                        return sp.length === 2 ? <span><b>{sp[0]}:</b> {sp[1]}<br /></span> : <>{x}<br /></>
                                    })}</p>}
                                <p>{e.data.location}</p>
                                {ICSDateRangeToString(e.data.start, e.data.end)}
                                {actions && <p>{actions}</p>}
                            </div>
                        ),
                    });
                }}
            />
        </div>

    );
}

const NoEventCalendar = () => {
    return <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Calendar
            startAccessor="start"
            endAccessor="end"
            localizer={localizer}
            style={{ height: 500 }}
            enableAutoScroll={true}
            defaultView='week'
            scrollToTime={new Date()}
        />
    </div>
}
export default WeekCalendar;