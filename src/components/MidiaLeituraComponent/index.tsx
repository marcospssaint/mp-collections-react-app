import { useCallback, useContext, useEffect, useState } from 'react';

import { IMidiaLeituraKV } from '../../entities';
import { createMidiaLeituraKV, createOptionsPublisher } from '../../entities/midia-leitura';
import { loadMidiaLeitura } from '../../utils/load-midia';

import { Row } from 'antd';
import { BaseOptionType } from 'antd/es/select';
import { ThemeContext } from '../../contexts/theme-context';
import { FilterMidia } from '../FilterMidia';
import { ListMidiaLeitura } from '../ListMidiaLeitura';

interface MidiaLeituraComponentProps {
    title: string;
    type: string;
    onClickMore: (midiaLeitura: IMidiaLeituraKV) => void;
}

export const MidiaLeituraComponent = ({
    title,
    type,
    onClickMore
}: MidiaLeituraComponentProps) => {
    const [midiaLeituraKVArray, setMidiaLeituraKVArray] = useState<IMidiaLeituraKV[]>([]);

    const [optionsPublisher, setOptionsPublisher] = useState<BaseOptionType[]>([]);

    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchPublishers, setSearchPublishers] = useState<string[]>([]);
    const [searchRead, setSearchRead] = useState<string>();

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const dataLoaded = await loadMidiaLeitura(type);

        setOptionsPublisher(createOptionsPublisher(dataLoaded));
        setMidiaLeituraKVArray(createMidiaLeituraKV(dataLoaded, type));
    }, [type]);

    useEffect(() => {
        handleLoad();
        setCollapsed(true);
    }, [handleLoad, setCollapsed]);

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

    const handleChangePublishers = (value: string[]) => {
        setSearchPublishers(value);
    };

    const handleChangeGenres = (value: string[]) => {
        setSearchGenres(value);
    };

    const handleChangeRead = (value: string) => {
        setSearchRead(value);
    };

    return (
        <>
            <Row className='component-midia'>
                <FilterMidia
                    optionsPublisher={optionsPublisher}
                    selectedAlphabets={selectedAlphabets}
                    isPublisher={true}
                    isRead={true}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeGenres={handleChangeGenres}
                    handleChangePublisher={handleChangePublishers}
                    handleChangeRead={handleChangeRead} />

                <ListMidiaLeitura
                    emptyMessage={`${title} not found 🤐`}
                    data={midiaLeituraKVArray}

                    selectedAlphabets={selectedAlphabets}
                    search={search}
                    searchGenres={searchGenres}
                    searchPublishers={searchPublishers}
                    searchRead={searchRead}

                    onClickMore={onClickMore}
                />
            </Row>
        </>
    )
}