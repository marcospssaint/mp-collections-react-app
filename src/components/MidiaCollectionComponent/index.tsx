import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Col, Divider, Row, Typography } from "antd";
import { IMidiaKV } from "../../entities/midia";
import { createIMidiaLeituraKV } from "../../entities/midia-leitura";
import { ListMidia } from "../ListMidia";

export const MidiaCollectionComponent = () => {
    let { id } = useParams();
    const { state } = useLocation();

    const navigate = useNavigate();
    const pageTopRef = useRef<HTMLDivElement>(null);

    const [midia, setMidia] = useState({} as IMidiaKV);
    const [midiasKV, setMidiasKV] = useState([]);

    useEffect(() => {
        pageTopRef.current?.scrollIntoView();
    });

    useEffect(() => {
        const midiaKV = state ?? {} as IMidiaKV;

        const midiasKV = midiaKV?.value.map((value: any) => {
            return createIMidiaLeituraKV({
                key: { ...value, title: value.subtitle },
                value: []
            })
        });

        setMidiasKV(midiasKV);
        setMidia(midiaKV);
    }, [id, state]);

    const title = () => {
        return midia?.key?.title;
    }

    const onClickMore = (midia: any) => {
        const URL = window.location.hash.split('/');
        navigate('/' + URL.at(1) + '/' + midia?.key.id, {
            state: midia
        });
    }

    return (
        <Row ref={pageTopRef}>
            <Col>
                <Typography.Title
                    level={3}
                    className="text-font-beautiful">
                    {title()}
                </Typography.Title>
            </Col>
            <Divider style={{ margin: 0 }} />
            <ListMidia
                data={midiasKV}
                onClickMore={onClickMore} />
        </Row>
    )
}