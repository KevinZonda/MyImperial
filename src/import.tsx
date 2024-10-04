import { useState } from "react";
import { UserStore } from "./Store/UserStore";
import { Button, Modal, notification, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CloudUploadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Refresh } from "./helper/browser";
import { ExportBtn } from "./export";

export const ImportBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importValue, setImportValue] = useState("")
    const [api, contextHolder] = notification.useNotification();

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const onSave = () => {
        let success = true
        try {
            UserStore.import(importValue)
        } catch (e) {
            success = false
            api.error({
                message: 'Import Failed',
                description: String(e)
            })
            return
        }
        if (success) {
            closeModal()
            Refresh()
        }
    }


    return <>
        {contextHolder}
        <Button type="primary" onClick={() => { setIsModalOpen(true) }} icon={<CloudUploadOutlined />}>
            Import
        </Button>


        <Modal title="Import" open={isModalOpen} onOk={onSave} onCancel={closeModal} footer={[
            <Button key="back" onClick={closeModal}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onSave}>
                Save
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea style={{
                    fontFamily: 'monospace',
                }} rows={10} value={importValue} onChange={(e) => setImportValue(e.target.value)} />
            </Space>
        </Modal>

    </>
}


export const ShareBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false)
    }

    return <>
        <Button type="primary" onClick={() => { setIsModalOpen(true) }} icon={<ShareAltOutlined />} />


        <Modal title="Share Your Config" open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={[
            <Button key="back" onClick={closeModal}>
                Cancel
            </Button>
        ]}>
            <Space direction="horizontal" style={{ width: '100%' }}>
                <ImportBtn />
                <ExportBtn />
            </Space>
        </Modal>

    </>
}