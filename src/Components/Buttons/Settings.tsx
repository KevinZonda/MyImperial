import { useState } from "react";
import { UserStore } from "../../Store/UserStore.ts";
import { CalendarOutlined, IdcardOutlined, MailOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Refresh } from "../../lib/helper/browser.ts";
import { Button, Input, InputNumber, Modal, notification, Space, Switch, Tooltip } from "antd";
import { FetchICS } from "../Widgets/iCSData.tsx";
import { Cache } from "../../Store/Cache.ts";
import { DocumentBtn } from "./Document.tsx";

export const SyncCalendarBtn = () => {
    const [api, contextHolder] = notification.useNotification();

    const onSync = async () => {
        try {
            await FetchICS()
            api.success({
                message: 'Sync Success',
                description: 'Your calendar has been synced'
            })
        } catch (e) {
            api.error({
                message: 'Sync Failed',
                description: String(e)
            })
            return
        }
    }

    return <>
        {contextHolder}
        <Button onClick={onSync} icon={<CalendarOutlined />}>
            Sync Calendar
        </Button>
    </>
}


export const SettingsBtn = () => {
    const isUsingCOPxS = UserStore.ical.startsWith("https://ical.kevinzonda.com/")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shortCode, setShortCode] = useState(UserStore.shortCode)
    const [cid, setCid] = useState(UserStore.cid)
    const [name, setName] = useState(UserStore.name)
    const [pubName, setPubName] = useState(UserStore.pubName)
    const [iCal, setICal] = useState(UserStore.ical)
    const [iCalCount, setICalCount] = useState(UserStore.icalCount)
    const [iCalProxy, setICalProxy] = useState(isUsingCOPxS)
    const [iCalOnlyRelated, setICalOnlyRelated] = useState(UserStore.icalOnlyShowRelatedCourse)
    const onCancel = () => {
        setShortCode(UserStore.shortCode)
        setCid(UserStore.cid)
        setName(UserStore.name)
        setPubName(UserStore.pubName)
        setICal(UserStore.ical)
        setICalCount(UserStore.icalCount)
        setICalProxy(isUsingCOPxS)
        setICalOnlyRelated(UserStore.icalOnlyShowRelatedCourse)
        setIsModalOpen(false)
    }

    const iCalUrl = () => {
        if (iCal.startsWith("https://outlook.office365.com/") && iCalProxy) {
            return iCal.replace("https://outlook.office365.com/", "https://ical.kevinzonda.com/")
        }
        return iCal
    }

    const onOk = () => {
        UserStore.shortCode = shortCode
        UserStore.cid = cid
        UserStore.name = name
        UserStore.pubName = pubName
        UserStore.icalOnlyShowRelatedCourse = iCalOnlyRelated
        const ical = iCalUrl()
        if (ical !== UserStore.ical) {
            Cache.remove("ics")
        }
        UserStore.ical = ical
        if (UserStore.icalCount >= 0) UserStore.icalCount = iCalCount
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
                UserStore.ical = ""
                UserStore.icalCount = 5
                UserStore.icalOnlyShowRelatedCourse = false
                Refresh()
            }}>
                Reset to default
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
                <InputNumber size="large" prefix={<><CalendarOutlined /> &nbsp; Event Count</>} style={{ width: '100%' }} value={iCalCount} onChange={(e) => e && setICalCount(e)} />
                <Space direction="horizontal">
                    <Switch checked={iCalOnlyRelated} onChange={(e) => setICalOnlyRelated(e)} />
                    <Tooltip title="Only show events related to your courses. You have to set modules correctly in order to make the filter can work.">
                        <span style={{ textDecoration: "underline dotted" }}>Only show related courses</span>
                    </Tooltip>
                </Space>
                <Space direction="horizontal">
                    <Switch checked={iCalProxy} onChange={(e) => setICalProxy(e)} />
                    <Tooltip title="Due to Microsoft's CORS policy, Outlook/Office365's iCalendar/ICS links will not work properly. You can proxy your ICS link through KevinZonda's server to bypass this restriction, or host your own proxy by following the instruction in the GitHub. Visit GitHub for further information.">
                        <span style={{ textDecoration: "underline dotted" }}>Use KevinZonda OCPxS (Outlook iCalendar Proxy Service) to bypass Microsoft's CORS restriction. Enable this will transfer your iCal data through KevinZonda's server, but no data will be stored on the server.</span>
                    </Tooltip>

                </Space>
                <Space direction="horizontal">
                    <DocumentBtn />
                    <SyncCalendarBtn />
                </Space>
            </Space>
        </Modal>

    </>
}