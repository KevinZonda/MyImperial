import { UserStore } from "../../Store/UserStore.ts"

export const CID = () => {
    if (!UserStore.cid && !UserStore.shortCode) return null
    return <p style={{ margin: 0 }}>
        {
            UserStore.cid &&
            <>
                <span style={{ fontWeight: 'bold' }}>CID: </span>
                {UserStore.cid}
            </>
        }{
            UserStore.shortCode &&
            <>
                {` · `}
                <span style={{ fontWeight: 'bold' }}>ShortCode: </span>
                {UserStore.shortCode}
            </>
        }
    </p>
}