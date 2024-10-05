import { useState } from "react";
import { UserStore } from "./Store/UserStore";
import { CalendarOutlined, IdcardOutlined, MailOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Refresh } from "./helper/browser";
import { Button, Input, Modal, Space } from "antd";

export const SettingsBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shortCode, setShortCode] = useState(UserStore.shortCode)
    const [cid, setCid] = useState(UserStore.cid)
    const [name, setName] = useState(UserStore.name)
    const [pubName, setPubName] = useState(UserStore.pubName)
    const [iCal, setICal] = useState(UserStore.ical)
    const onCancel = () => {
        setShortCode(UserStore.shortCode)
        setCid(UserStore.cid)
        setName(UserStore.name)
        setPubName(UserStore.pubName)
        setICal(UserStore.ical)
        setIsModalOpen(false)
    }

    const onOk = () => {
        UserStore.shortCode = shortCode
        UserStore.cid = cid
        UserStore.name = name
        UserStore.pubName = pubName
        UserStore.ical = iCal
        setIsModalOpen(false)
        Refresh()
    }


    return <>

        <Button type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
                setIsModalOpen(true)
            }} />


        <Modal title="Settings" open={isModalOpen} onOk={onOk} onCancel={onCancel} footer={[
            <Button key="clear" danger onClick={() => {
                UserStore.name = ""
                UserStore.shortCode = ""
                UserStore.cid = ""
                UserStore.pubName = ""
                Refresh()
            }}>
                Clear
            </Button>,
            <Button key="back" onClick={onCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onOk}>
                Save
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input size="large" placeholder="Name" prefix={<UserOutlined />} value={name} onChange={(e) => setName(e.target.value)} />
                <Input size="large" placeholder="Short code" prefix={<MailOutlined />} value={shortCode} onChange={(e) => setShortCode(e.target.value)} />
                <Input size="large" placeholder="College ID" prefix={<IdcardOutlined />} value={cid} onChange={(e) => setCid(e.target.value)} />
                <Input size="large" placeholder="Public Name" prefix={<TeamOutlined />} value={pubName} onChange={(e) => setPubName(e.target.value)} />
                <Input size="large" placeholder="iCal (.ics) URL" prefix={<CalendarOutlined />} value={iCal} onChange={(e) => setICal(e.target.value)} />
            </Space>
        </Modal>

    </>
}