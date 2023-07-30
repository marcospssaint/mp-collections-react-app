import './styles.css';

import Meta from "antd/es/card/Meta";

import { Image } from '..';

import { Card, List } from "antd";
import { IMidia } from "../../../entities";

interface ListItemProps {
    id: number;
    midia: IMidia;
    children?: React.ReactNode;
    handlerClick: () => void;
}

export const ListItem = ({ id, midia, children, handlerClick }: ListItemProps) => {
    return (
        <List.Item className="list-item" key={`${id}_listitem`} onClick={handlerClick}>    
            <CardListItem
                id={id}
                midia={midia}
                children={children} />
        </List.Item>
    )
};

interface CardListItemProps {
    id: number;
    midia: IMidia;
    children?: React.ReactNode;
}

const CardListItem = ({ id, midia, children }: CardListItemProps) => {
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

    return (
        <Card hoverable
            key={`${id}_card`}
            style={{height: 330 }}
            cover={<Image src={imageModified} height={270} />}>
                <Meta title={midia.collectionTitle ? midia.subtitle : midia.title} description={midia.year} />
            {children}
        </Card>
    )
}