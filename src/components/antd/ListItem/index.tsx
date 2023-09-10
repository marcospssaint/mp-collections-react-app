import './styles.css';

import Meta from "antd/es/card/Meta";

import {
    DownloadOutlined,
    FileAddOutlined,
    FileDoneOutlined,
    QuestionOutlined,
    VideoCameraAddOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { Image } from '..';

import { Avatar, Card, List, Space } from "antd";
import { IMidia } from "../../../entities";
import { LEITURA } from '../../../entities/midia-leitura';
import { ANIMES, VIDEO } from '../../../entities/midia-video';

interface ListItemProps {
    id: number;
    midia: IMidia;
    read?: boolean;
    watched?: boolean;
    owned?: boolean;
    children?: React.ReactNode;
    handlerClick: () => void;
}

export const ListItem = ({ id, midia, read, watched, owned, children, handlerClick }: ListItemProps) => {
    return (
        <List.Item className="list-item" key={`${id}_listitem`} onClick={handlerClick}>
            <CardListItem
                id={id}
                midia={midia}
                read={read}
                watched={watched}
                owned={owned}
                children={children} />
        </List.Item>
    )
};

interface CardListItemProps {
    id: number;
    midia: IMidia;
    read?: boolean;
    watched?: boolean;
    owned?: boolean;
    children?: React.ReactNode;
}

const CardListItem = ({ id, midia, read, watched, owned, children }: CardListItemProps) => {

    const image = midia.img;
    let imageModified = image?.slice(1, -1);

    const imageMultipleArr = image?.split('", "') ?? [];

    if (imageMultipleArr?.length > 1) {
        if (!!midia.collection) {
            imageModified = image?.split('", "')[0]?.slice(1);
        } else {
            imageModified = image?.split('", "')[1]?.slice(0, -1);
        }
    }

    const description = (midia: IMidia) => {
        if (midia.typeMidiaVideo === ANIMES) {
            return '';
        }
        return midia.year;
    }

    return (
        <Card hoverable
            key={`${id}_card`}
            style={{ height: 330 }}
            cover={<>
                <div className='container'>

                    <Image src={imageModified} height={270} />

                    <IconsComponent
                        midia={midia}
                        read={read}
                        watched={watched}
                        owned={owned}
                    />
                </div>
            </>}>
            <Meta
                title={midia.collectionTitle ? midia.subtitle : midia.title}
                description={description(midia)} />
            {children}
        </Card>
    )
}



interface IconsComponentProps {
    midia: IMidia;
    read?: boolean;
    watched?: boolean;
    owned?: boolean;
}

const IconsComponent = ({ midia, read, watched, owned }: IconsComponentProps) => {
    return <div className="bottom-right">
        <Space direction="vertical">
            <Space wrap>
                {
                    midia.typeMidia === LEITURA &&
                    <>
                        <Avatar
                            size={30}
                            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                            icon={
                                read ? <FileDoneOutlined style={{ color: 'black' }} /> : <QuestionOutlined style={{ color: 'black' }} />
                            } />

                        <Avatar
                            size={30}
                            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                            icon={
                                owned ? <DownloadOutlined style={{ color: 'black' }} /> : <FileAddOutlined style={{ color: 'black' }} />
                            } />
                    </>
                }
                {
                    midia.typeMidia === VIDEO &&
                    <>
                        <Avatar
                            size={30}
                            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                            icon={
                                watched ? <VideoCameraOutlined style={{ color: 'black' }} /> : <QuestionOutlined style={{ color: 'black' }} />
                            } />

                        <Avatar
                            size={30}
                            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                            icon={
                                owned ? <DownloadOutlined style={{ color: 'black' }} /> : <VideoCameraAddOutlined style={{ color: 'black' }} />
                            } />
                    </>
                }
            </Space>
        </Space>
    </div>;
}