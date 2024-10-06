import { useEffect, useState } from "react";
import { UserStore } from "../../Store/UserStore.ts";
import { List, notification } from "antd";
import { CourseToEd, CourseToIntro, CourseToScientia, ParseCourseErr } from "../../lib/Parser/parser.ts";
import Link from "antd/es/typography/Link";
import { getWindowDimensions } from "../../helper/screen.ts";

export const Course = () => {
    if (!UserStore.courses) return null

    const { courses, ok } = ParseCourseErr(UserStore.courses)
    const [api, contextHolder] = notification.useNotification();

    const [wDim, setWDim] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWDim(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
    }, []);


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
        return wDim.width < 560 ? '' : c
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
                                actions={[
                                    <Link target="_blank" href={CourseToIntro(item)}>Info</Link>,
                                    <Link target="_blank" href={CourseToScientia(item)}>Scientia{quote(` (${item.scientia})`)}</Link>,
                                    <Link disabled={!item.ed} target="_blank" href={CourseToEd(item)}>Ed{quote(` (${item.ed ? item.ed : 'N/A'})`)}</Link>
                                ]}
                            >

                                <List.Item.Meta
                                    title={item.name}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            })
        }
    </>
}