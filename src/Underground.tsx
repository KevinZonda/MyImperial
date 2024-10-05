export const Underground = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const after930 = hours > 9 || (hours === 9 && minutes > 30);
    const isWeekend = date.getDay() % 6 === 0;
    const before1600 = hours < 16 || (hours === 16 && minutes === 0);
    const after1900 = hours > 19 || (hours === 19 && minutes > 0);
    const isOffPeak = isWeekend || (after930 && before1600) || after1900;

    return <p style={{ marginTop: 0 }}>
        <span style={{ fontWeight: 'bold' }}>London Ubderground: </span>
        {after930 ? 'Off-peak' : 'Peak'} (Zone 1);&nbsp;
        {isOffPeak ? 'Off-peak' : 'Peak'} (Others)
    </p>
}