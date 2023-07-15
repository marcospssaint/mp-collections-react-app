import './styles.css';

import { Col, FloatButton, List } from "antd";

import { useRef } from 'react';
import { TYPE_F_GENRE, TYPE_F_OWNED, TYPE_F_WATCHED, isFilterAlphabets, isFilterMultipleSelect, isFilterSearch, isFilterSingleSelect } from '../../entities/midia';
import { IMidiaVideoKV } from '../../entities/midia-video';
import { isNotNull, isNotNullArray, isNotNullStr } from '../../utils/utils';
import { ListItem } from '../antd';

export interface ListMidiaVideoProps {
    emptyMessage: string;
    data: IMidiaVideoKV[];
    selectedAlphabets?: string[];
    search?: string;
    searchGenres?: string[];
    searchWatcher?: string;
    searchOwned?: boolean;
    onClickMore: (item: IMidiaVideoKV) => void;
}

export const ListMidiaVideo = ({
    emptyMessage,
    data,
    selectedAlphabets = [],
    search = '',
    searchGenres = [],
    searchWatcher,
    searchOwned,
    onClickMore
}: ListMidiaVideoProps) => {

    const pageTopRef = useRef<HTMLDivElement>(null);

    const wasResearch = () => {
        return isNotNullArray(selectedAlphabets) 
            || isNotNullStr(search) 
            || isNotNullArray(searchGenres)
            || isNotNull(searchWatcher) 
            || isNotNull(searchOwned);
    }

    const filtered =
        wasResearch() ?
            data.filter((midiaVideoKV) => {
                return isFilterAlphabets(selectedAlphabets, midiaVideoKV);
            }).filter((midiaVideoKV) => {
                return isFilterSearch(search, midiaVideoKV);
            }).filter((midiaVideoKV) => {
                return isFilterMultipleSelect(searchGenres, midiaVideoKV, TYPE_F_GENRE);
            }).filter((midiaVideoKV) => {
                return isFilterSingleSelect(searchWatcher, midiaVideoKV, TYPE_F_WATCHED);
            }).filter((midiaVideoKV) => {
                return isFilterSingleSelect(searchOwned, midiaVideoKV, TYPE_F_OWNED);
            })
            : data;

    const paginate = () => {
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
                    defaultPageSize: 100,
                    position: 'both',
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: paginate,
                }}
                renderItem={(item) => (
                    <ListItem
                        id={item.key.id}
                        midia={item.key}
                        handlerClick={() => onClickMore(item)}>
                    </ListItem>
                )}
            />
            <FloatButton.BackTop />
        </Col>
    )
};