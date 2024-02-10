import { Col, FloatButton, List } from "antd";

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_F_OWNED, TYPE_F_READ, TYPE_F_WATCHED, isFilterIMidiaSingleSelect, isFilterSingleSelect } from '../../entities/midia';
import { useQuery } from '../../utils';
import { ListItem } from '../antd';

export interface ListMidiaProps {
    data: any[];
    emptyMessage?: string;
    onClickMore: (item: any) => void;
}

export const ListMidia = ({
    emptyMessage = '',
    data,
    onClickMore
}: ListMidiaProps) => {
    const navigate = useNavigate();

    let query = useQuery();

    const defaultCurrent = query.get("page") !== undefined ? Number(query.get("page")) : 1;

    const pageTopRef = useRef<HTMLDivElement>(null);

    const paginate = (e: any) => {
        const pageNumber = Number(e)
        const URL = window.location.hash.replace('#', '').split('?');
        const queryPage = URL.at(1)?.includes('page') ? URL.at(1)?.split("&") : null;

        if (URL !== undefined && URL.at(1)?.includes('alphabets') && queryPage?.at(1) != null) {
            navigate(URL?.at(0) + '?'+ queryPage?.at(0) + '&page='+pageNumber);
        } else if (URL !== undefined && URL.at(1)?.includes('alphabets')) {
            navigate(URL?.at(0) + '?'+ URL?.at(1) + '&page='+pageNumber);
        } else {
            navigate(`?page=${pageNumber}`);
        }

        pageTopRef.current?.scrollIntoView();
    };

    return (
        <Col span={24} ref={pageTopRef}>
            <List
                itemLayout='vertical'
                dataSource={data}
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