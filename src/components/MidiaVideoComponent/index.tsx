import { useCallback, useContext, useEffect, useState } from 'react';

import { ListMidiaVideo } from "../ListMidiaVideo";

import { Row } from 'antd';
import { ThemeContext } from '../../contexts/theme-context';
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

    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchWatcher, setSearchWatcher] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        setMidiaVideoKVArray(createMidiaVideoKV(await loadMidiaVideo(type), type));
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
                    isWatcher={isWatcher}
                    isOwned={isOwned}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeWatcher={handleChangeWatcher}
                    handleChangeOwned={handleChangeOwned} />

                <ListMidiaVideo
                    emptyMessage={`${title} not found 🤐`}
                    data={midiaVideoKVArray}
                    selectedAlphabets={selectedAlphabets}
                    search={search}
                    searchGenres={searchGenres}
                    searchWatcher={searchWatcher}
                    searchOwned={searchOwned}
                    onClickMore={onClickMore} />
            </Row>
        </>
    )
}