import { useState } from "react";
import { useInterval } from 'usehooks-ts'

function isZone1OffPeak(hours: number, minutes: number) {
    // 06:30-09:30
    const after930 = hours > 9 || (hours === 9 && minutes > 30);
    const before630 = hours < 6 || (hours === 6 && minutes === 30);
    return after930 || before630;
}

function isOtherZoneOffPeak(isWeekend: boolean, hours: number, minutes: number) {
    // 06:30-09:30
    // 16:00-19:00
    if (isWeekend) return true;
    if (!isZone1OffPeak(hours, minutes)) return false; // Zone 1 peak
    const before1600 = hours < 16 || (hours === 16 && minutes === 0);
    const after1900 = hours > 19 || (hours === 19 && minutes > 0);
    return isWeekend || before1600 || after1900;
}

function zone1OP() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return isZone1OffPeak(hours, minutes);
}

function otherZoneOP() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isWeekend = date.getDay() % 6 === 0;
    return isOtherZoneOffPeak(isWeekend, hours, minutes);
}

export const Underground = () => {
    const [zone1, setZone1] = useState(zone1OP());
    const [zoneOthers, setZoneOthers] = useState(otherZoneOP());
    useInterval(() => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const isWeekend = date.getDay() % 6 === 0;
        setZone1(isZone1OffPeak(hours, minutes));
        setZoneOthers(isOtherZoneOffPeak(isWeekend, hours, minutes));
    }, 1000);

    return <p style={{ margin: 0 }}>
        <span style={{ fontWeight: 'bold' }}>London Ubderground: </span>
        {zone1 ? 'Off-peak' : 'Peak'} (Zone 1);&nbsp;
        {zoneOthers ? 'Off-peak' : 'Peak'} (Others)
    </p>
}