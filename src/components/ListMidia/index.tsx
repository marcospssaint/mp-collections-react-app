import React, { Col, FloatButton, List } from "antd";

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_F_COUNTRIES, TYPE_F_GENRE, TYPE_F_LANGUAGE, TYPE_F_OWNED, TYPE_F_READ, TYPE_F_WATCHED, TYPE_F_YEAR, isFilterIMidiaSingleSelect, isFilterMultipleSelect, isFilterSearch, isFilterSingleSelect } from '../../entities/midia';
import { useQuery } from '../../utils';
import { isNotNull, isNotNullArray, isNotNullStr } from '../../utils/utils';
import { ListItem } from '../antd';

export interface ListMidiaProps {
    emptyMessage: string;
    data: any[];
    search?: string;
    searchGenres?: string[];
    searchCountries?: string[];
    searchRangeYear?: [string, string] | string;
    searchWatcher?: string | null;
    searchRead?: string | null;
    searchOwned?: boolean;
    searchLanguage?: string | null;
    onClickMore: (item: any) => void;
}

export const ListMidia = ({
    emptyMessage,
    data,
    search = '',
    searchGenres = [],
    searchCountries = [],
    searchRangeYear = '',
    searchWatcher = null,
    searchRead = null,
    searchLanguage = null,
    searchOwned,

    onClickMore
}: ListMidiaProps) => {
    const navigate = useNavigate();

    let query = useQuery();

    const defaultCurrent = query.get("page") !== undefined ? Number(query.get("page")) : 1;

    const pageTopRef = useRef<HTMLDivElement>(null);

    const wasResearch = () => {
        return isNotNullStr(search)
            || isNotNullArray(searchGenres)
            || isNotNullArray(searchCountries)
            || searchRangeYear !== null
            || isNotNull(searchWatcher) 
            || isNotNull(searchRead)
            || isNotNull(searchOwned)
            || isNotNull(searchLanguage);
    }

    const filtered =
        wasResearch() ?
            data.filter((midiaKV) => {
                return isFilterSearch(search, midiaKV);
            })
            .filter((midiaKV) => {
                return isFilterMultipleSelect(searchGenres, midiaKV, TYPE_F_GENRE);
            }).filter((midiaKV) => {
                return isFilterMultipleSelect(searchCountries, midiaKV, TYPE_F_COUNTRIES);
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
                    defaultPageSize: 30,
                    position: 'both',
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: paginate,
                }}
                renderItem={(item) => (
                    <ListItem
                        id={item.key.id}
                        midia={item.key}
                        inProcess={isFilterSingleSelect('P', item, TYPE_F_WATCHED)}
                        watched={isFilterSingleSelect('W', item, TYPE_F_WATCHED)}
                        notStarted={isFilterSingleSelect('NOTW', item, TYPE_F_WATCHED)}
                        read={isFilterIMidiaSingleSelect('R', item.key, TYPE_F_READ)}
                        owned={isFilterIMidiaSingleSelect(true, item.key, TYPE_F_OWNED)}
                        handlerClick={() => onClickMore(item)} />
                )}
            />
            <FloatButton.BackTop />
        </Col>
    )
};