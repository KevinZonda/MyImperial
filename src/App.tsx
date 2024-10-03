import { Card, Col, Row, Space } from 'antd'
import './App.css'
import { CALENDAR, DOC_EXAM_URL, DOC_SCIENTIA_URL, IMPERIAL_MAIL, PERSONAL_PAGE, URLs } from './URLs'
import Title from 'antd/es/typography/Title';
import { UserStore } from './Store/UserStore';

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
};

const Welcome = () => {
  if (UserStore.name) {
    return <>
      <Title level={2}>Hi, {UserStore.name}</Title>
      <p>Welcome to KevinZonda :: MyImperial</p>
    </>
  }
  return <Title level={1}>KevinZonda :: My Imperial</Title>
}
function App() {

  return (
    <>
      <Welcome />
      <Title level={2}>Useful Link</Title>

      {/* <iframe width="100%" height="500px" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}

      <Card>
        <Row gutter={[16, 16]}>
          {
            Array.from(URLs(UserStore.shortCode, UserStore.cid)).map(([title, url]) => (
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
      </Card>
    </>
  )
}

export default App
