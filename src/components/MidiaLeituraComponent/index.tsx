import { useCallback, useContext, useEffect, useState } from 'react';

import { IMidiaLeituraKV } from '../../entities';
import { COMICS, createMidiaLeituraKV } from '../../entities/midia-leitura';
import { loadMidiaLeitura } from '../../utils/load-midia';

import { Row } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { BaseOptionType } from 'antd/es/select';
import { ThemeContext } from '../../contexts/theme-context';
import { TYPE_F_COUNTRIES, TYPE_F_GENRE, TYPE_F_LANGUAGE, createOptions } from '../../entities/midia';
import { isNotNullStr } from '../../utils/utils';
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
    const [optionsCountries, setOptionsCountries] = useState<BaseOptionType[]>([]);
    const [optionsGenres, setOptionsGenres] = useState<BaseOptionType[]>([]);
    const [optionsLanguage, setOptionsLanguage] = useState<BaseOptionType[]>([]);

    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const [searchGenres, setSearchGenres] = useState<string[]>([]);
    const [searchRangeYear, setSearchRangeYear] = useState<[string, string] | string>();
    const [searchLanguage, setSearchLanguage] = useState<string>();
    const [searchRead, setSearchRead] = useState<string>();
    const [searchOwned, setSearchOwned] = useState<boolean>();

    const isFilterCountry = type === COMICS;

    const { setCollapsed } = useContext(ThemeContext);

    const handleLoad = useCallback(async () => {
        const dataLoaded = await loadMidiaLeitura(type);
        setMidiaLeituraKVArray(createMidiaLeituraKV(dataLoaded, type));
        setOptionsCountries(createOptions(dataLoaded, TYPE_F_COUNTRIES));
        setOptionsGenres(createOptions(dataLoaded, TYPE_F_GENRE));
        setOptionsLanguage(createOptions(dataLoaded, TYPE_F_LANGUAGE));
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

    const handleSelectedCountry = (e: any) => {
        const { value } = e.target;
        setSelectedCountry(value);
    }

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
                    optionsCountries={optionsCountries}
                    optionsGenres={optionsGenres}
                    optionsLanguage={optionsLanguage}
                    isRead={true}
                    isOwned={true}
                    isFilterCountries={isFilterCountry}
                    selectedCountry={selectedCountry}

                    handleChangeSearch={handleChangeSearch}
                    handleChangeAlphabets={handleChangeAlphabets}
                    handleSelectedCountry={handleSelectedCountry}

                    handleChangeGenres={handleChangeGenres}
                    handleChangeRangeYear={handleChangeRangeYear}

                    handleChangeLanguage={handleChangeLanguage}
                    handleChangeRead={handleChangeRead}
                    handleChangeOwned={handleChangeOwned} />

                {
                    (!isFilterCountry || 
                        (isFilterCountry && (isNotNullStr(selectedCountry) || isNotNullStr(search)))
                    ) &&
                        <ListMidiaLeitura
                            emptyMessage={`${title} not found 🤐`}
                            data={midiaLeituraKVArray}

                            selectedAlphabets={selectedAlphabets}
                            search={search}
                            selectedCountry={selectedCountry}
                            searchGenres={searchGenres}
                            searchRangeYear={searchRangeYear}
                            searchLanguage={searchLanguage}
                            searchRead={searchRead}
                            searchOwned={searchOwned}

                            onClickMore={onClickMore}
                        />
                }
            </Row>
        </>
    )
}