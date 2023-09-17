import { useCallback, useContext, useEffect, useState } from 'react';

import { IMidiaLeituraKV } from '../../entities';
import { createMidiaLeituraKV } from '../../entities/midia-leitura';
import { loadMidiaLeitura } from '../../utils/load-midia';

import { Row } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
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

    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchRangeYear, setSearchRangeYear] = useState<[string, string] | string>();
    const [searchCountries, setSearchCountries] = useState<string[]>([]);
    const [searchLanguage, setSearchLanguage] = useState<string>();
    const [searchRead, setSearchRead] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const dataLoaded = await loadMidiaLeitura(type);

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

    const handleChangeRead = (value: string) => {
        setSearchRead(value);
    };

    const handleChangeOwned = (value: boolean) => {
        setSearchOwned(value);
    };

    return (
        <>
            <Row className='component-midia'>
                <FilterMidia
                    selectedAlphabets={selectedAlphabets}
                    isRead={true}
                    isOwned={true}

                    handleChangeAlphabets={handleChangeAlphabets}
                    handleChangeSearch={handleChangeSearch}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeRangeYear={handleChangeRangeYear}

                    handleChangeCountries={handleChangeCountries}
                    handleChangeLanguage={handleChangeLanguage}

                    handleChangeRead={handleChangeRead}
                    handleChangeOwned={handleChangeOwned} />

                <ListMidiaLeitura
                    emptyMessage={`${title} not found 🤐`}
                    data={midiaLeituraKVArray}

                    selectedAlphabets={selectedAlphabets}
                    search={search}
                    searchGenres={searchGenres}
                    searchRangeYear={searchRangeYear}
                    searchCountries={searchCountries}
                    searchLanguage={searchLanguage}
                    searchRead={searchRead}
                    searchOwned={searchOwned}

                    onClickMore={onClickMore}
                />
            </Row>
        </>
    )
}