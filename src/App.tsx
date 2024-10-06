import { Button, Space } from 'antd'
import { URLList } from './Components/Widgets/URLs.tsx'
import Title from 'antd/es/typography/Title';
import { UserStore } from './Store/UserStore';
import { COLOUR_IMPERIAL_BLUE } from './const/Colour';
import { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined, GithubOutlined, SyncOutlined } from '@ant-design/icons';
import { Refresh } from './helper/browser';
import { WeatherBanner } from './Components/Banners/Weather.tsx';
import { Course } from './Components/Widgets/Courses.tsx';
import { SettingsBtn } from './Components/Buttons/Settings.tsx';
import { Footer } from './Components/Widgets/Footer.tsx';
import { ICSEvents } from './Components/Widgets/ICSEvent.tsx';
import { Underground } from './Components/Banners/Underground.tsx';
import { CID } from './Components/Banners/CID.tsx';
import { CourseSettingBtn } from "./Components/Banners/Course.tsx";
import { ShareBtn } from "./Components/Banners/Share.tsx";

const Welcome = ({ hide }: { hide: boolean }) => {
    const titleStyle: React.CSSProperties = {
        color: COLOUR_IMPERIAL_BLUE,
        margin: 0,
    }
    const name = hide ? UserStore.pubName : UserStore.name
    if (!name) return <Title style={titleStyle} level={1}>KevinZonda :: My Imperial</Title>
    return <Title style={titleStyle} level={1}>Hi, {name}</Title>
}


function App() {
    const [hide, setHide] = useState(false)

    return (
        <>
            <div style={{ margin: 32 }}>
                <Welcome hide={hide} />
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    {!hide && <CID />}
                    <WeatherBanner />
                    <Underground />
                </div>

                <Space direction="horizontal">
                    <Button type="primary" onClick={Refresh} icon={<SyncOutlined />} />
                    <SettingsBtn />
                    <Button type={!hide ? 'primary' : undefined} onClick={() => setHide(!hide)} icon={hide ? <EyeInvisibleOutlined /> : <EyeOutlined />} />
                    <CourseSettingBtn />
                    <Button type="primary" onClick={() => window.open("https://github.com/KevinZonda/MyImperial", "_blank")} icon={<GithubOutlined />} />
                    <ShareBtn />
                </Space>
                <ICSEvents />
                <Course />
                <URLList />
            </div>

            <Footer />
        </>
    )
}

export default App
