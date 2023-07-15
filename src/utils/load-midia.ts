import { BOOKS, COMICS, IMidiaLeitura, MANGAS } from '../entities/midia-leitura';
import { ANIMES, IMidiaVideo, MOVIES, TV_SHOWS, TV_TOKUSATSU } from '../entities/midia-video';

export const loadMidiaVideo = async (type: string) => {
    const {
        REACT_APP_MOVIES, REACT_APP_TV_SHOWS, REACT_APP_TV_TOKUSATSU, REACT_APP_ANIMES,
        REACT_APP_MOVIES_URL, REACT_APP_TV_SHOWS_URL, REACT_APP_TV_TOKUSATSU_URL, REACT_APP_ANIMES_URL,
    } = process.env;

    let data = [];

    switch (type) {
        case MOVIES: data = await load(REACT_APP_MOVIES, REACT_APP_MOVIES_URL); break;
        case TV_SHOWS: data = await load(REACT_APP_TV_SHOWS, REACT_APP_TV_SHOWS_URL); break;
        case ANIMES: data = await load(REACT_APP_ANIMES, REACT_APP_ANIMES_URL); break;
        case TV_TOKUSATSU: data = await load(REACT_APP_TV_TOKUSATSU, REACT_APP_TV_TOKUSATSU_URL); break;
    }

    return data as IMidiaVideo[];
}

export const loadMidiaLeitura  = async (type: string) => {
    const {
        REACT_APP_BOOKS, REACT_APP_COMICS, REACT_APP_MANGAS,
        REACT_APP_BOOKS_URL, REACT_APP_COMICS_URL, REACT_APP_MANGAS_URL,
    } = process.env;

    let data = [];

    switch (type) {
        case BOOKS: data = await load(REACT_APP_BOOKS, REACT_APP_BOOKS_URL); break;
        case COMICS: data = await load(REACT_APP_COMICS, REACT_APP_COMICS_URL); break;
        case MANGAS: data = await load(REACT_APP_MANGAS, REACT_APP_MANGAS_URL); break;
    }

    return data as IMidiaLeitura[];
}

const load = async (env: string | undefined, envURL?: string | undefined) => {

    if (envURL !== undefined) {
        const response = await fetch(envURL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'cache-control': 'no-cache'
            }
        });

        return response.json();
    }

    return require(`../data/${process.env.NODE_ENV}/${env}`);
}