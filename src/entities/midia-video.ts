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

const defaultsIMidiaVideo = {
    id: 0,
    typeMidiaVideo: null,
    typeMidia: VIDEO,
    title: '',
    watched: 'NOTW',
    year: 1910,
    owned: false,
    notes: null,
    genre: null,
    collection: false
};

export interface IMidiaVideo extends IMidia {
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
    return {
        ...defaultsIMidiaVideo,
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

export const createMidiaVideoKV = (data: IMidiaVideo[], type: string, visibleCollection: boolean) => {
    const isMidiaTypeSeasons = type !== MOVIES;
 
    data.forEach((d) => {
        d.typeMidia = VIDEO;
        d.typeMidiaVideo = type;
    });

    // Group by media title
    const midiaVideoGrouped = groupByToMap(data, (e) => e.title);

    const midiaVideoArray = [] as IMidiaVideo[];
    const midiaVideoKVArray = [] as IMidiaVideoKV[];

    // agrupados
    for (let key of midiaVideoGrouped.keys()) {
        const firstObject = midiaVideoGrouped.get(key)?.[0] ?? {} as IMidiaVideo;
        midiaVideoArray.push(
            createIMidiaVideo(firstObject)
        );
    }

    for (let midiaVideo of midiaVideoArray) {
        var groupedMidia = midiaVideoGrouped.get(midiaVideo.title);
        let newMidia: IMidiaVideo = midiaVideo;

        if ((visibleCollection || type !== MOVIES) && groupedMidia !== undefined && groupedMidia?.length > 1) {
            midiaVideoKVArray.push(
                createIMidiaVideoKV({
                    key: {...newMidia, collection: visibleCollection},
                    value: groupedMidia
                }),
            );
        } else if (!visibleCollection) {
            if (groupedMidia !== undefined && groupedMidia.length > 1) {
                for (let midiaValue of groupedMidia) {
                    newMidia = {...midiaValue, title: midiaValue.subtitle??midiaValue.originalTitle??midiaValue.title??'', subtitle: null};
                    midiaVideoKVArray.push(
                        createIMidiaVideoKV({
                            key: {...newMidia, collection: visibleCollection},
                            value: []
                        }),
                    )
                }
            } else {
                midiaVideoKVArray.push(
                    createIMidiaVideoKV({
                        key: {...newMidia, collection: visibleCollection},
                        value: isMidiaTypeSeasons ?  [{...newMidia}] : []
                    }),
                )
            }
        }
    } 

    return midiaVideoKVArray.sort((a, b) => {
        if (type === ANIMES || !!visibleCollection) {
            return a.key.title.localeCompare(b.key.title);
        }
        return b.key.year - a.key.year;
    });
}