export const splitOnce = (str: string, separator: string) => {
    const i = str.indexOf(separator);
    return [str.slice(0, i), str.slice(i + 1)];
}
