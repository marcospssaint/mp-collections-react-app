import { useEffect, useState } from "react";

import { FireFilled } from '@ant-design/icons';

import { Badge, Button, Col, Descriptions, Space, Typography } from "antd";
import { Modal, Tag } from "../antd";

import { IMidiaLeitura, IMidiaLeituraKV } from '../../entities';
import { isNotNull } from "../../utils";

import Table, { ColumnsType } from "antd/es/table";
import { isNotNullArray, range, rangeBySeparator } from "../../utils/utils";
import { Key } from "antd/es/table/interface";

interface ModalMidiaLeituraPros {
    midiaLeitura: IMidiaLeituraKV | any;
    isModalOpen: boolean;
    hideModal: () => void;
}

export const ModalMidiaLeitura = ({ midiaLeitura, isModalOpen, hideModal, }: ModalMidiaLeituraPros) => {
    const midiaLeituraK = midiaLeitura.key;
    const midiaLeituraV = midiaLeitura.value as IMidiaLeitura[];

    const [midiaLeituraSelected, setMidiaLeituraSelected] = useState<IMidiaLeitura>();
    const [image, setImage] = useState<string | undefined | null>();
    const [genres, setGenres] = useState<(string | undefined)[]>();
    const [countries, setCountries] = useState<(string | undefined)[]>();
    const [isVisibledTable, setVisibledTable] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

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
        setCountries(midiaLeituraK?.countries?.split(','))

        if (isNotNullArrayMidiaV) {
            setSelectedRowKeys([midiaLeituraV[0]?.id])
            setMidiaLeituraSelected(midiaLeituraV[0]);
            setImage(midiaLeituraV[0]?.img);
        }
    }, [midiaLeituraK, midiaLeituraV]);

    const authors = (author?: string) => {
        return author?.replaceAll(',', ' · ')
            .replaceAll('<<!>>', 'Write/Perciler: ')
            .replaceAll('<<>>', 'Writes: ')
            .replaceAll('<*>', 'Pencilers: ')
            .replaceAll('<>', 'Write: ')
            .replaceAll('*', 'Penciler: ');
    }

    const nOfEditions = (editionsOriginal?: string | null | undefined) => {
        const editions = String(editionsOriginal);
        if (editions !== null && editions?.includes(' | ')) {
            return Number(editions.substring(editions.indexOf('|') + 2));
        }

        return Number(editions);
    };

    const columns: ColumnsType<IMidiaLeitura> = [
        {
            title: 'Title',
            dataIndex: 'subtitle',
            key: 'subtitle'
        },
        {
            title: 'Original title',
            dataIndex: 'originalTitle',
            key: 'originalTitle'
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

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: IMidiaLeitura[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setMidiaLeituraSelected(selectedRows[0]);
            setImage(selectedRows[0]?.img);
        },
    };

    return (
        <Modal
            key={midiaLeituraK?.id}
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

                            <Descriptions.Item label={`N° of editions (${midiaLeituraV.length})`} span={3}>
                                <NOfEditionsComponent
                                    midiaLeitura={midiaLeitura}
                                    isVisibledTable={isVisibledTable} />
                            </Descriptions.Item>
                        </>
                    }

                    {
                        !isVisibledTable && <Descriptions.Item label="Title" span={3}>{midiaLeituraK?.title}</Descriptions.Item>
                    }

                    {
                        !isVisibledTable &&
                        <>
                            {
                                (isNotNull(midiaLeituraK?.subtitle)) &&
                                <Descriptions.Item label="Subtitle" span={3}>{midiaLeituraK?.subtitle ?? '-'}</Descriptions.Item>
                            }

                            {
                                (isNotNull(midiaLeituraK?.originalTitle)) &&
                                <Descriptions.Item label="Original title" span={3}>{midiaLeituraK?.originalTitle ?? '-'}</Descriptions.Item>
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
                            <Descriptions.Item label={`N° of editions (${nOfEditions(midiaLeituraK?.volume)})`} span={3}>
                                <NOfEditionsComponent
                                    midiaLeitura={midiaLeitura}
                                    isVisibledTable={isVisibledTable} />
                            </Descriptions.Item>
                        </>
                    }

                    <Descriptions.Item label={`${countries?.length??0 > 1 ? 'Countries' : 'Country'} of origin`} span={3}>
                        {countries?.map((country, index) => <Tag color="blue" label={country} key={index} />)}
                    </Descriptions.Item>

                    {
                        isNotNull(midiaLeituraK?.language) &&
                        <Descriptions.Item label="Language" span={3}>
                            <Tag color="blue" label={midiaLeituraK?.language} />
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
                        (isNotNull(midiaLeituraSelected?.synopsis) || !isVisibledTable) &&
                        <Descriptions.Item label="Synopsis" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} style={{ textAlign: 'justify' }}>
                                {isVisibledTable ? midiaLeituraSelected?.synopsis : midiaLeituraK?.synopsis}
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
                                    position: ['topRight'],
                                }}
                                rowSelection={
                                    {
                                        type: "radio",
                                        hideSelectAll: true,
                                        ...rowSelection
                                    }
                                }
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
}

const NOfEditionsComponent = ({ midiaLeitura, isVisibledTable }: NOfEditionsComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [reads, setReads] = useState<(number | number[])[]>([0]);

    useEffect(() => {
        const midiaLeituraK = midiaLeitura.key;
        var numerosCurrent: (number | number[])[] = [];

        if (isVisibledTable) {
            const total = midiaLeitura.value.length;
            setTotal(total);
            midiaLeitura.value.forEach((v, index) => { if (v.owned) numerosCurrent.push(index + 1) })
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
                            <Button
                                key={indexCurrent}
                                type="link"
                                size="large"
                                icon={contais ? <FireFilled /> : indexCurrent}
                                onClick={() => {
                                }}
                                style={{ color: conditionColor }} />
                        </>
                    })
                }
            </Space>
        </Space>
    );
}