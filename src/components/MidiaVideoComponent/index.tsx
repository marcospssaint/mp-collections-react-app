import { useCallback, useContext, useEffect, useState } from 'react';

import { ListMidiaVideo } from "../ListMidiaVideo";

import { DatePickerProps, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { ThemeContext } from '../../contexts/theme-context';
import { IMidiaVideoKV, createMidiaVideoKV } from '../../entities/midia-video';
import { loadMidiaVideo } from '../../utils';
import { FilterMidia } from '../FilterMidia';

interface MidiaVideoComponentProps {
    title: string;
    type: string;
    isCountries?: boolean;
    isLanguage?: boolean;
    isWatcher?: boolean;
    isOwned?: boolean;
    onClickMore: (midiaVideo: IMidiaVideoKV) => void;
}

export const MidiaVideoComponent = ({
    title,
    type,

    isCountries = true,
    isLanguage = true,
    isWatcher = false,
    isOwned = false,
    onClickMore
}: MidiaVideoComponentProps) => {

    const [midiaVideoKVArray, setMidiaVideoKVArray] = useState<IMidiaVideoKV[]>([]);
    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchRangeYear, setSearchRangeYear] = useState<[string, string] | string>();
    const [searchCountries, setSearchCountries] = useState<string[]>([]);
    const [searchLanguage, setSearchLanguage] = useState<string>();
    const [searchWatcher, setSearchWatcher] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const dataLoaded = await loadMidiaVideo(type);
        setMidiaVideoKVArray(createMidiaVideoKV(dataLoaded, type));
    }, [type]);

    useEffect(() => {
        handleLoad();
        setCollapsed(true);
    }, [handleLoad, setCollapsed])

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

    return (
        <>
            <Row className='component-midia'>
                <FilterMidia
                    selectedAlphabets={selectedAlphabets}
                    isCountries={isCountries}
                    isLanguage={isLanguage}
                    isWatcher={isWatcher}
                    isOwned={isOwned}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeCountries={handleChangeCountries}
                    handleChangeLanguage={handleChangeLanguage}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeRangeYear={handleChangeRangeYear}
                    handleChangeWatcher={handleChangeWatcher}
                    handleChangeOwned={handleChangeOwned} />

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