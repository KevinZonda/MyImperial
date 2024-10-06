import { QuestionOutlined } from "@ant-design/icons"
import { Button } from "antd"

export const DocumentBtn = () => {
    return <Button onClick={() => {
        window.open('https://github.com/KevinZonda/MyImperial/tree/master/docs', "_blank")
    }} icon={<QuestionOutlined />}>Guide</Button>
}