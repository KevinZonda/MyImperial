import { useState } from "react";
import { Button, Modal, Space } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { ExportBtn } from "./export.tsx";
import { ImportBtn } from "./import.tsx";

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