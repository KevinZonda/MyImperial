const CACHE_EXPIRE = 'CACHE_EXPIRE_'
const CACHE = 'CACHE_'

export class _cache {
    public get(key: string): string | null {
        if (this.isExpire(key)) {
            return null
        }
        return localStorage.getItem(CACHE + key)
    }
    public set(key: string, value: string, expireTime: number) {
        localStorage.setItem(CACHE + key, value)
        if (expireTime > 0) {
            this.setExpire(key, expireTime)
        }
    }

    public remove(key: string) {
        localStorage.removeItem(CACHE + key)
    }

    public setExpire(key: string, expireTime: number) {
        const exTime = new Date(Date.now() + expireTime)
        localStorage.setItem(CACHE_EXPIRE + key, exTime.toISOString())
    }

    public removeExpire(key: string) {
        localStorage.removeItem(CACHE_EXPIRE + key)
    }

    public isExpire(key: string, autoDelete = true): boolean {
        const expire = localStorage.getItem(CACHE_EXPIRE + key)
        if (!expire) {
            return false
        }
        if (Date.now() <= new Date(expire).getTime()) {
            return false
        }
        if (autoDelete) {
            this.remove(key)
            this.removeExpire(key)
        }

        return true
    }
}

export const Cache = new _cache()