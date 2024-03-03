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
import { IconFlagCountries } from "../Icon";

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

    const isMoreLanguage = (language: any) => {
        return (language?.split(', ')?.length??0) > 0;
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
                avatar={<Avatar src={IconFlagCountries(countries(midia))} />}
                title={title(midia)}
                description={year(midia)}
            />
            <Row>
                <Col span={24}>
                    {publisher(midia) && <Tag key={`${midia.key?.id}_tag_publisher`} className="tags">{publisher(midia)}</Tag>}
                    {
                        isMoreLanguage(language(midia))
                        && language(midia)?.split(', ').map((l: any) => <Tag key={`${l}_tag_language`} className="tags">{l}</Tag>) 
                    }
                    {
                        (!isMoreLanguage(language(midia)) && midia?.value?.length === 1)
                        && <Tag key={`${midia.key?.id}_tag_language`} className="tags">{language(midia)}</Tag>
                    }
                </Col>
                {
                    isMidiaKV(midia) &&
                    <Col span={18}>
                        <Space wrap>
                            {midia?.value?.map((midiaV: any) => {
                                const phase = midiaV?.key?.phase;
                                if (phase !== undefined) {
                                    return <Tag key={phase} className="tags">{phase}</Tag>
                                }
                                return <></>
                            })}
                        </Space>
                    </Col>
                }
            </Row>
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