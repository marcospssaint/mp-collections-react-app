export const groupByToMap = <T, Q>(array: T[], predicate: (value: T, index: number, array: T[]) => Q) =>
    array.reduce((map, value, index, array) => {
        const key = predicate(value, index, array);
        map.get(key)?.push(value) ?? map.set(key, [value]);
        return map;
    }, new Map<Q, T[]>());

export const squash = <T>(arr: T[] | undefined) => {
    if (arr === undefined) return [];
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp.indexOf(arr[i]) === -1) {
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

export const isNotNull = (value: any | undefined): boolean => value !== undefined && value !== null;
export const isNotNullStr = (value: String | undefined): boolean => value !== undefined && value !== '';
export const isNotNullArray = (value: any[] | undefined): boolean => value !== undefined && value?.length > 0;

export const isNumberObject = (value: any) => {
    return value !== null && typeof value === 'number';
} 

export const rangeBySeparator = (value: string, separator: string) => {
    var arr: (number | number[])[] = [];
    var primeiroRead = value.substring(0, value.indexOf(separator));
    var segundoRead = value.substring(value.indexOf(separator)+1);

    if (primeiroRead.length === 0) {
        arr.push(Number(segundoRead));
    } else {
        arr.push(...range(Number(primeiroRead), Number(segundoRead)));
    }

    return arr;
}

export const range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);