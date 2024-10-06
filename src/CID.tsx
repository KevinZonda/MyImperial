import { UserStore } from "./Store/UserStore"

export const CID = () => {
    if (!UserStore.cid) return null
    return <p style={{ margin: 0 }}>
        <span style={{ fontWeight: 'bold' }}>CID: </span>
        {UserStore.cid}
        {
            UserStore.shortCode &&
            <>
                {` · `}
                <span style={{ fontWeight: 'bold' }}>ShortCode: </span>
                {UserStore.shortCode}
            </>
        }
    </p>
}