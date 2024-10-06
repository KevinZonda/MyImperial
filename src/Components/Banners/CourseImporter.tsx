import { Button, Checkbox, Modal, Space } from "antd";
import { EventToScientiaIDs, useICSData } from "../Widgets/iCSData"
import { useState } from "react";
import { UserStore } from "../../Store/UserStore";
import { Refresh } from "../../lib/helper/browser";
import { ParseCourseErr } from "../../lib/Parser/parser";

const splitOnce = (str: string, separator: string) => {
    const i = str.indexOf(separator);
    return [str.slice(0, i), str.slice(i + 1)];
}

function initialSelection(): Record<string, boolean> {
    const { courses, ok } = ParseCourseErr(UserStore.courses)
    if (!ok || !courses) {
        return {}
    }
    const buf: Record<string, boolean> = {}
    const flat = courses.flat()
    for (const course of flat) {
        buf[course.scientia] = true
    }
    return buf
}
export const ImportFromCalendarBtn = () => {
    const [selection, setSelection] = useState<Record<string, boolean>>(initialSelection())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data, error, isLoading } = useICSData()
    if (isLoading) return <div>Events Loading...</div>
    if (error) {
        console.error(error)
        return <div>Error loading events</div>
    }
    if (!data) return <div>No events data</div>

    const getSelection = (id: string) => {
        return selection[id] ?? false
    }

    const onCancel = () => {
        setIsModalOpen(false)
    }

    const mods: Record<string, string> = {}


    for (const event of data.events!) {
        const summary = event.summary
        if (!summary) continue
        const ids = EventToScientiaIDs(event)
        if (!ids) continue
        const parts = splitOnce(summary, '-')
        if (parts.length !== 2) continue
        const title = parts[1].split('(')[0].trim()
        for (const id of ids) {
            mods[id] = title
        }
    }

    const onOk = () => {
        let txt = ''
        for (const [id, selected] of Object.entries(selection)) {
            if (!selected) {
                continue
            }
            txt += `${id} | ${mods[id]}\n`
        }
        UserStore.courses = txt
        setIsModalOpen(false)
        Refresh()
    }




    return <>
        <Button disabled={!UserStore.ical} onClick={() => { setIsModalOpen(true) }}>
            Import from calendar
        </Button>

        <Modal title="Import Modules from Calendar" open={isModalOpen} onOk={onOk} onCancel={onCancel} footer={[
            <Button key="back" onClick={onCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onOk}>
                Override Old Modules
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(mods).map(([id, title]) => <>
                    <Checkbox checked={getSelection(id)} onChange={(e) => {
                        setSelection({ ...selection, [id]: e.target.checked })
                    }}>COMP{id} - {title}</Checkbox>
                </>)}
            </Space>
        </Modal>
    </>

}