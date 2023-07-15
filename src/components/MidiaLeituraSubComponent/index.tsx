import { useEffect, useRef, useState } from "react";

import { Col, List, Row } from "antd";

import { Breadcrumb } from '../antd';

import { NavLink, useLocation, useParams } from 'react-router-dom';
import { IMidiaLeituraKV } from "../../entities";
import { createIMidiaLeituraKV, textByTYPE } from "../../entities/midia-leitura";
import { ModalMidiaLeitura } from "../ModalMidiaLeitura";
import { ListItem } from "../antd";

export const MidiaLeituraSubComponent = () => {
    let { id } = useParams();
    const { state } = useLocation();

    const pageTopRef = useRef<HTMLDivElement>(null);

    const [midiaLeitura, setMidiaLeitura] = useState({} as IMidiaLeituraKV);
    const [midiaLeituraSelected, setMidiaLeituraSelected] = useState({} as IMidiaLeituraKV);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        pageTopRef.current?.scrollIntoView();
    });

    useEffect(() => {
        const midiaLeituraKV = state as IMidiaLeituraKV ?? {};

        var midiaLeituraV = midiaLeituraKV.value.map((v) => {
            return {...v, collectionTitle: true};
        });

        setMidiaLeitura({...midiaLeituraKV, value: midiaLeituraV});
    }, [id, state]);

    const handlerClick = (midiaLeitura: IMidiaLeituraKV) => {
        setMidiaLeituraSelected(midiaLeitura);
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Row ref={pageTopRef}>
                <Breadcrumb
                    items={[
                        {
                            title: <NavLink to={-1 as any}>{textByTYPE(midiaLeitura)}</NavLink>,
                        },
                        {
                            title: `${midiaLeitura.key?.title}`,
                        },
                    ]}
                />

                <Col span={24} className='component-midia'>
                    <List
                        itemLayout='vertical'
                        dataSource={midiaLeitura.value}
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
                                handlerClick={() => handlerClick(
                                    createIMidiaLeituraKV({
                                        key: item,
                                        value: []
                                    })
                                )
                            } />
                        )}
                    />
                </Col>

                <ModalMidiaLeitura midiaLeitura={midiaLeituraSelected} isModalOpen={isModalOpen} hideModal={hideModal}  />
            </Row>
        </>
    )
}