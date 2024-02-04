import { BOOKS, COMICS, IMidiaLeitura, MANGAS } from '../entities/midia-leitura';
import { ANIMES, IMidiaVideo, MOVIES, TV_SHOWS, TV_TOKUSATSU, VIDEO } from '../entities/midia-video';

export const loadMidia = async (typeMidia: string, type: string, username: any) => {
    if (typeMidia === VIDEO) return loadMidiaVideo(type, username);
    return loadMidiaLeitura(type, username);
}

export const loadMidiaVideo = async (type: string, username: any) => {
    const {
        REACT_APP_MOVIES, REACT_APP_TV_SHOWS, REACT_APP_TV_TOKUSATSU, REACT_APP_ANIMES
    } = process.env;

    let data = [];

    switch (type) {
        case MOVIES: data = await load(REACT_APP_MOVIES, getValueEnv("REACT_APP_MOVIES", username)); break;
        case TV_SHOWS: data = await load(REACT_APP_TV_SHOWS, getValueEnv("REACT_APP_TV_SHOWS", username)); break;
        case ANIMES: data = await load(REACT_APP_ANIMES, getValueEnv("REACT_APP_ANIMES", username)); break;
        case TV_TOKUSATSU: data = await load(REACT_APP_TV_TOKUSATSU, getValueEnv("REACT_APP_TV_TOKUSATSU", username)); break;
    }

    return data as IMidiaVideo[];
}

export const loadMidiaLeitura  = async (type: string, username: any) => {
    const {
        REACT_APP_BOOKS, REACT_APP_COMICS, REACT_APP_MANGAS,
    } = process.env;

    let data = [];

    switch (type) {
        case BOOKS: data = await load(REACT_APP_BOOKS, getValueEnv("REACT_APP_BOOKS", username)); break;
        case COMICS: data = await load(REACT_APP_COMICS, getValueEnv("REACT_APP_COMICS", username)); break;
        case MANGAS: data = await load(REACT_APP_MANGAS, getValueEnv("REACT_APP_MANGAS", username)); break;
    }

    return data as IMidiaLeitura[];
}

const getValueEnv = (value: string, username: any) => {
    const URL_ = value+'_URL_'+username?.name?.toLocaleUpperCase() ?? value;
    const URL_COMPLETO = process.env[URL_] ;
    return { url: URL_COMPLETO, status: URL_COMPLETO !== undefined } ;
}

const load = async (env: string | undefined, envURL?: any) => {
    if (envURL.status) {
        const response = await fetch(envURL.url, {
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