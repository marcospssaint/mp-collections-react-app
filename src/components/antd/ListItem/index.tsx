import './styles.css';

import Meta from "antd/es/card/Meta";

import {
    DownloadOutlined
} from '@ant-design/icons';
import { Image } from '..';

import { Avatar, Card, List, Space } from "antd";
import { IMidia } from "../../../entities";
import { ANIMES, VIDEO } from '../../../entities/midia-video';
import { TYPE_F_GENRE, isFilterByType } from '../../../entities/midia';

interface ListItemProps {
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

export const ListItem = ({ id, midia, read, inProcess, watched, notStarted, owned, children, handlerClick }: ListItemProps) => {
    return (
        <List.Item className="list-item" key={`${id}_listitem`} onClick={handlerClick}>
            <CardListItem
                id={id}
                midia={midia}
                read={read}
                inProcess={inProcess}
                watched={watched}
                notStarted={notStarted}
                owned={owned}
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
    children?: React.ReactNode;
}

const CardListItem = ({ id, midia, read, inProcess, watched, notStarted, owned, children }: CardListItemProps) => {

    const image = midia.img;
    let imageModified = image?.slice(1, -1);

    const imageMultipleArr = image?.split('", "') ?? [];
    const isFilterByAdult = isFilterByType('Adult', midia, TYPE_F_GENRE);

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
                    <Image 
                        src={imageModified}
                        prefixCls={`${isFilterByAdult ? 'image-adult' : ''}`}
                        height={270} />

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
                title={midia.collectionTitle ? midia.subtitle : midia.title}
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
    return <div className="bottom-right">
        <Space direction="vertical">
            <Space wrap>
                <>
                    {
                        (midia.typeMidia === VIDEO && notStarted && watched && !inProcess) &&
                        <Avatar
                            size={30}
                            style={{ backgroundColor: '#faad14' }}
                        />
                    }
                    {
                        (midia.typeMidia === VIDEO && inProcess) &&
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
    </div>;
}