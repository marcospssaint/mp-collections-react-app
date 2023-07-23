import { useCallback, useContext, useEffect, useState } from 'react';

import { ListMidiaVideo } from "../ListMidiaVideo";

import { Row } from 'antd';
import { BaseOptionType } from 'antd/es/select';
import { ThemeContext } from '../../contexts/theme-context';
import { createOptionsYears } from '../../entities/midia';
import { IMidiaVideoKV, createMidiaVideoKV } from '../../entities/midia-video';
import { loadMidiaVideo } from '../../utils';
import { FilterMidia } from '../FilterMidia';

interface MidiaVideoComponentProps {
    title: string;
    type: string;
    isWatcher?: boolean;
    isOwned?: boolean;
    onClickMore: (midiaVideo: IMidiaVideoKV) => void;
}

export const MidiaVideoComponent = ({
    title,
    type,
    isWatcher = false,
    isOwned = false,
    onClickMore
}: MidiaVideoComponentProps) => {

    const [midiaVideoKVArray, setMidiaVideoKVArray] = useState<IMidiaVideoKV[]>([]);

    const [optionsYears, setOptionsYears] = useState<BaseOptionType[]>([]);

    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchYears, setSearchYears] = useState<string[]>([]);
    const [searchWatcher, setSearchWatcher] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const dataLoaded = await loadMidiaVideo(type);
        setOptionsYears(createOptionsYears(dataLoaded));
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

    const handleChangeYears = (value: string[]) => {
        setSearchYears(value);
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
                    optionsYears={optionsYears}
                    isWatcher={isWatcher}
                    isOwned={isOwned}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeYears={handleChangeYears}
                    handleChangeWatcher={handleChangeWatcher}
                    handleChangeOwned={handleChangeOwned} />

                <ListMidiaVideo
                    emptyMessage={`${title} not found 🤐`}
                    data={midiaVideoKVArray}
                    selectedAlphabets={selectedAlphabets}
                    search={search}
                    searchGenres={searchGenres}
                    searchYears={searchYears}
                    searchWatcher={searchWatcher}
                    searchOwned={searchOwned}
                    onClickMore={onClickMore} />
            </Row>
        </>
    )
}