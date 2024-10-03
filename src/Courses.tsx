import { useState } from "react";
import { UserStore } from "./Store/UserStore";
import { Refresh } from "./helper/browser";
import { FormOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import { CourseToEd, CourseToScientia, ParseCourse } from "./lib/Parser/parser";

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


        <Modal title="Modify Your Course Setting" open={isModalOpen} onOk={onOk} onCancel={onCancel} footer={[
            <Button key="back" onClick={onCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onOk}>
                Save
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <p style={{marginBottom: 0}}>Enter course line by line with <code>Course_Name | Scientia_ID | Ed_ID</code> format.</p>
                <TextArea rows={10} value={course} onChange={(e) => setCourse(e.target.value)} />
            </Space>
        </Modal>

    </>
}

export const CourseSection = () => {
    if (!UserStore.courses) return null
    const courses = ParseCourse(UserStore.courses)
    return <>
        <h2>Modules</h2>
        {
            courses.map((group, i) => {
                return <div key={i}>
                    <h3>Group {i + 1}</h3>
                    <ul>
                        {
                            group.map((c, j) => {
                                return <li key={j}>
                                    {c.name} <a href={CourseToScientia(c)}>Scientia ({c.scientia})</a> | <a href={CourseToEd(c)}>Ed ({c.ed ? c.ed : 'N/A'})</a>
                                </li>
                            })
                        }
                    </ul>
                </div>
            })
        }
    </>
}