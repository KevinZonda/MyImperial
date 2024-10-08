import { UserStore } from "../../Store/UserStore.ts"
import { Card, Col, Row } from "antd"
import React from "react";

const DOC_SCIENTIA_URL = "https://scientia.doc.ic.ac.uk/"
const DOC_EXAM_URL = "https://exams.doc.ic.ac.uk/"
const DOC_INFO_REGI = "https://infosys.doc.ic.ac.uk/internalreg/subscription.cgi"
const DOC_TEACHING = "https://teaching.doc.ic.ac.uk/"
const PANOPTO = "https://imperial.cloud.panopto.eu/"
const MY_IMPERIAL = "https://my.imperial.ac.uk/"
const GITLAB = "https://gitlab.doc.ic.ac.uk/"
const IMPERIAL_MAIL = "https://outlook.office.com/mail/inbox"
const PERSONAL_PAGE = (x: string) => x ? `https://www.doc.ic.ac.uk/~${x}` : ''
const CALENDAR = (cid: string) => cid ? `https://www.imperial.ac.uk/timetabling/calendar/cal?vt=week&et=student&fid0=${cid}` : ''
const BB = "https://bb.imperial.ac.uk/"
const DOC_LABTS = 'https://teaching.doc.ic.ac.uk/labts'
const ED = "https://edstem.org/"
const DOC_LAB = 'https://www.imperial.ac.uk/computing/people/csg/facilities/lab/workstations/'
const DOC_BOOK_LAB_ROOM = 'https://mrbs.doc.ic.ac.uk/lab/index.php'
const BOOK_LIBRARY_ROOM = 'https://connect2.lib.ic.ac.uk/Connect2/'
const GOV_UK_EVISA = 'https://www.gov.uk/view-prove-immigration-status'
export interface Section {
    title: string
    urls: Map<string, string>
}

export const URLs = (shortCode: string, cid: string) => {
    const doc = new Map<string, string>()
    doc.set("Scientia", DOC_SCIENTIA_URL)
    doc.set("Ed", ED)
    doc.set("Teaching Server", DOC_TEACHING)
    doc.set("LabTS", DOC_LABTS)
    doc.set("GitLab", GITLAB)
    doc.set("Exam", DOC_EXAM_URL)
    doc.set("SysInfo/Registration", DOC_INFO_REGI)
    doc.set("Personal Page", PERSONAL_PAGE(shortCode))
    doc.set("Lab", DOC_LAB)
    doc.set("Book Lab Room", DOC_BOOK_LAB_ROOM)

    const m = new Map<string, string>()
    m.set("Outlook", IMPERIAL_MAIL)
    m.set("Panopto", PANOPTO)
    m.set("MyImperial", MY_IMPERIAL)
    m.set("Blackboard", BB)
    m.set("Calendar", CALENDAR(cid))
    m.set("Book Library Room", BOOK_LIBRARY_ROOM)
    m.set("eVisa", GOV_UK_EVISA)
    return [
        { title: "DoC Links", urls: doc },
        { title: "Useful Links", urls: m }
    ]
}

const gridCss : React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    fontSize: '1.3em',
};
const clickableGrid: React.CSSProperties = {
    cursor: 'pointer',
    ...gridCss
};

const unClickableGrid: React.CSSProperties = {
    textDecoration: 'line-through',
    ...gridCss
};

export const URLList = () => {
    return (
        <>
            {
                URLs(UserStore.shortCode, UserStore.cid).map((prop) => {
                    return (
                        <div key={prop.title}>
                            <h2>{prop.title}</h2>
                            <Row gutter={[16, 16]}>
                                {

                                    Array.from(prop.urls).map(([title, url]) => (
                                        <Col key={title} xs={24} sm={12} md={8} lg={6} xl={4}>
                                            <Card style={url ? clickableGrid : unClickableGrid} hoverable={!!url} onClick={() => {
                                                url && window.open(url, "_blank")
                                            }}>
                                                {title}
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </div>
                    )
                })
            }
        </>
    )
}