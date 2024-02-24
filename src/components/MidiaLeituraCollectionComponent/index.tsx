import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Col, Collapse, Divider, Input, Row, Typography } from "antd";
import { IMidiaLeituraKV } from "../../entities";
import { isFilterSearch } from "../../entities/midia";
import { createIMidiaLeituraKV, instanceOfKV } from "../../entities/midia-leitura";
import { isNotNullStr } from "../../utils/utils";
import { ListMidia } from "../ListMidia";

export const MidiaLeituraCollectionComponent = () => {
    let { id } = useParams();
    const { state } = useLocation();

    const navigate = useNavigate();
    const pageTopRef = useRef<HTMLDivElement>(null);

    const [midia, setMidia] = useState({} as IMidiaLeituraKV);
    const [isMidiaKV, setMidiaKV] = useState(false);

    const [search, setSearch] = useState('');

    useEffect(() => {
        pageTopRef.current?.scrollIntoView();
    });

    useEffect(() => {
        const midiaKV = state ?? {} as IMidiaLeituraKV;

        setMidiaKV(midia?.value?.some((v: any) => v !== undefined && instanceOfKV(v)) ?? false);
        setMidia(midiaKV);
    }, [id, midia?.value, state]);

    const title = () => {
        return midia?.key?.title;
    }

    const onClickMore = (midiaSelection: any) => {
        const URL = window.location.hash.split('/');

        if (instanceOfKV(midiaSelection)) {
            navigate('/' + URL.at(1) + '/' + midiaSelection?.key.id, {
                state: midiaSelection
            });
        } else {
            navigate('/' + URL.at(1) + '/' + midiaSelection?.id, {
                state: createIMidiaLeituraKV({
                    key: { ...midiaSelection, title: midiaSelection.publicationTitle },
                    value: []
                })
            });
        }
    }

    const handleChangeSearch = (e: any) => {
        const { value } = e.target;
        setSearch(value);
    };

    const createMidiaLeitura = (midia_: any) => ({ ...midia_, title: midia_?.publicationTitle, countries: midia?.key?.countries, genre: midia?.key?.genre })

    const wasResearch = () => {
        return isNotNullStr(search);
    }

    const filtered =
        wasResearch() ?
            midia?.value?.map((midia: any) => {
                if (isMidiaKV) {
                    const valueFiltered = (midia.value as IMidiaLeituraKV[])?.filter((c: any) => isFilterSearch(search, c));

                    if (valueFiltered?.length > 0) {
                        return ({
                            key: midia.key,
                            value: valueFiltered
                        })
                    }
                    return undefined;
                }
                return isFilterSearch(search, midia) ? midia : undefined;
            }).filter((v) => v !== undefined) : midia?.value;

    return (
        <Row className='responsive-two-columns' ref={pageTopRef}>
            <Col>
                <Row>
                    <Collapse
                        defaultActiveKey={['1']}
                        expandIconPosition="end"
                        style={{ width: '100%' }}
                        items={[
                            {
                                key: '1',
                                label: 'Filters',
                                children:
                                    <>
                                        <Col>
                                            <div>
                                                <Typography.Title level={5}>Keywords</Typography.Title>
                                                <Input
                                                    placeholder="Filter by keywords..."
                                                    allowClear
                                                    onChange={handleChangeSearch}
                                                />
                                            </div>
                                        </Col>
                                    </>
                            }
                        ]}
                    />
                </Row>

            </Col>
            <Col>
                <Col>
                    <Typography.Title
                        level={3}
                        className="text-font-beautiful">
                        {title()}
                    </Typography.Title>
                </Col>
                <Divider style={{ margin: 0 }} />

                {

                    isMidiaKV && filtered?.map((midiaV: any) => {
                        const midiaPhaseKV = (midiaV as IMidiaLeituraKV)
                        if (midiaPhaseKV?.value !== undefined) {
                            const newMidiaKey = midiaPhaseKV?.key;
                            const newMidiaPhaseValue = midiaPhaseKV.value.map(createMidiaLeitura)

                            return (
                                <>
                                    <Divider style={{ margin: 0 }} />
                                    <Col>
                                        <Typography.Title
                                            level={3}
                                            className="text-font-beautiful">
                                            {newMidiaKey?.phase}
                                        </Typography.Title>
                                    </Col>

                                    <Col span={24}>
                                        <Typography.Paragraph style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                                            {newMidiaKey?.notes}
                                        </Typography.Paragraph>
                                    </Col>
                                    <Divider style={{ margin: 0 }} />
                                    <ListMidia
                                        loading={false}
                                        collection={true}
                                        data={newMidiaPhaseValue as IMidiaLeituraKV[]}
                                        leitura={true}
                                        onClickMore={onClickMore} />
                                </>
                            )
                        }
                        return <></>
                    })
                }
                {
                    !isMidiaKV && <ListMidia
                        loading={false}
                        collection={true}
                        leitura={true}
                        data={filtered?.map(createMidiaLeitura) as IMidiaLeituraKV[]}
                        onClickMore={onClickMore} />
                }
            </Col>
        </Row>
    )
}