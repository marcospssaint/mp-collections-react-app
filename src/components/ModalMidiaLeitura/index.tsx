import { useEffect, useState } from "react";

import { FireFilled } from '@ant-design/icons';

import { Badge, Button, Col, Descriptions, Space, Typography } from "antd";
import { Modal, Tag } from "../antd";

import { IMidiaLeitura, IMidiaLeituraKV } from '../../entities';
import { isNotNull } from "../../utils";

import Table, { ColumnsType } from "antd/es/table";
import { isNotNullArray, range, rangeBySeparator } from "../../utils/utils";

interface ModalMidiaLeituraPros {
    midiaLeitura: IMidiaLeituraKV;
    isModalOpen: boolean;
    hideModal: () => void;
}

export const ModalMidiaLeitura = ({ midiaLeitura, isModalOpen, hideModal, }: ModalMidiaLeituraPros) => {
    const midiaLeituraK = midiaLeitura.key;
    const midiaLeituraV = midiaLeitura.value;

    const [image, setImage] = useState<string | undefined | null>();
    const [indexCurrent, setIndexCurrent] = useState<number>(1);
    const [genres, setGenres] = useState<(string | undefined)[]>();
    const [isVisibledTable, setVisibledTable] = useState<boolean>(false);

    const { Paragraph } = Typography;

    useEffect(() => {
        const isNotNullArrayMidiaV = isNotNullArray(midiaLeituraV);

        if (midiaLeituraV?.length === 1) {
            setVisibledTable(midiaLeituraV !== undefined && midiaLeituraV?.length > 1);
        } else {
            setVisibledTable(isNotNullArrayMidiaV);
        }

        setImage(midiaLeituraK?.img);
        setGenres(midiaLeituraK?.genre?.split(','));
    }, [midiaLeituraK?.genre, midiaLeituraK?.img, midiaLeituraV]);

    const authors = (author?: string) => {
        return author?.replaceAll(',', ' · ')
            .replaceAll('<<!>>', 'Write/Perciler: ')
            .replaceAll('<<>>', 'Writes: ')
            .replaceAll('<*>', 'Pencilers: ')
            .replaceAll('<>', 'Write: ')
            .replaceAll('*', 'Penciler: ');
    }

    const columns: ColumnsType<IMidiaLeitura> = [
        {
            title: 'Title',
            dataIndex: 'subtitle',
            key: 'subtitle'
        },
        {
            title: 'Title Original',
            dataIndex: 'titleOriginal',
            key: 'titleOriginal'
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            align: 'center'
        },
        {
            title: 'Read',
            dataIndex: 'read',
            key: 'read',
            align: 'center',
            render: (read) => read === 'R' ? <Badge status="success" /> : <Badge status="processing" text="In process" />,
        }
    ];

    return (
        <Modal
            isModalOpen={isModalOpen}
            witdh={700}
            hideModal={hideModal}
            img={image}
            imgHeight={!isVisibledTable ? 460 : 360}
            children={
                <Descriptions
                    key={`${midiaLeituraK?.id}_descriptions`}
                    layout="vertical"
                    bordered
                    style={{ maxHeight: !isVisibledTable ? 460 : 360, overflow: 'auto' }}>

                    {
                        isVisibledTable &&
                        <>
                            <Descriptions.Item label="Name" span={3}>{midiaLeituraK?.title}</Descriptions.Item>

                            <Descriptions.Item label="N° of editions" span={3}>
                                <NOfEditionsComponent
                                    key={`${midiaLeituraK?.id}_owneds`}
                                    midiaLeitura={midiaLeitura}
                                    isVisibledTable={isVisibledTable}
                                    setImage={setImage}
                                    setIndex={setIndexCurrent} />
                            </Descriptions.Item>
                        </>
                    }

                    {
                        !isVisibledTable &&
                        <>
                            <Descriptions.Item label="Title" span={3}>{midiaLeituraK?.title}</Descriptions.Item>
                            {
                                (isNotNull(midiaLeituraK?.titleOriginal)) &&
                                <Descriptions.Item label="Title original" span={3}>{midiaLeituraK?.titleOriginal ?? '-'}</Descriptions.Item>
                            }
                        </>
                    }


                    <Descriptions.Item label="Genres" span={3}>
                        {genres?.map((genre, index) => <Tag color="blue" label={genre} key={index} />)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Publisher" span={3}>{midiaLeituraK?.publisher}</Descriptions.Item>
                    {
                        !isVisibledTable &&
                        <>
                            <Descriptions.Item label="Year" span={3}>{midiaLeituraK?.year}</Descriptions.Item>
                            <Descriptions.Item label="N° of editions" span={3}>
                                <NOfEditionsComponent
                                    key={`${midiaLeituraK?.id}_owneds`}
                                    midiaLeitura={midiaLeitura}
                                    isVisibledTable={isVisibledTable}
                                    setImage={setImage}
                                    setIndex={setIndexCurrent} />
                            </Descriptions.Item>
                        </>
                    }

                    {
                        isNotNull(midiaLeituraK?.synopsis) &&
                        <Descriptions.Item label="Synopsis" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} style={{ textAlign: 'justify' }}>
                                {midiaLeituraK?.synopsis}
                            </Paragraph>
                        </Descriptions.Item>
                    }
                    {
                        isNotNull(midiaLeituraK?.authors) &&
                        <Descriptions.Item label="Authors" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                {authors(midiaLeituraK?.authors)}
                            </Paragraph>
                        </Descriptions.Item>
                    }

                    {
                        isNotNull(midiaLeituraK?.notes) &&
                        <Descriptions.Item label="Notas" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            {midiaLeituraK?.notes}
                        </Descriptions.Item>
                    }

                    {
                        !isVisibledTable &&
                        <Descriptions.Item label="Read">
                            {midiaLeituraK?.read === 'R' ? <Badge status="success" text="Yes" /> : <Badge status="processing" text="In process" />}
                        </Descriptions.Item>
                    }
                </Descriptions >
            }
            subChildren={
                <>
                    {
                        isVisibledTable &&
                        <Col className='table-modal' span={24}>
                            <Table
                                id={midiaLeituraK?.id + "_leitura"}
                                columns={columns}
                                dataSource={midiaLeituraV}
                                rowKey={(item) => item.id}
                                pagination={{
                                    pageSize: 1,
                                    current: indexCurrent,
                                    position: ['topRight'],
                                    disabled: true,
                                }}
                                size="small" />
                        </Col>
                    }
                </>
            }
        />
    )
}

interface NOfEditionsComponentProps {
    midiaLeitura: IMidiaLeituraKV;
    isVisibledTable: boolean;
    setImage: (image?: string | null) => void;
    setIndex: (index: number) => void;
}

const NOfEditionsComponent = ({midiaLeitura, isVisibledTable, setImage, setIndex} : NOfEditionsComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [reads, setReads] = useState<(number | number[])[]>([0]);
    const [midiasLeituras, setMidiasLeituras] = useState<IMidiaLeitura[]>([]);

    useEffect(() => {
        const midiaLeituraK = midiaLeitura.key;
        var numerosCurrent: (number | number[])[] = [];

        if (isVisibledTable) {
            const total = midiaLeitura.value.length;
            setMidiasLeituras(midiaLeitura.value);
            setTotal(total);
            midiaLeitura.value.forEach((v, index) => { if(v.owned) numerosCurrent.push(index+1)})
            setNumeros([...numerosCurrent]);
        } else {
            const volume = String(midiaLeituraK?.volume);

            if (volume?.includes('|') || volume?.includes(',')) {
                setTotal(Number(volume.substring(volume.indexOf('|')+2)));

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
                        const indexCurrent = index+1;
                        const contais = numeros.includes(indexCurrent);

                        var conditionColor = '#faad14';
                        if (reads.includes(indexCurrent)) {
                            conditionColor = '#52c41a';
                        } else if (contais) {
                            conditionColor = '#1677ff';
                        }

                        return <>
                            <Button
                                key={indexCurrent}
                                type="link"
                                size="large"
                                icon={contais ? <FireFilled /> : indexCurrent}
                                onClick={() => {
                                    setImage(midiasLeituras[index]?.img);
                                    setIndex(indexCurrent);
                                }}
                                style={{ color: conditionColor }} />
                        </>
                    })
                }
            </Space>
        </Space>
    );
}