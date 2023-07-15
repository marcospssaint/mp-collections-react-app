import { DEFAULT_NUMBER_INDEX, isNotNull } from "../utils";
import { isNotNullArray, isNotNullStr } from "../utils/utils";
import { VIDEO } from "./midia-video";

export const TYPE_F_TITLE = 'T_TITLE';
export const TYPE_F_SUBTITLE = 'T_SUBTITLE';
export const TYPE_F_TITLE_ORIGINAL = 'T_TITLE_ORIGINAL';
export const TYPE_F_AUTHOR = 'T_AUTHOR';
export const TYPE_F_GENRE = 'T_GENRE';
export const TYPE_F_PUBLISHER = 'T_PUBLISHER';
export const TYPE_F_READ = 'T_READ';
export const TYPE_F_WATCHED = 'T_WATCHED';
export const TYPE_F_CAST = 'T_CAST';
export const TYPE_F_OWNED = 'T_OWNED';

const TYPES_F_LEITURA = [TYPE_F_TITLE, TYPE_F_SUBTITLE, TYPE_F_TITLE_ORIGINAL,TYPE_F_AUTHOR];

const TYPES_F_VIDEO = [TYPE_F_TITLE, TYPE_F_SUBTITLE, TYPE_F_TITLE_ORIGINAL, TYPE_F_CAST];

export interface IMidia {
    id: number;
    title: string;
    titleOriginal?: string | null;
    subtitle?: string | null;
    year?: number | null;
    owned: boolean;
    typeMidia: string;

    synopsis?: string | null;
    notes?: string | null;
    img?: string | null;

    // leitura
    authors?: string;
    publisher?: string;
    read?: string | null;
    genre?: string | null;
    collection?: boolean | null;
    collectionTitle?: boolean | null;

    // video
    cast?: string;
    watched?: string | null;
}

export interface IMidiaKV {
    key: IMidia,
    value: IMidia[] | undefined;
}

export const isFilterAlphabets = (alphabets: any[], midiaKV: IMidiaKV) => {
    if (!isNotNullArray(alphabets)) return true;

    const firstLetter = midiaKV.key?.title.charAt(0);
    return alphabets.some((alphabet) => {
        if (alphabet === '0-9') {
            return DEFAULT_NUMBER_INDEX.some((num) => num === firstLetter);
        }

        return alphabet.toLowerCase() === replaceAlphabets(firstLetter.toLowerCase());
    })
}

const replaceAlphabets = (alphabet : string) => {
    return alphabet
        .replaceAll('á', 'a')
        .replaceAll('à', 'a')
        .replaceAll('è', 'e')
        .replaceAll('é', 'e')
        .replaceAll('ì', 'i')
        .replaceAll('í', 'i')
        .replaceAll('ò', 'o')
        .replaceAll('ó', 'o')
        .replaceAll('ù', 'u')
        .replaceAll('ú', 'u');
}

export const isFilterSearch = (value: any | undefined , midiaKV: IMidiaKV) => {
    if (!isNotNullStr(value)) return true;

    const midiaK = midiaKV.key;
    const midiaV = midiaKV.value;

    if (midiaV === undefined || midiaV?.length === 1) {
        return isFilterByTypeMidia(value, midiaK);
    }

    return midiaV?.some((midiaLV) => isFilterByTypeMidia(value, midiaLV));
}

export const isFilterMultipleSelect = (values: any[] | undefined, midiaKV: IMidiaKV, type: string) => {
    if (!isNotNullArray(values)) return true;

    const midiaV = midiaKV.value;

    if (midiaV !== undefined && midiaV?.length === 1) {
        return values?.some((value) => isFilterByType(value, midiaKV.key, type));
    }

    return midiaV?.some((midiaLV) => values?.some((value) => isFilterByType(value, midiaLV, type)));
}

export const isFilterSingleSelect = (value: any | undefined, midiaKV: IMidiaKV, type: string) => {
    if (!isNotNull(value)) return true;

    const midiaV = midiaKV.value;

    if (midiaV === undefined || midiaV?.length === 1) {
        return isFilterByType(value, midiaKV.key, type);
    }

    return midiaV?.filter((midia) => isFilterByType(value, midia, type)).length > 0;
}

const isFilterByType = (value: any | any[], midia: IMidia, type: string) => {
    if (type === TYPE_F_PUBLISHER) return midia.publisher === value;
    else if (type === TYPE_F_READ) return midia.read === value;
    else if (type === TYPE_F_GENRE) {
        const genres = midia.genre?.split(', ');
        return genres?.some((genre) => genre === value);
    }
    else if (type === TYPE_F_WATCHED) return midia.watched === value;
    else if (type === TYPE_F_OWNED) return midia.owned === value;
    return false;
}

const isFilterByTypeMidia = (value: any, midia: IMidia) => {
    if (midia.typeMidia === VIDEO) {
        return TYPES_F_VIDEO.some(t => isFilterSearchByType(value, midia, t));
    }

    return TYPES_F_LEITURA.some(t => isFilterSearchByType(value, midia, t));
}

const isFilterSearchByType = (value: any, midia: IMidia, type: string) => {
    let valueSearch;

    if (type === TYPE_F_TITLE) valueSearch = midia.title;
    else if (type === TYPE_F_SUBTITLE) valueSearch = midia.subtitle;
    else if (type === TYPE_F_TITLE_ORIGINAL) valueSearch = midia.titleOriginal;
    else if (type === TYPE_F_AUTHOR) valueSearch = midia.authors;
    else if (type === TYPE_F_CAST) valueSearch = midia.cast;
    
    var valueSearchStr = valueSearch?.toString();
    return valueSearchStr?.toLowerCase().includes(value?.toLowerCase());
}