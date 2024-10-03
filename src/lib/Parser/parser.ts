export interface ICourse {
    name: string;
    scientia: string;
    ed: string;
}


const Year = '2425'

export function CourseToScientia(c : ICourse) {
    return `https://scientia.doc.ic.ac.uk/${Year}/modules/${c.scientia}/materials`
}

export function CourseToEd(c : ICourse) {
    return `https://edstem.org/us/courses/${c.ed}/discussion/`
}

export function ParseCourse(xs : string) : ICourse[][] {
    const group : ICourse[][] = []
    let arr : ICourse[]= []
    const lines = xs.split('\n')
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line === '') continue
        if (line === '---') {
            group.push(arr)
            arr = []
            continue
        }
        let [name, scientia, ed] = line.split('|')
        name = name.trim()
        scientia = scientia.trim()
        ed = ed.trim()
        arr.push({name, scientia, ed})
    }
    if (arr.length > 0) group.push(arr)
    return group
}