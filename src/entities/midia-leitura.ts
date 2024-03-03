import { groupByToMap } from "../utils";
import { isNotNullStr } from "../utils/utils";
import { IMidia } from "./midia";

export const LEITURA = "LEITURA";
export const BOOKS = "BOOKS";
export const COMICS = 'COMICS';
export const MANGAS = 'MANGAS';

export interface IMidiaLeitura extends IMidia {
    typeMidiaLeitura?: string;
    idPhase?: number;
    phase?: string;
    volume?: string;
    readVolume?: string;
    totalVolume?: number;
}

export interface IMidiaLeituraKV {
    key: IMidiaLeitura,
    value: IMidiaLeituraKV[] | IMidiaLeitura[] | undefined;
}

export function instanceOfKV(object: any): object is IMidiaLeituraKV {
    return object.key?.typeMidia === LEITURA;
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

export const createMidiaLeiturav2KV = (data: IMidiaLeitura[], type: string) => {
    data.forEach((d) => {
        d.typeMidiaLeitura = type;
        d.typeMidia = LEITURA;
    });

    const midiaLeituraGrouped = groupByToMap(data, (d) => d.title);

    const midiaLeituraCollections = [] as IMidiaLeitura[];
    const midiaLeituraKVArray = [] as IMidiaLeituraKV[];
    let valueMidiaLeituraCollections: any[] = [];

    for (let key of midiaLeituraGrouped.keys()) {
        const firstObject = midiaLeituraGrouped.get(key)?.[0] ?? {} as IMidiaLeitura;
        midiaLeituraCollections.push(firstObject);
    }

    for (let midiaLeituraCollection of midiaLeituraCollections) {
        valueMidiaLeituraCollections = [];
        const valuesMidiasLeituraGrouped = midiaLeituraGrouped.get(midiaLeituraCollection.title);
     
        if (valuesMidiasLeituraGrouped !== undefined && valuesMidiasLeituraGrouped.length > 1) { 
            if (valuesMidiasLeituraGrouped.some((v) => v.phase !== undefined)) {
                const midiaLeituraGroupedPhases = groupByToMap(valuesMidiasLeituraGrouped, (d) => d.phase);
                let midiaLeituraByPhases = [] as IMidiaLeitura[];
                let midiaLeituraByPhasesKV = [] as IMidiaLeituraKV[];

                for (let key of midiaLeituraGroupedPhases.keys()) { 
                    const firstObjectPhase = midiaLeituraGroupedPhases.get(key)?.filter((m) => !!m.collection)[0] ?? {} as IMidiaLeitura;
                    midiaLeituraByPhases.push(firstObjectPhase);
                }

                for (let midiaLeituraPhase of midiaLeituraByPhases) {
                    const valuesMidiaLeituraByPhases = midiaLeituraGroupedPhases.get(midiaLeituraPhase?.phase ?? '')?.filter((m) => !m.collection);
                    midiaLeituraByPhasesKV.push(
                        createIMidiaLeituraKV({
                            key: midiaLeituraPhase,
                            value: valuesMidiaLeituraByPhases
                        }),
                    )
                }

                valueMidiaLeituraCollections = midiaLeituraByPhasesKV;
            } else {
                valueMidiaLeituraCollections = valuesMidiasLeituraGrouped.filter((m) => !m.collection);
            }
        }

        midiaLeituraKVArray.push(
            createIMidiaLeituraKV({
                key: midiaLeituraCollection,
                value: valueMidiaLeituraCollections
            }),
        )
    }

    return midiaLeituraKVArray
        .sort((a, b) => a.key.title?.localeCompare(b.key?.title));
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

export const textByTYPE = (midia: any) => {
    switch (midia?.key?.typeMidiaLeitura) {
        case COMICS: return 'Comics';
        case MANGAS: return 'Mangas';
        case BOOKS: return 'Books';
        default: return '';
    }
}

export const createOptionsPublisher = (midiasLeituras: IMidiaLeitura[]) => {
    let publishers = midiasLeituras
        .filter((data) => isNotNullStr(data.publisher))
        .map((data) => data.publisher);

    const publishersSets = [...new Set(publishers)];
    return publishersSets
        .filter((p) => p !== undefined)
        .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
        .map((publisher) => (
        {
            value: publisher,
            label: publisher
        }
    ));
}

export const nOfEditions = (midiaLeituraK: IMidiaLeitura) => {
    const editions = String(midiaLeituraK?.volume);
    if (editions !== null && editions?.includes(' | ')) {
        return Number(editions.substring(editions.indexOf('|') + 2));
    }

    return Number(editions);
};

export const nOfEdition = (volume: any | undefined) => {
    if (volume === undefined || volume === null) {
        return 0;
    }

    const editions = String(volume);
    if (editions?.includes(' | ')) {
        return Number(editions.substring(editions.indexOf('|') + 2));
    }

    return Number(editions);
}