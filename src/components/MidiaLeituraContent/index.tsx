
import { DownloadOutlined } from '@ant-design/icons';

import { useEffect, useState } from "react";

import { Avatar, Col, Collapse, CollapseProps, Flex, Row, Space, Tag, Typography } from "antd";
import { IMidiaLeitura, IMidiaLeituraKV } from '../../entities';
import { TYPE_F_OWNED, isFilterIMidiaSingleSelect } from "../../entities/midia";
import { nOfEdition } from "../../entities/midia-leitura";
import { range, rangeBySeparator } from "../../utils/utils";
import { IconFlagLanguage } from '../antd';

interface MidiaLeituraContentPros {
    midiaLeitura: IMidiaLeituraKV;
    isVisible: boolean;
}

const genExtra = (md: any, isMoreLanguage: boolean, language: any, volume: any) => {
    return <Row style={{ marginTop: 5 }}>
        <Flex wrap="wrap" gap="small" >
            <Avatar src={IconFlagLanguage(language)} size={'small'} />
            {
                (isMoreLanguage && volume?.includes(' | ')) && <></>
            }
            {
                (isMoreLanguage && !volume?.includes(' | ')) && <DownloadOutlined />
            }
            {
                (!isMoreLanguage && isFilterIMidiaSingleSelect(true, md, TYPE_F_OWNED)) && <DownloadOutlined />
            }
        </Flex>
    </Row>
};

export const MidiaLeituraContent = ({ midiaLeitura, isVisible }: MidiaLeituraContentPros) => {

    const itemsMidia = () => {
        const mdLeituraK = midiaLeitura?.key;
        const lengthLanguage = mdLeituraK?.language?.split(', ')?.length ?? 0;

        if (lengthLanguage > 1) {
            const list = Array.from({ length: lengthLanguage }).map((l, index) => {
                const languageCurrent = mdLeituraK?.language?.split(',').at(index);
                const volumeCurrent_ = mdLeituraK?.volume?.split(';').at(index);
                const readVolumeCurrent_ = mdLeituraK?.readVolume?.split(';').at(index);
                const editions = nOfEdition(volumeCurrent_?.trim());

                return ({
                    i: index,
                    language: languageCurrent?.trim(),
                    volumeCurrent: String(volumeCurrent_),
                    volume: editions,
                    readVolume: Number(readVolumeCurrent_),
                    text: 'N° of editions (' + editions + ')',
                    isMoreLanguage: true
                });
            })
            return list;
        }

        return [
            ({
                index: 1,
                language: mdLeituraK?.language,
                volumeCurrent: String(mdLeituraK?.volume),
                volume: nOfEdition(mdLeituraK?.volume),
                readVolume: Number(mdLeituraK?.readVolume),
                text: 'N° of editions (' + nOfEdition(mdLeituraK?.volume) + ')',
                isMoreLanguage: false
            })
        ];
    }

    const items: CollapseProps['items'] = itemsMidia()?.map((value, index) => {
        const mdLeitura = midiaLeitura?.key as IMidiaLeitura;

        return ({
            key: index + "",
            label: <Row>
                <Typography.Title level={4}
                    className='text-font-beautiful'
                    style={{
                        fontWeight: 700,
                        margin: 0
                    }}>

                    {value?.text}
                </Typography.Title>
            </Row>,
            children: <NOfEditionsComponent
                isMoreLanguage={value.isMoreLanguage}
                volumeCurrent={value.volumeCurrent}
                readVolumeCurrent={value.readVolume} />,
            extra: genExtra(mdLeitura, value.isMoreLanguage, value.language, value.volumeCurrent),
        })
    });

    return (
        <>
            {
                !!isVisible && <Col>
                    <Row>
                        <Collapse
                            accordion
                            defaultActiveKey={['0']}
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
    isMoreLanguage: boolean;
    volumeCurrent?: string,
    readVolumeCurrent?: number,
}

const NOfEditionsComponent = ({ isMoreLanguage, volumeCurrent, readVolumeCurrent }: NOfEditionsComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [reads, setReads] = useState<(number | number[])[]>([0]);

    useEffect(() => {
        var numerosCurrent: (number | number[])[] = [];

        if (volumeCurrent?.includes('|') || volumeCurrent?.includes(',')) {
            setTotal(Number(volumeCurrent.substring(volumeCurrent.indexOf('|') + 2)));

            var edicoes = volumeCurrent.substring(0, volumeCurrent.indexOf('|')); //'1-5, 6-7, 9';
            var edicoesSplit = edicoes.split(',');
            edicoesSplit.forEach((e) => numerosCurrent.push(...rangeBySeparator(String(e), '-')));
            setNumeros([...numerosCurrent]);
        } else {
            const total = Number(volumeCurrent);
            setTotal(total);
            setNumeros([...range(1, total)]);
        }

        if (readVolumeCurrent !== undefined && !Number.isNaN(readVolumeCurrent)) {
            setReads([...range(0, readVolumeCurrent)]);
        }
    }, [isMoreLanguage, readVolumeCurrent, volumeCurrent]);

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