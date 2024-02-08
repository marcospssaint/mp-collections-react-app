
import { DownloadOutlined } from '@ant-design/icons';

import { useEffect, useState } from "react";

import { Col, Collapse, CollapseProps, Flex, Row, Space, Tag, Typography } from "antd";
import { IMidia, IMidiaLeitura, IMidiaLeituraKV } from '../../entities';
import { TYPE_F_OWNED, isFilterIMidiaSingleSelect } from "../../entities/midia";
import { nOfEditions } from "../../entities/midia-leitura";
import { range, rangeBySeparator } from "../../utils/utils";

interface MidiaLeituraContentPros {
    midiaLeitura: IMidiaLeituraKV;
    isVisible: boolean;
}

const genExtra = (md: IMidia) => {
    return <Row style={{ marginTop: 5 }}>
        <Flex wrap="wrap" gap="small" >
            {
                isFilterIMidiaSingleSelect(true, md, TYPE_F_OWNED) && <DownloadOutlined />
            }
        </Flex>
    </Row>
};

export const MidiaLeituraContent = ({ midiaLeitura, isVisible }: MidiaLeituraContentPros) => {
    const items: CollapseProps['items'] = [midiaLeitura?.key]?.map((value, index) => {
        const mdLeitura = value as IMidiaLeitura;
        const editions = nOfEditions(mdLeitura);

        return ({
            key: index + 1 + "",
            label: <div>
                <Typography.Title level={4}
                    className='text-font-beautiful'
                    style={{
                        fontWeight: 700,
                        margin: 0
                    }}>
                    N° of editions ({editions})
                </Typography.Title>
            </div>,
            children: <NOfEditionsComponent midiaLeitura={midiaLeitura} />,
            extra: genExtra(mdLeitura),
        })
    });

    return (
        <>
            {
                !!isVisible && <Col>
                    <Row>
                        <Collapse
                            accordion
                            defaultActiveKey={['1']}
                            expandIconPosition="end"
                            size="large"
                            style={{ width: '100%' }}
                            items={items} />
                    </Row>
                </Col>
            }
        </>
    )
}

interface NOfEditionsComponentProps {
    midiaLeitura: IMidiaLeituraKV;
    isVisibledTable?: boolean;
}

const NOfEditionsComponent = ({ midiaLeitura, isVisibledTable = false }: NOfEditionsComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [reads, setReads] = useState<(number | number[])[]>([0]);

    useEffect(() => {
        const midiaLeituraK = midiaLeitura.key;
        var numerosCurrent: (number | number[])[] = [];

        if (isVisibledTable) {
            const total = midiaLeitura?.value?.length ?? 0;
            setTotal(total);
            midiaLeitura?.value?.forEach((v, index) => { if (v.owned) numerosCurrent.push(index + 1) })
            setNumeros([...numerosCurrent]);
        } else {
            const volume = String(midiaLeituraK?.volume);

            if (volume?.includes('|') || volume?.includes(',')) {
                setTotal(Number(volume.substring(volume.indexOf('|') + 2)));

                var edicoes = volume.substring(0, volume.indexOf('|')); //'1-5, 6-7, 9';
                var edicoesSplit = edicoes.split(',');
                edicoesSplit.forEach((e) => numerosCurrent.push(...rangeBySeparator(String(e), '-')));
                setNumeros([...numerosCurrent]);
            } else {
                const total = Number(volume);
                setTotal(total);
                setNumeros([...range(1, total)]);
            }
        }

        if (midiaLeituraK?.readVolume !== undefined) {
            setReads([...range(0, midiaLeituraK?.readVolume)]);
        }
    }, [isVisibledTable, midiaLeitura.key, midiaLeitura.value]);

    return (
        <Space direction="vertical">
            <Space wrap>
                {
                    [...Array(total).keys()].map((index) => {
                        const indexCurrent = index + 1;
                        const contais = numeros.includes(indexCurrent);

                        var conditionColor = '#faad14';
                        if (reads.includes(indexCurrent)) {
                            conditionColor = '#52c41a';
                        } else if (contais) {
                            conditionColor = '#1677ff';
                        }

                        return <>
                            <Tag
                                key={indexCurrent}
                                className="tags"
                                color={conditionColor}>
                                {indexCurrent}
                            </Tag>
                        </>
                    })
                }
            </Space>
        </Space>
    );
}