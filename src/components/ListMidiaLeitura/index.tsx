import './styles.css';

import { Col, FloatButton, List } from "antd";

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_F_GENRE, TYPE_F_PUBLISHER, TYPE_F_READ, TYPE_F_YEAR, isFilterAlphabets, isFilterMultipleSelect, isFilterSearch, isFilterSingleSelect } from '../../entities/midia';
import { IMidiaLeituraKV } from '../../entities/midia-leitura';
import { useQuery } from '../../utils';
import { isNotNull, isNotNullArray, isNotNullStr } from '../../utils/utils';
import { ListItem } from '../antd';

export interface ListMidiaLeituraProps {
    emptyMessage: string;
    data: IMidiaLeituraKV[];
    selectedAlphabets?: string[];
    search?: string;
    searchPublishers?: string[];
    searchGenres?: string[];
    searchYears?: string[];
    searchRead?: string | null;
    onClickMore: (item: IMidiaLeituraKV) => void;
}

export const ListMidiaLeitura = ({
    emptyMessage,
    data,

    selectedAlphabets = [],
    search = '',
    searchYears = [],
    searchPublishers = [],
    searchGenres = [],
    searchRead = null,

    onClickMore
}: ListMidiaLeituraProps) => {
    const navigate = useNavigate();

    let query = useQuery();

    const defaultCurrent = query.get("page") !== undefined ? Number(query.get("page")) : 1;

    const pageTopRef = useRef<HTMLDivElement>(null);

    const wasResearch = () => {
        return isNotNullArray(selectedAlphabets) 
            || isNotNullStr(search)
            || isNotNullArray(searchYears)
            || isNotNullArray(searchPublishers)
            || isNotNullArray(searchGenres)
            || isNotNull(searchRead);
    }

    const filtered =
        wasResearch() ?
            data.filter((midiaLeituraKV) => {
                return isFilterSearch(search, midiaLeituraKV);
            }).filter((midiaLeituraKV) => {
                return isFilterAlphabets(selectedAlphabets, midiaLeituraKV);
            }).filter((midiaLeituraKV) => {
                return isFilterMultipleSelect(searchGenres, midiaLeituraKV, TYPE_F_GENRE);
            }).filter((midiaLeituraKV) => {
                return isFilterMultipleSelect(searchYears, midiaLeituraKV, TYPE_F_YEAR);
            }).filter((midiaLeituraKV) => {
                return isFilterMultipleSelect(searchPublishers, midiaLeituraKV, TYPE_F_PUBLISHER);
            }).filter((midiaLeituraKV) => {
                return isFilterSingleSelect(searchRead, midiaLeituraKV, TYPE_F_READ);
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
                        handlerClick={() => onClickMore(item)} />
                )}
            />
            <FloatButton.BackTop />
        </Col>
    )
};