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

export const URLs = (shortCode: string, cid: string) => {
    const m = new Map<string, string>()
    m.set("Scientia", DOC_SCIENTIA_URL)
    m.set("Exam", DOC_EXAM_URL)
    m.set("Registration", DOC_INFO_REGI)
    m.set("Teaching Server", DOC_TEACHING)
    m.set("Panopto", PANOPTO)
    m.set("GitLab", GITLAB)
    m.set("MyImperial", MY_IMPERIAL)
    m.set("Outlook", IMPERIAL_MAIL)
    m.set("DoC Page", PERSONAL_PAGE(shortCode))
    m.set("Blackboard", BB)
    m.set("Calendar", CALENDAR(cid))
    return m
}