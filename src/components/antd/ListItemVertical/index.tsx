import { Avatar, Col, List, Modal, Row, Space, Tag, Typography } from "antd";
import {
    DownloadOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

import React, { useState } from 'react';

import { Image } from '../Image';

import { IMidiaLeitura } from '../../../entities';

import { instanceOfKV } from '../../../entities/midia-leitura';
import { isNotNullStr } from "../../../utils/utils";

import { TYPE_F_GENRE, TYPE_F_OWNED, TYPE_F_READ, isFilterMultipleSelect, isFiltersByType } from "../../../entities/midia";

interface ListItemVerticalProps {
    id: number;
    midia: any;
    read?: boolean;
    inProcess?: boolean;
    watched?: boolean;
    notStarted?: boolean;
    owned?: boolean;
    children?: React.ReactNode;
    handlerClick: () => void;
}

export const ListItemVertical = ({ id, midia, read, inProcess, watched, notStarted, owned, children, handlerClick }: ListItemVerticalProps) => {

    const isMidiaKV = (midia: any) => {
        if (midia?.key !== undefined) {
            return midia?.value?.some((v: any) => v !== undefined && instanceOfKV(v)) ?? false;
        }
        return false;
    }

    const title = (midia: any) => {
        const title = midia?.key?.title;
        if (title === undefined) {
            return (midia as IMidiaLeitura)?.title;
        }
        return title;
    }

    const year = (midia: any) => {
        const year = midia?.key?.year;
        if (year === undefined) {
            return (midia as IMidiaLeitura)?.year;
        }
        return year;
    }

    const publisher = (midia: any) => {
        const publisher = midia?.key?.publisher;
        if (publisher === undefined) {
            return (midia as IMidiaLeitura)?.publisher;
        }
        return publisher;
    }

    const language = (midia: any) => {
        const language = midia?.key?.language;
        if (language === undefined) {
            return (midia as IMidiaLeitura)?.language;
        }
        return language;
    }

    const countries = (midia: any) => {
        const countries = midia?.key?.countries;
        if (countries === undefined) {
            return (midia as IMidiaLeitura)?.countries;
        }
        return countries;
    }

    const synopsis = (midia: any) => {
        const synopsis = midia?.key?.synopsis;
        if (synopsis === undefined) {
            return (midia as IMidiaLeitura)?.synopsis;
        }
        return synopsis;
    }

    const isFilterBy18Years = () => isFiltersByType(['Adult', 'Erotic'], midia, TYPE_F_GENRE);

    const actions = (midia: any) => {
        let listActions: any[] = [];

        if (isNotNullStr(synopsis(midia))) {
            listActions.push(
                <SynopsisActionsComponent
                    key={`${midia.key?.id}_listitemactions`}
                    midia={midia}
                />
            );
        }

        listActions.push(
            <ReadActionsComponent
                key={`${midia.key?.id}_readactions`}
                midia={midia} />
        );

        if (isFilterMultipleSelect([true], midia, TYPE_F_OWNED)) {
            listActions.push(
                <OwnedActionsComponent key={`${midia.key?.id}_ownedactions`} />
            );
        }

        return listActions;
    }

    return (
        <List.Item
            key={`${midia.key?.id}_listitem`}
            actions={actions(midia)}
            extra={
                <Image
                    src={getImage(midia)}
                    prefixCls={`${isFilterBy18Years() ? 'image-adult' : ''}`}
                    height={160}
                    witdh={120}
                    handlerClick={handlerClick} />
            }
            className="list-item" >
            <List.Item.Meta
                avatar={<Avatar src={getIconFlag(countries(midia))} />}
                title={title(midia)}
                description={year(midia)}
            />
            <Space>
                <Tag key={`${midia.key?.id}_tag_publisher`} className="tags">{publisher(midia)}</Tag>
                {language(midia) && <Tag key={`${midia.key?.id}_tag_language`} className="tags">{language(midia)}</Tag>}
                {
                    isMidiaKV(midia) && <>
                        <Col span={24}>
                            <Space>
                                {midia?.value?.map((midiaV: any) => {
                                    const phase = midiaV?.key?.phase;
                                    if (phase !== undefined) {
                                        return <Tag key={phase} className="tags">{phase}</Tag>
                                    }
                                    return <></>
                                })}
                            </Space>
                        </Col>
                    </>
                }
            </Space>
        </List.Item>
    );
}


interface IconsComponentProps {
    midia: any;
}

const ReadActionsComponent = ({ midia }: IconsComponentProps) => {
    return <>{
        <Avatar
            size={20}
            style={{ backgroundColor: isFilterMultipleSelect(['R'], midia, TYPE_F_READ) ? '#52c41a' : '' }}
        />
    }</>
}

const OwnedActionsComponent = () => {
    return <>{
        <Avatar
            size={30}
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            icon={<DownloadOutlined style={{ color: 'black' }} />} />
    }</>
}

const SynopsisActionsComponent = ({ midia }: IconsComponentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [synopsis, setSynopsis] = useState<string>();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const synopsisMidia = () => {
        const synopsis = midia?.key?.synopsis;
        if (synopsis === undefined) {
            return (midia as IMidiaLeitura)?.synopsis;
        }
        return synopsis;
    }

    return <>
        {
            isNotNullStr(synopsisMidia()) &&
            <Space>
                <Space wrap>
                    <Avatar
                        size={30}
                        style={{ backgroundColor: 'rgb(255, 255, 255)', }}
                        icon={<InfoCircleOutlined
                            style={{ color: 'black' }}
                            onClick={(event) => {
                                if (!!synopsisMidia()) {
                                    setSynopsis(synopsisMidia() ?? '');
                                    showModal();
                                }
                                event.stopPropagation();
                            }}
                            disabled={true}
                        />}
                    />
                </Space>
            </Space>
        }
        <Modal
            title={
                <>
                    <Typography.Title level={4}
                        className='text-font-beautiful'
                        style={{
                            fontWeight: 700,
                            margin: 0
                        }}>
                        {midia?.title}
                    </Typography.Title>

                    <Typography.Title level={4}
                        className='text-font-beautiful'
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            margin: 0
                        }}>
                        Synopsis
                    </Typography.Title>
                </>
            }
            centered
            closable={true}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[]}
            children={
                <Row style={{ padding: 15 }}>
                    <Typography.Paragraph style={{ textAlign: 'justify' }}>
                        {synopsis}
                    </Typography.Paragraph>
                </Row>
            } />
    </>
}

const getIconFlag = (countries: string | undefined) => {
    const path = process.env.PUBLIC_URL;

    if (countries !== undefined) {
        let imageFlag;
        switch (countries) {
            case 'Argentina': imageFlag = 'flag-of-argentina.png'; break;
            case 'Belgium': imageFlag = 'flag-of-belgium.png'; break;
            case 'Brazil': imageFlag = 'flag-of-brazil.png'; break;
            case 'China': imageFlag = 'flag-of-china.png'; break;
            case 'France': imageFlag = 'flag-of-france.png'; break;
            case 'Germany': imageFlag = 'flag-of-germany.png'; break;
            case 'Italy': imageFlag = 'flag-of-italian.png'; break;
            case 'Japan': imageFlag = 'flag-of-japan.png'; break;
            case 'Philippines': imageFlag = 'flag-of-philippines.png'; break;
            case 'Singapore': imageFlag = 'flag-of-singapore.png'; break;
            case 'South Korea': imageFlag = 'flag-of-south-korea.png'; break;
            case 'Spain': imageFlag = 'flag-of-spain.png'; break;
            case 'USA': imageFlag = 'flag-of-usa.png'; break;
            default: imageFlag = '';
        }

        return path + '/imagens/flags/' + imageFlag;
    }
    return '';
}

const getImage = (midia: any) => {
    let image;
    if (midia !== undefined) {
        image = midia.key?.img;

        if (image === undefined && midia?.value !== undefined) {
            image = (midia.value[0] as IMidiaLeitura)?.img;
        } else if (image === undefined) {
            image = (midia as IMidiaLeitura)?.img;
        }

        return image?.slice(1, -1)
    }
    return image;
}