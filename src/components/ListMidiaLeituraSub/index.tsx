import { Col, List } from "antd";

import { IMidiaLeitura, IMidiaLeituraKV, createIMidiaLeituraKV } from '../../entities/midia-leitura';
import { ListItem } from '../antd';

export interface ListMidiaLeituraSubProps {
    data: IMidiaLeitura[];
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