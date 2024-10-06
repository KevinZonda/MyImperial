export interface ICourse {
    name: string;
    scientia: string;
    ed: string;
    panopto: string;
}


const Year = '2425'

export function CourseToScientia(c: ICourse) {
    return IdToScientia(c.scientia)
}

export function IdToScientia(id: string) {
    return `https://scientia.doc.ic.ac.uk/${Year}/modules/${id}/materials`
}

export function CourseToIntro(c: ICourse) {
    return `https://www.imperial.ac.uk/computing/current-students/courses/${c.scientia}/`
}

export function CourseToEd(c: ICourse) {
    return `https://edstem.org/us/courses/${c.ed}/discussion/`
}

export function CourseToPanopto(c: ICourse) {
    return `https://imperial.cloud.panopto.eu/Panopto/Pages/Sessions/List.aspx#folderID=%22${c.panopto}%22`
}

export function ParseCourseErr(xs: string) {
    try {
        return { courses: ParseCourse(xs), ok: true }
    } catch (e) {
        return { courses: null, ok: false }
    }
}

function safeIdx<T>(arr: T[], idx: number, defaultVal: T): T {
    if (idx < 0 || idx >= arr.length) return defaultVal
    return arr[idx]
}

function safeIdxStr(arr: string[], idx: number): string {
    return safeIdx(arr, idx, '')
}
export function ParseCourse(xs: string): ICourse[][] {
    const group: ICourse[][] = []
    let arr: ICourse[] = []
    const lines = xs.split('\n')
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line === '') continue
        if (line === '---') {
            group.push(arr)
            arr = []
            continue
        }
        const spls = line.split('|')
        const scientia = safeIdxStr(spls, 0).trim()
        const name = safeIdxStr(spls, 1).trim()
        const ed = safeIdxStr(spls, 2).trim()
        const panopto = safeIdxStr(spls, 3).trim()
        
        arr.push({ name, scientia, ed, panopto })
    }
    if (arr.length > 0) group.push(arr)
    return group
}