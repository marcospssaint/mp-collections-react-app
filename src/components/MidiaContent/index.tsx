
import { Avatar, Breadcrumb, Col, Descriptions, Divider, Image, Row, Tag } from "antd";

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { IMidiaKV, TYPE_F_READ, TYPE_F_WATCHED, isFilterIMidiaSingleSelect, isFilterSingleSelect, titleByMidia } from "../../entities/midia";

import { Typography } from 'antd';
import { isNotNullStr } from "../../utils/utils";
import { MidiaVideoContent } from "../MidiaVideoContent";
import { MOVIES, VIDEO } from "../../entities/midia-video";

export const MidiaContent = () => {
    let { id } = useParams();
    const { state } = useLocation();

    const pageTopRef = useRef<HTMLDivElement>(null);

    const [midia, setMidia] = useState({} as IMidiaKV);

    useEffect(() => {
        pageTopRef.current?.scrollIntoView();
    });

    useEffect(() => {
        const midiaKV = state ?? {} as IMidiaKV;
        setMidia(midiaKV);
    }, [id, state]);

    const isVisibleMidiaVideo = () => {
        if (midia?.key?.typeMidia === VIDEO) {
            return midia?.key?.typeMidiaVideo !== MOVIES;
        }
        return false;
    }

    const image = () => {
        let imageModified;
        const img = midia?.key?.img;
        if (img !== null || img !== undefined) {
            imageModified = img?.slice(1, -1);

            const imageMultipleArr = img?.split('", "') ?? [];
            if (imageMultipleArr?.length > 1) {
                imageModified = img?.split('", "')[1]?.slice(0, -1);
            }
        }
        return imageModified;
    }

    const title = () => {
        return midia?.key?.title;
    }

    const originalTitle = () => {
        return midia?.key?.originalTitle;
    }

    const year = () => {
        return midia?.key?.year;
    }

    const synopsis = () => {
        return midia?.key?.synopsis;
    }

    const genres = () => {
        var options = [''];
        const genres = midia?.key?.genre;

        genres?.split(', ').forEach((c) => options.push(c));

        const optionsSets = [...new Set(options)];
        return optionsSets
            .filter((p) => p !== undefined && p !== '')
            .sort((a, b) => (a ?? '').localeCompare(b ?? ''));
    }

    const countries = () => {
        return midia?.key?.countries?.replaceAll(',', ' · ');
    }

    const directors = () => {
        const directors = midia?.key?.cast?.replaceAll(',', ' · ')
            .split('*');

        return directors?.at(0)?.replaceAll('<<>>', '')
            .replaceAll('<>', '');
    }

    const stars = () => {
        const stars = midia?.key?.cast?.replaceAll(',', ' · ')
            .split('*');

        return stars?.at(1)?.replaceAll('*', '');
    }

    const WatchedOrRead = () => {
        let backgroundColor = '';
        const watched = isFilterSingleSelect('W', midia, TYPE_F_WATCHED);
        const notStarted = isFilterSingleSelect('NOTW', midia, TYPE_F_WATCHED);
        const read = isFilterIMidiaSingleSelect('R', midia.key, TYPE_F_READ);

        if (midia?.key?.typeMidia === VIDEO && notStarted && !!watched) {
            backgroundColor = '#faad14';
        } else if (!!read || !!watched) {
            backgroundColor = '#52c41a';
        }

        return <Avatar
            size={20}
            style={{ backgroundColor: backgroundColor }}
        />
    }

    const Owned = () => {
        const backgroundColor = !!midia?.key?.owned ? '#faad14' : '';
        return <Avatar
            size={20}
            style={{ backgroundColor: backgroundColor }}
        />
    }

    return (
        <Row ref={pageTopRef}>
            <Breadcrumb
                items={[
                    {
                        title: <NavLink to={-1 as any}>{titleByMidia(midia)}</NavLink>
                    },
                    {
                        title: title(),
                    },
                ]}
            />
            <Row className='responsive-two-columns'>
                <Col style={{ marginTop: 40 }}>
                    <Image src={image()} height={440} />
                    {
                        !isVisibleMidiaVideo() &&
                        <Row>
                            <Divider orientation="left">Control</Divider>
                            <Descriptions>
                                <Descriptions.Item label="Watched">
                                    <WatchedOrRead />
                                </Descriptions.Item>
                                <Descriptions.Item label="Owned">
                                    <Owned/>
                                </Descriptions.Item>
                            </Descriptions>
                        </Row>
                    }
                </Col>

                <Col style={{ maxWidth: 1000 }}>
                    <Row>
                        <Typography.Title level={2} style={{ fontFamily: '"Source Sans Pro",Arial,sans-serif' }}>{title()}</Typography.Title>
                    </Row>

                    <Divider orientation="left">Details</Divider>

                    {
                        !isVisibleMidiaVideo() &&
                        <>
                            <Row>
                                <Descriptions>
                                    <Descriptions.Item label="Original title">
                                        {originalTitle()}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                            <Row>
                                <Descriptions>
                                    <Descriptions.Item label="Year">
                                        {year()}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                        </>
                    }

                    {
                        isNotNullStr(countries()) &&
                        <Row>
                            <Descriptions style={{ margin: 0 }}>
                                <Descriptions.Item label="Countries of origin">
                                    {countries()}
                                </Descriptions.Item>
                            </Descriptions>
                            <Divider style={{ margin: 0 }} />
                        </Row>
                    }

                    <Row>
                        <Descriptions>
                            <Descriptions.Item label="Genres" span={23}>
                                <div>
                                    {genres().map((item) => <Tag key={item} className="checkable-tag">{item}</Tag>)}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Row>

                    {
                        !isVisibleMidiaVideo() &&
                        <Row>
                            <Divider orientation="left">Synopsis</Divider>
                            <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} style={{ textAlign: 'justify' }}>
                                {synopsis()}
                            </Typography.Paragraph>
                        </Row>
                    }

                    {
                        (!isVisibleMidiaVideo() && isNotNullStr(directors())) &&
                        <Row>
                            <Divider orientation="left">Series Cast</Divider>
                            <Descriptions>
                                <Descriptions.Item label="Director" span={23}>
                                    {directors()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Stars" style={{ whiteSpace: 'pre-wrap' }}>
                                    {stars()}
                                </Descriptions.Item>
                            </Descriptions>
                        </Row>
                    }

                    

                </Col>
                <MidiaVideoContent midiaVideo={midia} isVisible={isVisibleMidiaVideo()} />
            </Row>
        </Row>
    );
}