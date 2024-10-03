import { useEffect, useState } from "react";
import { UserStore } from "./Store/UserStore";
import { Refresh } from "./helper/browser";
import { FormOutlined } from "@ant-design/icons";
import { Button, Input, List, Modal, notification, Space } from "antd";
import { CourseToEd, CourseToIntro, CourseToScientia, ParseCourseErr } from "./lib/Parser/parser";
import Link from "antd/es/typography/Link";

const { TextArea } = Input;

export const CourseSettingBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [course, setCourse] = useState(UserStore.courses)
    const onCancel = () => {
        setCourse(UserStore.courses)
        setIsModalOpen(false)
    }

    const onOk = () => {
        UserStore.courses = course
        setIsModalOpen(false)
        Refresh()
    }


    return <>

        <Button type="primary"
            icon={<FormOutlined />}
            onClick={() => {
                setIsModalOpen(true)
            }} />


        <Modal title="Modify Your Modules" open={isModalOpen} onOk={onOk} onCancel={onCancel} footer={[
            <Button key="back" onClick={onCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onOk}>
                Save
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <p style={{ marginBottom: 0 }}>Enter course line by line with <code>Course_Name | Scientia_ID | Ed_ID</code> format.</p>
                <TextArea rows={10} value={course} onChange={(e) => setCourse(e.target.value)} />
            </Space>
        </Modal>

    </>
}

export const CourseSection = () => {
    if (!UserStore.courses) return null

    const { courses, ok } = ParseCourseErr(UserStore.courses)
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (ok) {
            return
        }
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
    return <>
        <h2>Modules</h2>

        {
            courses && courses.map((group, i) => {
                return <div key={i}>
                    <h3>Group {i + 1}</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={group}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Link href={CourseToIntro(item)}>Info</Link>,
                                    <Link href={CourseToScientia(item)}>Scientia ({item.scientia})</Link>,
                                    <Link disabled={!item.ed} key={CourseToEd(item)}>Ed ({item.ed ? item.ed : 'N/A'})</Link>]}
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