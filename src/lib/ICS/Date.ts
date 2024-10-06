import {ComplexDate} from "ikalendar";

type ICSDate = string | ComplexDate | undefined

function _parseICSDate(x: string): Date | undefined {
    try {
        const year = parseInt(x.slice(0, 4));
        const month = parseInt(x.slice(4, 6)) - 1; // Month is 0-indexed in JS Date
        const day = parseInt(x.slice(6, 8));
        const hours = parseInt(x.slice(9, 11));
        const minutes = parseInt(x.slice(11, 13));
        const seconds = parseInt(x.slice(13, 15));
        return new Date(year, month, day, hours, minutes, seconds);
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export function parseICSDate(x: ICSDate): Date | undefined {
    if (!x) return undefined
    return _parseICSDate(typeof x === 'string' ? x : x.value)
}


const pad = (num: number) => num.toString().padStart(2, '0');

function dateToTime(date: Date) {
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${hours}:${minutes}`
}

function dateToDate(date: Date) {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`
}

function dateToFullDate(date: Date | undefined) {
    if (!date) return 'N/A'
    return `${dateToDate(date)} ${dateToTime(date)}`
}

export function ICSDateRangeToString(start: ICSDate, end: ICSDate): string {
    const left = parseICSDate(start)
    const right = parseICSDate(end)
    if (left && right) {
        const leftDate = dateToDate(left)
        const leftTime = dateToTime(left)
        const rightDate = dateToDate(right)
        const rightTime = dateToTime(right)
        return leftDate === rightDate
            ? `${leftDate} ${leftTime} - ${rightTime}`
            : `${leftDate} ${leftTime} - ${rightDate} ${rightTime}`
    }
    return `${dateToFullDate(left)} - ${dateToFullDate(right)}`
}