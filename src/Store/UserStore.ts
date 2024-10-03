class _userStore {
    constructor() {
    }

    private _shortCode: string = ""
    public get shortCode(): string {
        return this._shortCode
    }
    public set shortCode(v: string) {
        this._shortCode = v
    }

    private _cid: string = ""
    public get cid(): string {
        return this._cid
    }
    public set cid(v: string) {
        this._cid = v
    }

    private _name: string = ""
    public get name(): string {
        return this._name
    }
    public set name(v: string) {
        this._name = v
    }

}

export const UserStore = new _userStore()