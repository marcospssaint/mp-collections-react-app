import { useEffect, useRef, useState } from "react";

import { Row } from "antd";

import { Breadcrumb } from '../antd';

import { NavLink, useLocation, useParams } from 'react-router-dom';
import { IMidiaLeituraKV } from "../../entities";
import { textByTYPE } from "../../entities/midia-leitura";
import { ModalMidiaLeitura } from "../ModalMidiaLeitura";

import { ListMidiaLeituraSub } from '../ListMidiaLeituraSub';

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

                <ListMidiaLeituraSub
                    data={midiaLeitura.value}
                    onClick={handlerClick} />

                <ModalMidiaLeitura midiaLeitura={midiaLeituraSelected} isModalOpen={isModalOpen} hideModal={hideModal}  />
            </Row>
        </>
    )
}