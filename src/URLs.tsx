import Title from 'antd/es/typography/Title';

import { UserStore } from "./Store/UserStore"
import { Card, Col, Row } from "antd"

export const DOC_SCIENTIA_URL = "https://scientia.doc.ic.ac.uk/"
export const DOC_EXAM_URL = "https://exams.doc.ic.ac.uk/"
export const DOC_INFO_REGI = "https://infosys.doc.ic.ac.uk/internalreg/subscription.cgi"
export const DOC_TEACHING = "https://teaching.doc.ic.ac.uk/"
export const PANOPTO = "https://imperial.cloud.panopto.eu/"
export const MY_IMPERIAL = "https://my.imperial.ac.uk/"
export const GITLAB = "https://gitlab.doc.ic.ac.uk/"
export const IMPERIAL_MAIL = "https://outlook.office.com/mail/inbox"
export const PERSONAL_PAGE = (x: string) => x ? `https://www.doc.ic.ac.uk/~${x}` : ''
export const CALENDAR = (cid: string) => cid ? `https://www.imperial.ac.uk/timetabling/calendar/cal?vt=month&et=student&fid0=${cid}` : ''
export const BB = "https://bb.imperial.ac.uk/"
export const DOC_LABTS = 'https://teaching.doc.ic.ac.uk/labts'
export const ED = "https://edstem.org/"
export const DOC_LAB = 'https://www.imperial.ac.uk/computing/people/csg/facilities/lab/workstations/'
export const DOC_BOOK_LAB_ROOM = 'https://mrbs.doc.ic.ac.uk/lab/index.php'
export const BOOK_LIBRARY_ROOM = 'https://connect2.lib.ic.ac.uk/Connect2/'
export const GOV_UK_EVISA = 'https://www.gov.uk/view-prove-immigration-status'
export interface Section {
    title: string
    urls: Map<string, string>
}

export const URLs = (shortCode: string, cid: string) => {
    const doc = new Map<string, string>()
    doc.set("Scientia", DOC_SCIENTIA_URL)
    doc.set("Teaching Server", DOC_TEACHING)
    doc.set("LabTS", DOC_LABTS)
    doc.set("GitLab", GITLAB)
    doc.set("Ed", ED)
    doc.set("Exam", DOC_EXAM_URL)
    doc.set("SysInfo/Registration", DOC_INFO_REGI)
    doc.set("Personal Page", PERSONAL_PAGE(shortCode))
    doc.set("Lab", DOC_LAB)
    doc.set("Book Lab Room", DOC_BOOK_LAB_ROOM)

    const m = new Map<string, string>()
    m.set("Panopto", PANOPTO)
    m.set("MyImperial", MY_IMPERIAL)
    m.set("Outlook", IMPERIAL_MAIL)
    m.set("Blackboard", BB)
    m.set("Calendar", CALENDAR(cid))
    m.set("Book Library Room", BOOK_LIBRARY_ROOM)
    m.set("eVisa", GOV_UK_EVISA)
    return [
        { title: "DoC Links", urls: doc },
        { title: "Useful Links", urls: m }
    ]
}

const clickableGrid: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1.3em',
};

const unClickableGrid: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    fontSize: '1.3em',
    textDecoration: 'line-through'
};

export const URLList = () => {
    return (
        <>
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