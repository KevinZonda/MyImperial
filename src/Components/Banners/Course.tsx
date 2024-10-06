import { useState } from "react";
import { UserStore } from "../../Store/UserStore";
import { Refresh } from "../../helper/browser";
import { FormOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";

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
                <p style={{ marginBottom: 0 }}>Enter course line by line with <code>scientiaID | courseName | edID</code> format.</p>
                <TextArea style={{
                    fontFamily: 'monospace',
                }} rows={10} value={course} onChange={(e) => setCourse(e.target.value)} />
            </Space>
        </Modal>

    </>
}