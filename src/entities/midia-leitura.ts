import { groupByToMap } from "../utils";
import { IMidia } from "./midia";

export const LEITURA = "LEITURA";
export const BOOKS = "BOOKS";
export const COMICS = 'COMICS';
export const MANGAS = 'MANGAS';

export interface IMidiaLeitura extends IMidia {
    typeMidiaLeitura: string;
    volume?: string;
    readVolume?: number;
    totalVolume?: number;
}

export interface IMidiaLeituraKV {
    key: IMidiaLeitura,
    value: IMidiaLeitura[];
}

export function createIIMidiaLeitura(options?: Partial<IMidiaLeitura>): IMidiaLeitura {
    const defaults = {
        id: 0,
        typeMidiaLeitura: '',
        typeMidia: LEITURA,
        title: '',
        year: 1910,
        totalVolume: 0,
        owned: false,
        read: 'NOTR'
    };

    return {
        ...defaults,
        ...options,
    };
}

export function createIMidiaLeituraKV(options?: Partial<IMidiaLeituraKV>): IMidiaLeituraKV {
    const defaults = {
        key: createIIMidiaLeitura(),
        value: []
    };

    return {
        ...defaults,
        ...options,
    };
}

export const createMidiaLeituraKV = (data: IMidiaLeitura[], type: string) => {
    data.forEach((d) => d.typeMidia = LEITURA);

    const midiaLeituraGrouped = groupByToMap(data, (d) => d.title);

    const midiaLeituraArray = [] as IMidiaLeitura[];
    const midiaLeituraKVArray = [] as IMidiaLeituraKV[];

    for (let key of midiaLeituraGrouped.keys()) {
        const firstObject = midiaLeituraGrouped.get(key)?.[0] ?? {} as IMidiaLeitura;
        midiaLeituraArray.push(
            createIIMidiaLeitura({
                ...firstObject,
                typeMidiaLeitura: type,
                typeMidia: LEITURA,
            })
        );
    }

    for (let midiaLeitura of midiaLeituraArray) {
        midiaLeituraKVArray.push(
            createIMidiaLeituraKV({
                key: midiaLeitura,
                value: midiaLeituraGrouped.get(midiaLeitura.title)
            }),
        )
    }

    return midiaLeituraKVArray.sort((a, b) => a.key.title.localeCompare(b.key.title));
}

export const pathByTYPE = (midiaLeitura: IMidiaLeituraKV) => {
    switch (midiaLeitura.key?.typeMidiaLeitura) {
        case COMICS: return '/comics';
        case MANGAS: return '/mangas';
        case BOOKS: return '/books';
        default: return '';
    }
}

export const textByTYPE = (midiaLeitura: IMidiaLeituraKV) => {
    switch (midiaLeitura.key?.typeMidiaLeitura) {
        case COMICS: return 'Comics';
        case MANGAS: return 'Mangas';
        case BOOKS: return 'Books';
        default: return '';
    }
}