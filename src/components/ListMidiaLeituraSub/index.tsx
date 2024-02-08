import { Col, List } from "antd";

import { TYPE_F_OWNED, TYPE_F_READ, isFilterIMidiaSingleSelect } from "../../entities/midia";
import { IMidiaLeitura, IMidiaLeituraKV, createIMidiaLeituraKV } from '../../entities/midia-leitura';
import { ListItem } from '../antd';

export interface ListMidiaLeituraSubProps {
    data: IMidiaLeitura[] | undefined;
    onClick: (item: IMidiaLeituraKV) => void;
}

export const ListMidiaLeituraSub = ({
    data,
    onClick

}: ListMidiaLeituraSubProps) => {
    return (
        <Col span={24} className='component-midia'>
            <List
                itemLayout='vertical'
                dataSource={data}
                rowKey={(item) => item.id}
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
                    disabled: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                renderItem={(item) => (
                    <ListItem
                        id={item.id}
                        midia={item}
                        read={isFilterIMidiaSingleSelect('R', item, TYPE_F_READ)}
                        owned={isFilterIMidiaSingleSelect(true, item, TYPE_F_OWNED)}
                        handlerClick={() => onClick(
                            createIMidiaLeituraKV({
                                key: item,
                                value: []
                            })
                        )} />
                )}
            />
        </Col>
    )
};