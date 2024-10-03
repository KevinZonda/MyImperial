import { COLOUR_IMPERIAL_BLUE } from "./const/Colour"

export const Footer = () => {
    return (
        <div style={{backgroundColor: COLOUR_IMPERIAL_BLUE, color: 'white', paddingLeft: 32, paddingRight: 32, paddingTop: '21px', paddingBottom: '18px'}}>
            <p style={{marginTop: 0, marginBottom: 0}}>Copyright &copy; 2024 KevinZonda (Xiang Shi)</p>
            <p style={{marginTop: 0, marginBottom: 0}}>All your data is stored locally and never passed on to anyone.</p>
            <p style={{marginTop: 0, marginBottom: 0}}>KevinZonda :: MyImperial is a utility written by KevinZonda to help Imperial College London DoC students access their education system. This platform is not affiliated to Imperial College London.</p>
        </div>
    )
}