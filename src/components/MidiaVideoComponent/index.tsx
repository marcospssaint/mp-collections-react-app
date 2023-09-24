import { useCallback, useContext, useEffect, useState } from 'react';

import { ListMidiaVideo } from "../ListMidiaVideo";

import { DatePickerProps, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { BaseOptionType } from 'antd/es/select';
import { ThemeContext } from '../../contexts/theme-context';
import { TYPE_F_COUNTRIES, TYPE_F_GENRE, TYPE_F_LANGUAGE, createOptions } from '../../entities/midia';
import { IMidiaVideo, IMidiaVideoKV, createMidiaVideoKV } from '../../entities/midia-video';
import { loadMidiaVideo } from '../../utils';
import { FilterMidia } from '../FilterMidia';

interface MidiaVideoComponentProps {
    title: string;
    type: string;
    isCountries?: boolean;
    isLanguage?: boolean;
    isWatcher?: boolean;
    isOwned?: boolean;
    isVisibleCollection?: boolean;
    onClickMore: (midiaVideo: IMidiaVideoKV) => void;
}

export const MidiaVideoComponent = ({
    title,
    type,

    isCountries = true,
    isLanguage = true,
    isWatcher = false,
    isOwned = false,
    isVisibleCollection = false,
    onClickMore
}: MidiaVideoComponentProps) => {

    const [optionsCountries, setOptionsCountries] = useState<BaseOptionType[]>([]);
    const [optionsGenres, setOptionsGenres] = useState<BaseOptionType[]>([]);
    const [optionsLanguage, setOptionsLanguage] = useState<BaseOptionType[]>([]);

    const [midiaVideoKVArray, setMidiaVideoKVArray] = useState<IMidiaVideoKV[]>([]);
    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchRangeYear, setSearchRangeYear] = useState<[string, string] | string>();
    const [searchCountries, setSearchCountries] = useState<string[]>([]);
    const [searchLanguage, setSearchLanguage] = useState<string>();
    const [searchWatcher, setSearchWatcher] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();
    const [visibleCollection, setVisibleCollection] = useState<boolean>(false);

    const [dataLoaded, setDataLoaded] = useState<IMidiaVideo[]>([]);

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const datas = await loadMidiaVideo(type);
        setDataLoaded(datas);
        setOptionsCountries(createOptions(datas, TYPE_F_COUNTRIES));
        setOptionsGenres(createOptions(datas, TYPE_F_GENRE));
        setOptionsLanguage(createOptions(datas, TYPE_F_LANGUAGE));
    }, [type]);

    useEffect(() => {
        handleLoad();
    }, [handleLoad]);

    useEffect(() => {
        setMidiaVideoKVArray(createMidiaVideoKV(dataLoaded, type, visibleCollection));
        setCollapsed(true);
    }, [dataLoaded, setCollapsed, type, visibleCollection])

    const handleChangeAlphabets = (alphabet: string, checked: boolean) => {
        const nextSelectedAlphabets = checked
            ? [...selectedAlphabets, alphabet]
            : selectedAlphabets.filter((a) => a !== alphabet);
        setSelectedAlphabets(nextSelectedAlphabets);
    };

    const handleChangeSearch = (e: any) => {
        const { value } = e.target;
        setSearch(value);
    };

    const handleChangeGenres = (value: string[]) => {
        setSearchGenres(value);
    };

    const handleChangeRangeYear = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
      ) => {
        setSearchRangeYear(dateString);
    };

    const handleChangeCountries = (value: string[]) => {
        setSearchCountries(value);
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

    const handleChangeVisibleCollection = (value: boolean) => {
        setVisibleCollection(value);
    };

    return (
        <>
            <Row className='component-midia'>
                <FilterMidia
                    selectedAlphabets={selectedAlphabets}
                    optionsCountries={optionsCountries}
                    optionsGenres={optionsGenres}
                    optionsLanguage={optionsLanguage}
                    isCountries={isCountries}
                    isLanguage={isLanguage}
                    isWatcher={isWatcher}
                    isOwned={isOwned}
                    isVisibleCollection={isVisibleCollection}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeCountries={handleChangeCountries}
                    handleChangeLanguage={handleChangeLanguage}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeRangeYear={handleChangeRangeYear}
                    handleChangeWatcher={handleChangeWatcher}
                    handleChangeOwned={handleChangeOwned}
                    handleChangeVisibleCollection={handleChangeVisibleCollection} />

                <ListMidiaVideo
                    emptyMessage={`${title} not found 🤐`}
                    data={midiaVideoKVArray}
                    selectedAlphabets={selectedAlphabets}
                    search={search}
                    searchGenres={searchGenres}
                    searchRangeYear={searchRangeYear}
                    searchCountries={searchCountries}
                    searchLanguage={searchLanguage}
                    searchWatcher={searchWatcher}
                    searchOwned={searchOwned}
                    onClickMore={onClickMore} />
            </Row>
        </>
    )
}