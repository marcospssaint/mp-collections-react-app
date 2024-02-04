import { useCallback, useContext, useEffect, useState } from 'react';

import { Col, DatePickerProps, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { BaseOptionType } from 'antd/es/select';
import { useAuth } from '../../contexts/auth';
import { ThemeContext } from '../../contexts/theme-context';
import { TYPE_F_COUNTRIES, TYPE_F_GENRE, TYPE_F_LANGUAGE, createByType, createOptions } from '../../entities/midia';
import { MANGAS, createMidiaLeituraKV } from '../../entities/midia-leitura';
import { MOVIES, TV_SHOWS, VIDEO, createMidiaVideoKV } from '../../entities/midia-video';
import { loadMidia } from '../../utils/load-midia';
import { FilterMidia } from '../FilterMidia';
import { ListMidia } from '../ListMidia';
import { ListMidiaSkeleton } from '../antd';

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

    const [midiaKVArray, setMidiaKVArray] = useState<any[]>([]);
    const [optionsLanguage, setOptionsLanguage] = useState<BaseOptionType[]>([]);

    const [genres, setGenres] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [search, setSearch] = useState('');
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
    } ;

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const midias = await loadMidia(typeMidia, type, user);
        setMidiaLoaded(midias);
        setOptionsLanguage(createOptions(midias, TYPE_F_LANGUAGE));

        setCountries(createByType(midias, TYPE_F_COUNTRIES));
        setGenres(createByType(midias, TYPE_F_GENRE));
    }, [typeMidia, type, user]);

    useEffect(() => {
        setMidiaKVArray([]);
        setLoading(true);
        handleLoad();
    }, [handleLoad]);

    useEffect(() => {
        if (isTypeMidiaVIDEO) {
            setMidiaKVArray(createMidiaVideoKV(midiaLoaded, type, visibleCollection));
        } else {
            setMidiaKVArray(createMidiaLeituraKV(midiaLoaded, type));
        }
        setCollapsed(true);
        setTimeout(() => setLoading(false), 1000)
    }, [midiaLoaded, setCollapsed, type, isTypeMidiaVIDEO, visibleCollection])

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

    return (
        <Row className='responsive-two-columns'>
            <Col>
                <FilterMidia
                    genres={genres}
                    countries={countries}

                    selectedGenres={selectedGenres}
                    selectedCountries={selectedCountries}

                    optionsLanguage={optionsLanguage}
                    isLanguage={isLanguage}
                    isWatcher={isTypeMidiaVIDEO}
                    isRead={!isTypeMidiaVIDEO}
                    isVisibleCollection={isTypeMidiaVIDEO}
                    isFilterCountries={isFilterCountry()}

                    handleChangeSearch={handleChangeSearch}
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
                {
                    loading && <ListMidiaSkeleton/>
                }
                {
                    !loading && 
                    <ListMidia
                        emptyMessage={`${title} not found 🤐`}
                        data={midiaKVArray}
                        search={search}
                        searchGenres={selectedGenres}
                        searchCountries={selectedCountries}
                        searchRangeYear={searchRangeYear}
                        searchLanguage={searchLanguage}
                        searchWatcher={searchWatcher}
                        searchRead={searchRead}
                        searchOwned={searchOwned}
                        onClickMore={onClickMore} />
                }
                
            </Col>
        </Row>
    )
}