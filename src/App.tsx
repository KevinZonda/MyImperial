import { Button, Card, Col, Input, Modal, Row, Space } from 'antd'
import { URLs } from './URLs'
import Title from 'antd/es/typography/Title';
import { UserStore } from './Store/UserStore';
import { COLOUR_IMPERIAL_BLUE } from './const/Colour';
import { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined, SettingOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Refresh } from './helper/browser';
import { WeatherBanner } from './Weather';

const clickableGrid: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  cursor: 'pointer',
  fontWeight: '',
  fontSize: '1.3em',
};

const unClickableGrid: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  fontWeight: '',
  fontSize: '1.3em',
  textDecoration: 'line-through',
  marginBottom: 0
};

const Welcome = ({ hide }: { hide: boolean }) => {
  const titleStyle: React.CSSProperties = {
    color: COLOUR_IMPERIAL_BLUE,
    marginTop: 0,
  }
  if (UserStore.name && !hide) {
    return <>
      <Title style={titleStyle} level={1}>Hi, {UserStore.name} {UserStore.cid && `(CID: ${UserStore.cid})`}</Title>
    </>
  }
  return <Title style={titleStyle} level={1}>KevinZonda :: My Imperial</Title>
}


const Setting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortCode, setShortCode] = useState(UserStore.shortCode)
  const [cid, setCid] = useState(UserStore.cid)
  const [name, setName] = useState(UserStore.name)
  const onCancel = () => {
    setShortCode(UserStore.shortCode)
    setCid(UserStore.cid)
    setName(UserStore.name)
    setIsModalOpen(false)
  }

  const onOk = () => {
    UserStore.shortCode = shortCode
    UserStore.cid = cid
    UserStore.name = name
    setIsModalOpen(false)
    Refresh()
  }


  return <>

    <Button type="primary"
      icon={<SettingOutlined />}
      onClick={() => {
        setIsModalOpen(true)
      }} />


    <Modal title="Setting" open={isModalOpen} onOk={onOk} onCancel={onCancel} footer={[
      <Button key="clear" danger onClick={() => {
        UserStore.name = ""
        UserStore.shortCode = ""
        UserStore.cid = ""
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
        <Input size="large" placeholder="Short code" prefix={<UserOutlined />} value={shortCode} onChange={(e) => setShortCode(e.target.value)} />
        <Input size="large" placeholder="College ID" prefix={<UserOutlined />} value={cid} onChange={(e) => setCid(e.target.value)} />
      </Space>
    </Modal>

  </>
}


function App() {
  const [hide, setHide] = useState(false)

  return (
    <>
      <Welcome hide={hide} />
      <WeatherBanner />
      <Space direction="horizontal">
        <Button type="primary" onClick={Refresh} icon={<SyncOutlined />} />
        <Setting />
        <Button type={!hide ? 'primary' : undefined} onClick={() => setHide(!hide)} icon={hide ? <EyeInvisibleOutlined /> : <EyeOutlined /> } />
      </Space>
      {
        URLs(UserStore.shortCode, UserStore.cid).map((prop) => {


          return (
            <>
              <Title level={2}>{prop.title}</Title>
              <Row gutter={[16, 16]}>
                {

                  Array.from(prop.urls).map(([title, url]) => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                      <Card style={url ? clickableGrid : unClickableGrid} hoverable={url ? true : false} onClick={() => {
                        url && window.open(url, "_blank")
                      }}>
                        {title}
                      </Card>
                    </Col>
                  ))
                }
              </Row>
            </>
          )
        })
      }

    </>
  )
}

export default App
