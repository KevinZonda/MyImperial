import { Button, Space } from 'antd'
import { URLList } from './URLs'
import Title from 'antd/es/typography/Title';
import { UserStore } from './Store/UserStore';
import { COLOUR_IMPERIAL_BLUE } from './const/Colour';
import { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined, GithubOutlined, SyncOutlined } from '@ant-design/icons';
import { Refresh } from './helper/browser';
import { WeatherBanner } from './Weather';
import { CourseSection, CourseSettingBtn } from './Courses';
import { SettingsBtn } from './Settings';
import { Footer } from './Footer';
import { ShareBtn } from './import';
import { ICSEvents } from './ICSEvent';
import { Underground } from './Underground';
import { CID } from './CID';

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
        <CourseSection />
        <URLList />
      </div>

      <Footer />
    </>
  )
}

export default App
