import { groupByToMap } from "../utils";
import { IMidia } from "./midia";

export const VIDEO = "VIDEO";
export const MOVIES = 'MOVIES';
export const TV_SHOWS = 'TV_SHOWS';
export const TV_TOKUSATSU = 'TV_TOKUSATSU';
export const ANIMES = 'ANIMES';

export const TYPE_MOVIE = 'Movie';
export const TYPE_OVA = 'OVA';
export const TYPE_TV_SHOW = 'TV Show';

export interface IMidiaVideo extends IMidia {
    typeMidiaVideo: string | null;
    season?: number | null;
    episodes?: string | null;
    watchedEpisodes?: number;
    type?: string;
}

export interface IMidiaVideoKV {
    key: IMidiaVideo,
    value: IMidiaVideo[] | undefined;
}

export function createIMidiaVideo(options?: Partial<IMidiaVideo>): IMidiaVideo {
    const defaults = {
        id: 0,
        typeMidiaVideo: null,
        typeMidia: VIDEO,
        title: '',
        watched: 'NOTW',
        year: 1910,
        owned: false,
        notes: null,
        genre: null
    };

    return {
        ...defaults,
        ...options,
    };
}

export function createIMidiaVideoKV(options?: Partial<IMidiaVideoKV>): IMidiaVideoKV {
    const defaults = {
        key: createIMidiaVideo(),
        value: []
    };

    return {
        ...defaults,
        ...options,
    };
}

export const createMidiaVideoKV = (data: IMidiaVideo[], type: string) => {
    data.forEach((d) => d.typeMidia = VIDEO);

    // Group by media title
    const midiaVideoGrouped = groupByToMap(data, (e) => e.title);

    const midiaVideoArray = [] as IMidiaVideo[];
    const midiaVideoKVArray = [] as IMidiaVideoKV[];

    for (let key of midiaVideoGrouped.keys()) {
        const firstObject = midiaVideoGrouped.get(key)?.[0] ?? {} as IMidiaVideo;
        midiaVideoArray.push(
            createIMidiaVideo({
                ...firstObject,
                typeMidiaVideo: type,
            })
        );
    }

    for (let midiaVideo of midiaVideoArray) {
        midiaVideoKVArray.push(
            createIMidiaVideoKV({
                key: midiaVideo,
                value: midiaVideoGrouped.get(midiaVideo.title)
            }),
        )
    }

    return midiaVideoKVArray.sort((a, b) => a.key.year - b.key.year);
}