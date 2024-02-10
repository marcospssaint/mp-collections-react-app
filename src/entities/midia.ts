import { DEFAULT_NUMBER_INDEX, isNotNull } from "../utils";
import { isNotNullArray, isNotNullStr } from "../utils/utils";
import { BOOKS, COMICS, MANGAS } from "./midia-leitura";
import { ANIMES, MOVIES, TV_SHOWS, TV_TOKUSATSU, VIDEO } from "./midia-video";

export const TYPE_F_TITLE = 'T_TITLE';
export const TYPE_F_SUBTITLE = 'T_SUBTITLE';
export const TYPE_F_ORIGINAL_TITLE = 'T_ORIGINAL_TITLE';
export const TYPE_F_AUTHOR = 'T_AUTHOR';
export const TYPE_F_GENRE = 'T_GENRE';
export const TYPE_F_YEAR = 'TYPE_YEAR';
export const TYPE_F_COUNTRIES = 'TYPE_COUNTRIES';
export const TYPE_F_LANGUAGE = 'TYPE_LANGUAGE';
export const TYPE_F_PUBLISHER = 'T_PUBLISHER';
export const TYPE_F_READ = 'T_READ';
export const TYPE_F_WATCHED = 'T_WATCHED';
export const TYPE_F_CAST = 'T_CAST';
export const TYPE_F_OWNED = 'T_OWNED';

const TYPES_F_LEITURA = [TYPE_F_TITLE, TYPE_F_SUBTITLE, TYPE_F_ORIGINAL_TITLE,TYPE_F_AUTHOR, TYPE_F_PUBLISHER];

const TYPES_F_VIDEO = [TYPE_F_TITLE, TYPE_F_SUBTITLE, TYPE_F_ORIGINAL_TITLE, TYPE_F_CAST];

export interface IMidia {
    id: number;
    title: string;
    originalTitle?: string | null;
    subtitle?: string | null;
    year: number;
    owned: boolean;
    typeMidia: string;

    countries?: string;
    language?: string;

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
    typeMidiaVideo?: string | null;
    cast?: string;
    watched?: string | null;
}

export interface IMidiaKV {
    key: IMidia,
    value: IMidia[] | undefined;
}

export const isFilterAlphabets = (alphabets: any[], midiaKV: IMidiaKV) => {
    if (!isNotNullArray(alphabets)) return true;

    const firstLetter = midiaKV?.key?.title?.charAt(0);
    return alphabets.some((alphabet) => {
        if (alphabet === '0-9') {
            return DEFAULT_NUMBER_INDEX.some((num) => num === firstLetter);
        }

        return alphabet.toLowerCase() === replaceAlphabets(firstLetter.toLowerCase());
    })
}

export const isFilterCountry = (countries: any, midiaKV: IMidiaKV) => {
    if (!isNotNullStr(countries)) return true;
    if (countries !== undefined && countries === 'All') return true;

    const midiaKCountries = midiaKV.key?.countries;
    var options = midiaKCountries?.split(', ').map((c) => c);
    return options?.some((o) => o === countries);
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
        .replaceAll('ú', 'u')
       ;
}

export const isFilterSearch = (value: any | undefined , midiaKV: IMidiaKV) => {
    if (!isNotNullStr(value)) return true;

    const midiaK = midiaKV.key;
    const midiaV = midiaKV.value;

    if (midiaV === undefined || midiaV?.length === 0) {
        return isFilterByTypeMidia(value, midiaK);
    }

    return midiaV?.some((midiaLV) => isFilterByTypeMidia(value, midiaLV));
}

export const isFilterMultipleSelect = (values: any[] | undefined, midiaKV: IMidiaKV, type: string) => {
    if (!isNotNullArray(values)) return true;

    const midiaV = midiaKV.value;

    if (midiaV !== undefined && midiaV?.length === 0) {
        return values?.some((value) => isFilterByType(value, midiaKV.key, type));
    }

    return midiaV?.some((midiaLV) => values?.some((value) => isFilterByType(value, midiaLV, type)));
}

export const isFilterSingleSelect = (value: any | undefined, midiaKV: IMidiaKV, type: string) => {
    if (type === TYPE_F_YEAR && !isNotNullArray(value)) return true;
    else if (type !== TYPE_F_YEAR && !isNotNull(value)) return true;

    const midiaV = midiaKV.value;

    if (midiaV === undefined || midiaV?.length === 0) {
        return isFilterIMidiaSingleSelect(value, midiaKV.key, type);
    }

    return midiaV?.filter((midia) => isFilterByType(value, midia, type)).length > 0;
}

export const isFilterIMidiaSingleSelect = (value: any | undefined, midia: IMidia, type: string) => {
    return isFilterByType(value, midia, type);
}

export const isFiltersByType = (value: any[], midia: IMidia, type: string) => {
    return value.some((v) => isFilterByType(v, midia, type));
}

export const isFilterByType = (value: any | any[], midia: IMidia, type: string) => {
    if (type === TYPE_F_READ) return midia?.read === value;
    else if (type === TYPE_F_GENRE) {
        const genres = midia?.genre?.split(', ');
        return genres?.some((genre) => genre === value);
    } else if (type === TYPE_F_COUNTRIES) {
        const countries = midia?.countries?.split(', ');
        return countries?.some((country) => country === value);
    } else if (type === TYPE_F_YEAR) {
        const yearOne = Number(value[0]);
        const yearTwo = Number(value[1]);

        if (yearOne !== 0 && !Number.isNaN(yearOne)) {
            const year = Number(midia?.year);
            return (year >= yearOne && year <= yearTwo);
        }
        return true;
    }
    else if (type === TYPE_F_LANGUAGE) return midia?.language === value;
    else if (type === TYPE_F_WATCHED) return midia?.watched === value;
    else if (type === TYPE_F_OWNED) return midia?.owned === value;
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
    else if (type === TYPE_F_ORIGINAL_TITLE) valueSearch = midia.originalTitle;
    else if (type === TYPE_F_AUTHOR) valueSearch = midia.authors;
    else if (type === TYPE_F_PUBLISHER) valueSearch = midia.publisher;
    else if (type === TYPE_F_CAST) valueSearch = midia.cast;
    
    var valueSearchStr = valueSearch?.toString();
    return valueSearchStr?.toLowerCase().includes(value?.toLowerCase());
}

export const createOptions = (midias: IMidia[], type: string) => {
    var options = [''];
    midias
        .filter((data) => {
            if (type === TYPE_F_GENRE)
                return isNotNullStr(data?.genre)
            else if (type === TYPE_F_COUNTRIES)
                return isNotNullStr(data?.countries)
            else if (type === TYPE_F_LANGUAGE)
                return isNotNullStr(data?.language)
            return '';
        })
        .forEach((data) => {
            var value;
            if (type === TYPE_F_GENRE) value = data?.genre
            else if (type === TYPE_F_COUNTRIES) value = data?.countries;
            else if (type === TYPE_F_LANGUAGE) value = data?.language;

            value?.split(', ').forEach((c) => options.push(c))
        });

    const optionsSets = [...new Set(options)];
    return optionsSets
        .filter((p) => p !== undefined)
        .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
        .map((option) => ({
            value: option,
            label: option
        }));
}

export const createByType = (midias: IMidia[], type: string) => {
    var options = [''];
    midias
        .filter((data) => {
            if (type === TYPE_F_GENRE)
                return isNotNullStr(data?.genre)
            else if (type === TYPE_F_COUNTRIES)
                return isNotNullStr(data?.countries)
            else if (type === TYPE_F_LANGUAGE)
                return isNotNullStr(data?.language)
            return '';
        })
        .forEach((data) => {
            var value;
            if (type === TYPE_F_GENRE) value = data?.genre
            else if (type === TYPE_F_COUNTRIES) value = data?.countries;
            else if (type === TYPE_F_LANGUAGE) value = data?.language;

            value?.split(', ').forEach((c) => options.push(c))
        });

    const optionsSets = [...new Set(options)];
    return optionsSets
        .filter((p) => p !== undefined && p !== '')
        .sort((a, b) => (a ?? '').localeCompare(b ?? ''));
}

export const titleByMidia = (midia: any) => {
    const typeMidia = midia?.key?.typeMidia;
    const type = typeMidia === VIDEO ? midia?.key?.typeMidiaVideo : midia?.key?.typeMidiaLeitura;
    return titleByTYPE(typeMidia, type);
}

export const titleByTYPE = (typeMidia: string, type: string) => {
    let title = '';
    switch (type) {
        case MOVIES: title = 'Movies'; break;
        case TV_SHOWS: title = 'TV Shows'; break;
        case TV_TOKUSATSU: title = 'TV Tokusatsu'; break;
        case ANIMES: title = 'Animes'; break;
        case COMICS: title = 'Comics'; break;
        case MANGAS: title = 'Mangas'; break;
        case BOOKS: title = 'Books'; break;
        default: title = ''; break;
    }
    return title;
}