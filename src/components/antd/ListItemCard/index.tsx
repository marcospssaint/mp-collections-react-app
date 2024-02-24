import './styles.css';

import Meta from "antd/es/card/Meta";

import {
    DownloadOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { Image } from '..';

import { Avatar, Card, List, Modal, Row, Space, Typography } from "antd";
import { useState } from 'react';
import { IMidia } from "../../../entities";
import { TYPE_F_GENRE, isFiltersByType } from '../../../entities/midia';
import { VIDEO } from '../../../entities/midia-video';

interface ListItemCardProps {
    id: number;
    midia: IMidia;
    read?: boolean;
    inProcess?: boolean;
    watched?: boolean;
    notStarted?: boolean;
    owned?: boolean;
    children?: React.ReactNode;
    handlerClick: () => void;
}

export const ListItemCard = ({ id, midia, read, inProcess, watched, notStarted, owned, children, handlerClick }: ListItemCardProps) => {
    return (
        <List.Item className="list-item" key={`${id}_listitem`}>
            <CardListItem
                id={id}
                midia={midia}
                read={read}
                inProcess={inProcess}
                watched={watched}
                notStarted={notStarted}
                owned={owned}
                handlerClick={handlerClick}
                children={children} />
        </List.Item>
    )
};

interface CardListItemProps {
    id: number;
    midia: IMidia;
    read?: boolean;
    inProcess?: boolean;
    watched?: boolean;
    notStarted?: boolean;
    owned?: boolean;
    handlerClick: () => void;
    children?: React.ReactNode;
}

const CardListItem = ({ id, midia, read, inProcess, watched, notStarted, owned, handlerClick, children }: CardListItemProps) => {

    const image = midia?.img;
    let imageModified = image?.slice(1, -1);

    const imageMultipleArr = image?.split('", "') ?? [];
    const isFilterBy18Years = isFiltersByType(['Adult', 'Erotic'], midia, TYPE_F_GENRE);

    if (imageMultipleArr?.length > 1) {
        if (!!midia?.collection) {
            imageModified = image?.split('", "')[0]?.slice(1);
        } else {
            imageModified = image?.split('", "')[1]?.slice(0, -1);
        }
    }

    const description = (midia: IMidia) => {
        return midia?.year;
    }

    return (
        <Card hoverable
            key={`${id}_card`}
            style={{ height: 360, width: '95%' }}
            cover={<>
                <div className='container'>
                    <Image
                        src={imageModified}
                        prefixCls={`${isFilterBy18Years ? 'image-adult' : ''}`}
                        height={280}
                        handlerClick={handlerClick} />

                    <IconsComponent
                        midia={midia}
                        read={read}
                        inProcess={inProcess}
                        watched={watched}
                        notStarted={notStarted}
                        owned={owned}
                    />
                </div>
            </>}>
            <Meta
                title={midia?.collectionTitle ? midia?.subtitle : midia?.title}
                description={description(midia)} />
            {children}
        </Card>
    )
}

interface IconsComponentProps {
    midia: IMidia;
    read?: boolean;
    inProcess?: boolean;
    watched?: boolean;
    notStarted?: boolean;
    owned?: boolean;
}

const IconsComponent = ({ midia, read, inProcess, watched, notStarted, owned }: IconsComponentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [synopsis, setSynopsis] = useState<string>('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    return <>
        <div className="bottom-left">
            <Space direction="vertical">
                <Space wrap>
                    <>
                        {
                            (midia?.typeMidia === VIDEO && notStarted && watched && !inProcess) &&
                            <Avatar
                                size={30}
                                style={{ backgroundColor: '#faad14' }}
                            />
                        }
                        {
                            (midia?.typeMidia === VIDEO && inProcess) &&
                            <Avatar
                                size={30}
                                style={{ backgroundColor: '#1677ff' }}
                            />
                        }
                        {
                            ((read || watched) && !inProcess) &&
                            <Avatar
                                size={30}
                                style={{ backgroundColor: '#52c41a' }}
                            />
                        }

                        {
                            owned &&
                            <Avatar
                                size={30}
                                style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                                icon={<DownloadOutlined style={{ color: 'black' }} />} />
                        }
                    </>
                </Space>
            </Space>
        </div>
        <div className="bottom-right">
            <Space direction="vertical">
                <Space wrap>
                    <>
                        {
                            !!midia?.synopsis &&
                            <Avatar
                                size={30}
                                style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                                icon={<InfoCircleOutlined
                                    style={{ color: 'black' }}
                                    onClick={(event) => {
                                        setSynopsis(midia?.synopsis ?? '');
                                        showModal();
                                        event.stopPropagation();
                                    }}
                                />} />
                        }
                    </>
                </Space>
            </Space>
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
        </div>
    </>
}