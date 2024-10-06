import { useState } from "react";
import { UserStore } from "../../Store/UserStore.ts";
import { Button, Modal, notification, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CloudDownloadOutlined } from "@ant-design/icons";

export const ExportBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const closeModal = () => {
        setIsModalOpen(false)
    }


    return <>
        {contextHolder}
        <Button type="primary" onClick={() => { setIsModalOpen(true) }}
            icon={<CloudDownloadOutlined />}
        >
            Export
        </Button>


        <Modal title="Export" open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={[
            <Button key="copy" onClick={() => {
                navigator.clipboard.writeText(UserStore.export()).then(() => {
                    api.success({
                        message: 'Copied',
                        description: 'Your data has been copied to clipboard'
                    })
                })
            }}>
                Copy
            </Button>,

            <Button key="submit" type="primary" onClick={closeModal}>
                OK
            </Button>,
        ]}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea style={{
                    fontFamily: 'monospace',
                }} readOnly={true} rows={10} value={UserStore.export()} />
            </Space>
        </Modal>

    </>
}