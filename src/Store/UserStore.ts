class _userStore {
    public export() {
        return JSON.stringify({
            shortCode: this.shortCode,
            cid: this.cid,
            name: this.name,
            courses: this.courses,
            pubName: this.pubName,
            ical: this.ical,
            icalCount: this.icalCount,
            icalOnlyShowRelatedCourse: this.icalOnlyShowRelatedCourse
        })
    }

    public import(s: string) {
        const obj = JSON.parse(s)
        this.shortCode = obj.shortCode
        this.cid = obj.cid
        this.name = obj.name
        this.courses = obj.courses
        this.pubName = obj.pubName
        this.ical = obj.ical
        this.icalCount = obj.icalCount
        this.icalOnlyShowRelatedCourse = obj.icalOnlyShowRelatedCourse
    }

    public constructor() {
        const icalCount = localStorage.getItem('icalCount') || '5'
        this._icalCount = isNaN(+icalCount) ? 5 : +icalCount
        this._icalCount = this._icalCount < 1 ? 1 : this._icalCount
    }

    private _icalOnlyShowRelatedCourse = localStorage.getItem('icalOnlyShowRelatedCourse') === 'true'
    public get icalOnlyShowRelatedCourse(): boolean {
        return this._icalOnlyShowRelatedCourse
    }
    public set icalOnlyShowRelatedCourse(v: boolean) {
        localStorage.setItem('icalOnlyShowRelatedCourse', v ? 'true' : 'false')
        this._icalOnlyShowRelatedCourse = v
    }

    private _icalCount: number
    public get icalCount(): number {
        return this._icalCount
    }
    public set icalCount(v: number) {
        localStorage.setItem('icalCount', v.toString())
        this._icalCount = v
    }

    private _ical = localStorage.getItem('ical') || ""
    public get ical(): string {
        return this._ical
    }
    public set ical(v: string) {
        localStorage.setItem('ical', v)
        this._ical = v
    }

    private _shortCode: string = localStorage.getItem('shortCode') || ""
    public get shortCode(): string {
        return this._shortCode
    }
    public set shortCode(v: string) {
        localStorage.setItem('shortCode', v)
        this._shortCode = v
    }

    private _cid: string = localStorage.getItem('cid') || ""
    public get cid(): string {
        return this._cid
    }
    public set cid(v: string) {
        localStorage.setItem('cid', v)
        this._cid = v
    }

    private _name: string = localStorage.getItem('name') || ""
    public get name(): string {
        return this._name
    }
    public set name(v: string) {
        localStorage.setItem('name', v)
        this._name = v
    }

    private _courses: string = localStorage.getItem('courses') || ""
    public get courses(): string {
        return this._courses
    }
    public set courses(v: string) {
        localStorage.setItem('courses', v)
        this._courses = v
    }


    private _pubName: string = localStorage.getItem('pubName') || ""
    public get pubName(): string {
        return this._pubName
    }
    public set pubName(v: string) {
        localStorage.setItem('pubName', v)
        this._pubName = v
    }

}

export const UserStore = new _userStore()