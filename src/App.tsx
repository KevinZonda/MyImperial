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

const Welcome = ({ hide }: { hide: boolean }) => {
  const titleStyle: React.CSSProperties = {
    color: COLOUR_IMPERIAL_BLUE,
    margin: 0,
  }
  if (UserStore.name && !hide) {
    return <>
      <Title style={titleStyle} level={1}>Hi, {UserStore.name} {UserStore.cid && `(CID: ${UserStore.cid})`}</Title>
    </>
  }
  return <Title style={titleStyle} level={1}>KevinZonda :: My Imperial</Title>
}


function App() {
  const [hide, setHide] = useState(false)

  return (
    <>
      <div style={{ margin: 32 }}>
        <Welcome hide={hide} />
        <WeatherBanner />
        <Space direction="horizontal">
          <Button type="primary" onClick={Refresh} icon={<SyncOutlined />} />
          <SettingsBtn />
          <Button type={!hide ? 'primary' : undefined} onClick={() => setHide(!hide)} icon={hide ? <EyeInvisibleOutlined /> : <EyeOutlined />} />
          <CourseSettingBtn />
          <Button type="primary" onClick={() => window.open("https://github.com/KevinZonda/MyImperial", "_blank")} icon={<GithubOutlined />}/>
        </Space>
        <CourseSection />
        <URLList />
      </div>

      <Footer />
    </>
  )
}

export default App
