import { useEffect } from "react";
import { UserStore } from "../../Store/UserStore.ts";
import { List, notification } from "antd";
import { CourseToEd, CourseToIntro, CourseToPanopto, CourseToScientia, ParseCourseErr } from "../../lib/Parser/parser.ts";
import Link from "antd/es/typography/Link";
import { useScreenSize } from "../../lib/helper/screen.tsx";

export const Course = () => {
    if (!UserStore.courses) return null

    const { courses, ok } = ParseCourseErr(UserStore.courses)
    const [api, contextHolder] = notification.useNotification();

    const wDim = useScreenSize();


    useEffect(() => {
        if (ok)  return
        api.error({
            message: 'Error',
            description: 'Invalid course format, please check and try again.',
        });
    }, [ok])
    if (!ok) {
        return <>
            {contextHolder}
        </>
    }

    const quote = (c: string) => {
        return wDim.width < 660 ? '' : c
    }
    return <>
        <h2>Modules</h2>

        {
            courses && courses.map((group, i) => {
                return <div key={i}>
                    <h3 style={{ marginBottom: '0.2rem' }}>Group {i + 1}</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={group}
                        renderItem={(item) => (
                            <List.Item
                                actions={
                                    wDim.width >= 500 ? [
                                    <Link target="_blank" href={CourseToIntro(item)}>Info</Link>,
                                    <Link target="_blank" href={CourseToScientia(item)}>Scientia{quote(` (${item.scientia})`)}</Link>,
                                    <Link target="_blank" disabled={!item.ed} href={CourseToEd(item)}>Ed{quote(` (${item.ed ? item.ed : 'N/A'})`)}</Link>,
                                    <Link target="_blank" disabled={!item.panopto} href={CourseToPanopto(item)}>Panopto</Link>
                                ] : undefined}
                            >

                                <List.Item.Meta
                                    title={item.name}
                                    style={{ minWidth: '180px' }}
                                    description={wDim.width < 500 && <>
                                    <Link target="_blank" href={CourseToIntro(item)}>Info</Link>
                                    { ` · ` }
                                    <Link target="_blank" href={CourseToScientia(item)}>Scientia{quote(` (${item.scientia})`)}</Link>
                                    { ` · ` }
                                    <Link target="_blank" disabled={!item.ed} href={CourseToEd(item)}>Ed{quote(` (${item.ed ? item.ed : 'N/A'})`)}</Link>
                                    { ` · ` }
                                    <Link target="_blank" disabled={!item.panopto} href={CourseToPanopto(item)}>Panopto</Link>
                            
                                    </>}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            })
        }
    </>
}