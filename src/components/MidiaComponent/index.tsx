import { useCallback, useContext, useEffect, useState } from 'react';

import { Col, DatePickerProps, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { BaseOptionType } from 'antd/es/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { ThemeContext } from '../../contexts/theme-context';
import { TYPE_F_COUNTRIES, TYPE_F_GENRE, TYPE_F_LANGUAGE, TYPE_F_OWNED, TYPE_F_READ, TYPE_F_WATCHED, TYPE_F_YEAR, createByType, createOptions, isFilterAlphabets, isFilterMultipleSelect, isFilterSearch, isFilterSingleSelect } from '../../entities/midia';
import { LEITURA, MANGAS, createMidiaLeiturav2KV } from '../../entities/midia-leitura';
import { MOVIES, TV_SHOWS, VIDEO, createMidiaVideoKV } from '../../entities/midia-video';
import { useQuery } from '../../utils';
import { loadMidia } from '../../utils/load-midia';
import { isNotNull, isNotNullArray, isNotNullStr } from '../../utils/utils';
import { FilterMidia } from '../FilterMidia';
import { ListMidia } from '../ListMidia';

interface MidiaComponentProps {
    title: string;
    typeMidia: string;
    type: string;
    isLanguage?: boolean;
    onClickMore: (midia: any) => void;
}

export const MidiaComponent = ({
    title,
    type,
    typeMidia,
    isLanguage = true,
    onClickMore
}: MidiaComponentProps) => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const query = useQuery();

    const alphabetsCurrent = query.get("alphabets") !== undefined ? query.get("alphabets") : null;

    const [midiaKVArray, setMidiaKVArray] = useState<any[]>([]);
    const [optionsLanguage, setOptionsLanguage] = useState<BaseOptionType[]>([]);

    const [genres, setGenres] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [search, setSearch] = useState('');
    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [searchRangeYear, setSearchRangeYear] = useState<[string, string] | string>();
    const [searchLanguage, setSearchLanguage] = useState<string>();
    const [searchWatcher, setSearchWatcher] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();
    const [searchRead, setSearchRead] = useState<string>();
    const [visibleCollection, setVisibleCollection] = useState<boolean>(false);

    const [midiaLoaded, setMidiaLoaded] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isTypeMidiaVIDEO = typeMidia === VIDEO;

    const isFilterCountry = () => {
        if (isTypeMidiaVIDEO) return (type === TV_SHOWS) || (type === MOVIES)
        return type !== MANGAS;
    };

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const midias = await loadMidia(typeMidia, type, user);
        setMidiaLoaded(midias);
        setOptionsLanguage(createOptions(midias, TYPE_F_LANGUAGE));

        setCountries(createByType(midias, TYPE_F_COUNTRIES));
        setGenres(createByType(midias, TYPE_F_GENRE));

        if (alphabetsCurrent !== null) setSelectedAlphabets([alphabetsCurrent]);
    }, [typeMidia, type, user, alphabetsCurrent]);

    useEffect(() => {
        setMidiaKVArray([]);
        setSelectedAlphabets([]);
        setSelectedGenres([]);
        setCountries([]);
        setLoading(true);
        handleLoad();
    }, [handleLoad]);

    useEffect(() => {
        if (isTypeMidiaVIDEO) {
            setMidiaKVArray(createMidiaVideoKV(midiaLoaded, type, visibleCollection));
        } else {
            setMidiaKVArray(createMidiaLeiturav2KV(midiaLoaded, type));
        }

        setCollapsed(true);
        setTimeout(() => setLoading(false), 1000)
    }, [midiaLoaded, setCollapsed, type, isTypeMidiaVIDEO, visibleCollection]);

    const handleChangeAlphabets = (alphabet: string, checked: boolean) => {
        const nextSelectedAlphabets = checked
            ? [...selectedAlphabets, alphabet]
            : selectedAlphabets.filter((a) => a !== alphabet);

        navigate(checked ? `?alphabets=${alphabet}` : '');
        setSelectedAlphabets(nextSelectedAlphabets);
    };

    const handleChangeGenres = (genre: string, checked: boolean) => {
        const nextSelectedGenres = checked
            ? [...selectedGenres, genre]
            : selectedGenres.filter((g) => g !== genre);
        setSelectedGenres(nextSelectedGenres);
    };

    const handleChangeCountries = (coutry: string, checked: boolean) => {
        const nextSelectedCountries = checked
            ? [...selectedCountries, coutry]
            : selectedCountries.filter((c) => c !== coutry);
        setSelectedCountries(nextSelectedCountries);
    };

    const handleChangeSearch = (e: any) => {
        const { value } = e.target;
        setSearch(value);
    };

    const handleChangeRangeYear = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        setSearchRangeYear(dateString);
    };

    const handleChangeLanguage = (value: string) => {
        setSearchLanguage(value);
    };

    const handleChangeWatcher = (value: string) => {
        setSearchWatcher(value);
    };

    const handleChangeOwned = (value: boolean) => {
        setSearchOwned(value);
    };

    const handleChangeRead = (value: string) => {
        setSearchRead(value);
    };

    const handleChangeVisibleCollection = (value: boolean) => {
        setVisibleCollection(value);
    };

    const wasResearch = () => {
        return isNotNullStr(search)
            || isNotNullArray(selectedAlphabets)
            || isNotNullArray(selectedGenres)
            || isNotNullArray(selectedCountries)
            || searchRangeYear !== null
            || isNotNull(searchWatcher)
            || isNotNull(searchRead)
            || isNotNull(searchOwned)
            || isNotNull(searchLanguage);
    }

    const filtered =
        wasResearch() ?
            midiaKVArray.filter((midiaKV) => {
                return isFilterSearch(search, midiaKV);
            })
                .filter((midiaKV) => {
                    return isFilterAlphabets(selectedAlphabets, midiaKV);
                }).filter((midiaKV) => {
                    return isFilterMultipleSelect(selectedGenres, midiaKV, TYPE_F_GENRE);
                }).filter((midiaKV) => {
                    return isFilterMultipleSelect(selectedCountries, midiaKV, TYPE_F_COUNTRIES);
                }).filter((midiaKV) => {
                    return isFilterSingleSelect(searchRangeYear, midiaKV, TYPE_F_YEAR);
                }).filter((midiaVideoKV) => {
                    return isFilterSingleSelect(searchWatcher, midiaVideoKV, TYPE_F_WATCHED);
                }).filter((midiaKV) => {
                    return isFilterSingleSelect(searchRead, midiaKV, TYPE_F_READ);
                }).filter((midiaVideoKV) => {
                    return isFilterSingleSelect(searchOwned, midiaVideoKV, TYPE_F_OWNED);
                }).filter((midiaKV) => {
                    return isFilterSingleSelect(searchLanguage, midiaKV, TYPE_F_LANGUAGE);
                })
            : midiaKVArray;

    return (
        <Row className='responsive-two-columns'>
            <Col>
                <FilterMidia
                    genres={genres}
                    countries={countries}

                    selectedAlphabets={selectedAlphabets}
                    selectedGenres={selectedGenres}
                    selectedCountries={selectedCountries}

                    optionsLanguage={optionsLanguage}
                    isLanguage={isLanguage}
                    isWatcher={isTypeMidiaVIDEO}
                    isRead={!isTypeMidiaVIDEO}
                    isVisibleCollection={isTypeMidiaVIDEO}
                    isFilterCountries={isFilterCountry()}

                    handleChangeSearch={handleChangeSearch}
                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeGenres={handleChangeGenres}
                    handleChangeCountries={handleChangeCountries}
                    handleChangeRangeYear={handleChangeRangeYear}
                    handleChangeWatcher={handleChangeWatcher}
                    handleChangeOwned={handleChangeOwned}
                    handleChangeRead={handleChangeRead}
                    handleChangeLanguage={handleChangeLanguage}
                    handleChangeVisibleCollection={handleChangeVisibleCollection} />
            </Col>

            <Col>
                <ListMidia
                    loading={loading}
                    emptyMessage={`${title} not found 🤐`}
                    data={filtered}
                    leitura={typeMidia === LEITURA}
                    onClickMore={onClickMore} />
            </Col>
        </Row>
    )
}