class _userStore {
    constructor() {
        
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

}

export const UserStore = new _userStore()