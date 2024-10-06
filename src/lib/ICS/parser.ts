import {Parser} from "ikalendar";

export function parseToCalendar(x: string) {
    const parser = new Parser()
    return parser.parse(x)
}
