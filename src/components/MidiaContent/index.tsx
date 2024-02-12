
import { Breadcrumb, Col, Descriptions, Divider, Image, Row, Tag } from "antd";

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { IMidiaKV, TYPE_F_READ, TYPE_F_WATCHED, isFilterIMidiaSingleSelect, isFilterSingleSelect, titleByMidia } from "../../entities/midia";

import { Typography } from 'antd';
import { MOVIES, VIDEO } from "../../entities/midia-video";
import { isNotNullStr } from "../../utils/utils";
import { MidiaVideoContent } from "../MidiaVideoContent";
import { LEITURA, nOfEditions } from "../../entities/midia-leitura";
import { MidiaLeituraContent } from "../MidiaLeituraContent";

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

    const isMidiaLeitura = () => {
        return midia?.key?.typeMidia === LEITURA;
    }

    const isVisibleMidiaLeitura = () => {
        return isMidiaLeitura() && nOfEditions(midia?.key) > 1;
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

    const subtitle = () => {
        return midia?.key?.subtitle;
    }

    const year = () => {
        return midia?.key?.year;
    }

    const synopsis = () => {
        return midia?.key?.synopsis;
    }

    const notes = () => {
        return midia?.key?.notes;
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

    const publisher = () => {
        return midia?.key?.publisher;
    }

    const language = () => {
        return midia?.key?.language;
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

        return stars?.at(1)?.replaceAll('*', '') ?? '-';
    }

    const authors = () => {
        return midia?.key?.authors;
    }

    const writes = () => {
        const writes = authors()?.replaceAll(',', ' · ')
            .split('*');

        return writes?.at(0)?.replaceAll('<<!>>', '')
            .replaceAll('<<>>', '')
            .replaceAll('<>', '');
    }

    const percilers = () => {
        const percilers = authors()?.replaceAll(',', ' · ')
            .split('*');

        return percilers?.at(1)?.replaceAll('*', '') ?? '-';
    }

    const watchedOrRead = () => {
        const watched = isFilterSingleSelect('W', midia, TYPE_F_WATCHED);
        const read = isFilterIMidiaSingleSelect('R', midia.key, TYPE_F_READ);
        return (!!read || !!watched) ? 'YES' : 'NO';
    }

    const owned = () => {
        return !!midia?.key?.owned ? 'YES' : 'NO';
    }

    return (<>
        <Row>
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
        </Row>
        <Row ref={pageTopRef}>
            <Row className='responsive-two-columns'>
                <Col>
                    <Row>
                        <Typography.Title level={2}
                            className="text-font-beautiful"
                            style={{ margin: 0 }}>{title()}</Typography.Title>
                    </Row>
                    <Image src={image()} height={440} />
                </Col>

                <Col style={{ maxWidth: 1000 }}>
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
                                    <Descriptions.Item label="Also Known As (AKA)">
                                        {subtitle()}
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
                                    {genres().map((item) => <Tag key={item} className="tags">{item}</Tag>)}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Row>
                    {
                        isMidiaLeitura() &&
                        <>
                            <Row>
                                <Divider style={{ margin: 0 }} />
                                <Descriptions style={{ margin: 0 }}>
                                    <Descriptions.Item label="Publisher">
                                        {publisher()}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                            <Row>
                                <Divider style={{ margin: 0 }} />
                                <Descriptions style={{ margin: 0 }}>
                                    <Descriptions.Item label="Language">
                                        <Tag key={language()} className="tags">{language()}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                        </>
                    }

                    {
                        !isVisibleMidiaVideo() &&
                        <Row>
                            <Divider orientation="left">Synopsis</Divider>
                            <Typography.Paragraph style={{ textAlign: 'justify' }}>
                                {synopsis()}
                            </Typography.Paragraph>
                        </Row>
                    }

                    {
                        (!isVisibleMidiaVideo() && isNotNullStr(notes())) &&
                        <Row>
                            <Divider orientation="left">Notes</Divider>
                            <Typography.Paragraph style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                                {notes()}
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
                    {
                        (isMidiaLeitura() && isNotNullStr(authors())) &&
                        <Row>
                            <Divider orientation="left">Authors</Divider>
                            <Descriptions>
                                <Descriptions.Item label="Write" span={23}>
                                    {writes()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Perciler" style={{ whiteSpace: 'pre-wrap' }}>
                                    {percilers()}
                                </Descriptions.Item>
                            </Descriptions>
                        </Row>
                    }
                    {
                        !isVisibleMidiaVideo() &&
                        <Row>
                            <Divider orientation="left">Control</Divider>
                            <Row>
                                <Descriptions>
                                    <Descriptions.Item label={isMidiaLeitura() ? 'Read' : 'Watched'}>
                                        {watchedOrRead()}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                            <Row>
                                <Descriptions>
                                    <Descriptions.Item label="Owned">
                                        {owned()}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: 0 }} />
                            </Row>
                        </Row>
                    }

                    <MidiaVideoContent midiaVideo={midia} isVisible={isVisibleMidiaVideo()} />
                </Col>
                <MidiaLeituraContent midiaLeitura={midia} isVisible={isVisibleMidiaLeitura()} />
            </Row>
        </Row>
    </>);
}