import './styles.css';

import { Col, FloatButton, List } from "antd";

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_F_GENRE, TYPE_F_LANGUAGE, TYPE_F_OWNED, TYPE_F_READ, TYPE_F_YEAR, isFilterAlphabets, isFilterCountry, isFilterIMidiaSingleSelect, isFilterMultipleSelect, isFilterSearch, isFilterSingleSelect } from '../../entities/midia';
import { IMidiaLeituraKV } from '../../entities/midia-leitura';
import { useQuery } from '../../utils';
import { isNotNull, isNotNullArray, isNotNullStr } from '../../utils/utils';
import { ListItem } from '../antd';

export interface ListMidiaLeituraProps {
    emptyMessage: string;
    data: IMidiaLeituraKV[];
    selectedAlphabets?: string[];
    selectedCountry?:string;
    search?: string;
    searchGenres?: string[];
    searchRangeYear?: [string, string] | string;

    searchLanguage?: string | null;
    searchRead?: string | null;
    searchOwned?: boolean;
    onClickMore: (item: IMidiaLeituraKV) => void;
}

export const ListMidiaLeitura = ({
    emptyMessage,
    data,

    selectedAlphabets = [],
    selectedCountry = '',
    search = '',
    searchGenres = [],
    searchRangeYear = '',
    searchLanguage = null,
    searchRead = null,
    searchOwned,

    onClickMore
}: ListMidiaLeituraProps) => {
    const navigate = useNavigate();

    let query = useQuery();

    const defaultCurrent = query.get("page") !== undefined ? Number(query.get("page")) : 1;

    const pageTopRef = useRef<HTMLDivElement>(null);

    const wasResearch = () => {
        return isNotNullArray(selectedAlphabets)
            || isNotNullStr(search)
            || isNotNullStr(selectedCountry)
            || searchRangeYear !== null
            || isNotNullArray(searchGenres)
            || isNotNull(searchLanguage)
            || isNotNull(searchRead)
            || isNotNull(searchOwned);
    }

    const filtered =
        wasResearch() ?
            data.filter((midiaLeituraKV) => {
                return isFilterSearch(search, midiaLeituraKV);
            }).filter((midiaLeituraKV) => {
                return isFilterAlphabets(selectedAlphabets, midiaLeituraKV);
            }).filter((midiaLeituraKV) => {
                return isFilterCountry(selectedCountry, midiaLeituraKV);
            })
            .filter((midiaLeituraKV) => {
                return isFilterMultipleSelect(searchGenres, midiaLeituraKV, TYPE_F_GENRE);
            }).filter((midiaLeituraKV) => {
                return isFilterSingleSelect(searchRangeYear, midiaLeituraKV, TYPE_F_YEAR);
            }).filter((midiaLeituraKV) => {
                return isFilterSingleSelect(searchLanguage, midiaLeituraKV, TYPE_F_LANGUAGE);
            }).filter((midiaLeituraKV) => {
                return isFilterSingleSelect(searchRead, midiaLeituraKV, TYPE_F_READ);
            }).filter((midiaVideoKV) => {
                return isFilterSingleSelect(searchOwned, midiaVideoKV, TYPE_F_OWNED);
            })
            : data;

    const paginate = (e: any) => {
        const pageNumber = Number(e)
        navigate(`?page=${pageNumber}`);

        pageTopRef.current?.scrollIntoView();
    };

    return (
        <Col span={24} ref={pageTopRef}>
            <List
                itemLayout='vertical'
                dataSource={filtered}
                locale={{ emptyText: emptyMessage }}
                rowKey={(item) => item.key.id}
                grid={{
                    gutter: 2,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 5,
                    xxl: 8,
                }}
                pagination={{
                    defaultCurrent: defaultCurrent,
                    defaultPageSize: 100,
                    position: 'both',
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: paginate,
                }}
                renderItem={(item) => (
                    <ListItem
                        id={item.key.id}
                        midia={item.key}
                        read={isFilterIMidiaSingleSelect('R', item.key, TYPE_F_READ)}
                        owned={isFilterIMidiaSingleSelect(true, item.key, TYPE_F_OWNED)}
                        handlerClick={() => onClickMore(item)} />
                )}
            />
            <FloatButton.BackTop />
        </Col>
    )
};