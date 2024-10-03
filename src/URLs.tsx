export const DOC_SCIENTIA_URL = "https://scientia.doc.ic.ac.uk/"
export const DOC_EXAM_URL = "https://exams.doc.ic.ac.uk/"
export const DOC_INFO_REGI = "https://infosys.doc.ic.ac.uk/internalreg/subscription.cgi"
export const DOC_TEACHING = "https://teaching.doc.ic.ac.uk/"
export const PANOPTO = "https://imperial.cloud.panopto.eu/"
export const MY_IMPERIAL = "https://my.imperial.ac.uk/"
export const GITLAB = "https://gitlab.doc.ic.ac.uk/"
export const IMPERIAL_MAIL = "https://outlook.office.com/mail/inbox"
export const PERSONAL_PAGE=(x: string) => x ? `https://www.doc.ic.ac.uk/~${x}` : ''
export const CALENDAR = (cid: string) => cid ? `https://www.imperial.ac.uk/timetabling/calendar/cal?vt=month&et=student&fid0=${cid}` : ''
export const BB = "https://bb.imperial.ac.uk/"
export const DOC_LABTS = 'https://teaching.doc.ic.ac.uk/labts'
export const ED = "https://edstem.org/"
export const DOC_LAB = 'https://www.imperial.ac.uk/computing/people/csg/facilities/lab/workstations/'
export const DOC_BOOK_LAB_ROOM = 'https://mrbs.doc.ic.ac.uk/lab/index.php'
export const BOOK_LIBRARY_ROOM = 'https://connect2.lib.ic.ac.uk/Connect2/'

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
    doc.set("SysInfo", DOC_INFO_REGI)
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
    return [
        { title: "DoC Links", urls: doc },
        { title: "Imperial Useful Links", urls: m }
    ]
}