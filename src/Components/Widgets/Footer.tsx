import { COLOUR_IMPERIAL_BLUE } from "../../const/Colour.ts"

export const Footer = () => {
    return (
        <div style={{backgroundColor: COLOUR_IMPERIAL_BLUE, color: 'white', paddingLeft: 32, paddingRight: 32, paddingTop: '21px', paddingBottom: '18px'}}>
            <p style={{marginTop: 0, marginBottom: 0}}>KevinZonda :: MyImperial</p>
            <p style={{marginTop: 0, marginBottom: 0}}>Copyright &copy; 2024 KevinZonda (Xiang Shi)</p>
            <p style={{marginTop: 0, marginBottom: 0}}>{import.meta.env.GIT_HASH}@{import.meta.env.GIT_BRANCH} {import.meta.env.GIT_DATE}</p>
            <p style={{marginTop: 0, marginBottom: 0}}>This service is to help Imperial College London DoC students access their education system simpler, and is not affiliated to Imperial College London.</p>
            <p style={{marginTop: 0, marginBottom: 0}}>This is a free service provided as is. No guarantees are made about the availability or correctness of the data. Use at your own risk.</p>
            <p style={{marginTop: 0, marginBottom: 0}}>All data is stored locally and never passed on to anyone.</p>
        </div>
    )
}