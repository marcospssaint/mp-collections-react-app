import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { useEffect, useState } from "react";

import { Col, Collapse, CollapseProps, Descriptions, Divider, Flex, Modal, Row, Space, Tag, Typography } from "antd";
import { IMidiaVideo, IMidiaVideoKV } from '../../entities';
import { IMidia, TYPE_F_OWNED, isFilterIMidiaSingleSelect } from "../../entities/midia";
import { TYPE_MOVIE, TYPE_OVA } from '../../entities/midia-video';
import { isNotNullStr, range, rangeBySeparator, squash } from "../../utils/utils";

interface MidiaVideoContentPros {
    midiaVideo: IMidiaVideoKV;
    isVisible: boolean;
}

export const MidiaVideoContent = ({ midiaVideo, isVisible }: MidiaVideoContentPros) => {

    const [type, setType] = useState<string[]>([]);
    const [isValidType, setValidType] = useState<boolean>(false);
    const [synopsis, setSynopsis] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const types = squash(midiaVideo?.value?.map((v: any) => v.type));
        if (types !== undefined && types !== null && types[0] !== undefined) {
            setType(types);
            setValidType(true);
        } else {
            setValidType(false);
        }
    }, [midiaVideo?.value]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const isMidiaTypeSeasons = (typeMidiaVideo: string | null | undefined) => {
        return typeMidiaVideo !== TYPE_MOVIE;
    }

    const nOfSeason = () => {
        return midiaVideo?.value?.map((mv) => mv as IMidiaVideo).filter((mv) => isMidiaTypeSeasons(mv?.type)).length;
    }

    const nOfMovie = () => {
        return midiaVideo?.value?.map((mv) => mv as IMidiaVideo).filter((mv) => mv?.type === TYPE_MOVIE).length;
    }

    const nOfEpisodes = () => {
        return midiaVideo?.value?.map((mv) => mv as IMidiaVideo).filter((mv) => isMidiaTypeSeasons(mv?.type))
            .map((md) => md as IMidiaVideo)
            .map(md => md.episodes).map((e) => {
                var episode = String(e);
                if (episode === undefined) {
                    return 0;
                } else if (episode != null && episode.includes('|')) {
                    return Number(episode.substring(episode.indexOf('|') + 2));
                }
                return Number(episode);
            }).reduce((a, c) => {
                if (a != null && c != null) {
                    return a + c;
                }
                return 0;
            }, 0);
    }

    const nOfEpisodesSeason = (md: IMidia) => {
        const midiaVideo = md as IMidiaVideo;

        var episode = String(midiaVideo.episodes);
        if (episode === undefined) {
            return 0;
        } else if (episode != null && episode.includes('|')) {
            return Number(episode.substring(episode.indexOf('|') + 2));
        }
        return Number(episode);
    }

    const genExtra = (md: IMidia) => {
        return <Row style={{ marginTop: 5 }}>
            <Flex wrap="wrap" gap="small" >
                {
                    isFilterIMidiaSingleSelect(true, md, TYPE_F_OWNED) && <DownloadOutlined />
                }
                {
                    isNotNullStr(md.synopsis) && <InfoCircleOutlined
                        onClick={(event) => {
                            setSynopsis(md.synopsis ?? '');
                            showModal();
                            event.stopPropagation();
                        }}
                    />
                }
            </Flex>
        </Row>
    };

    const items: CollapseProps['items'] = midiaVideo?.value?.map((value, index) => {
        const mdVideo = value as IMidiaVideo;
        const nOfEpisodes = nOfEpisodesSeason(mdVideo);

        let title = '';
        if (mdVideo.type === TYPE_MOVIE) {
            title = 'Movie'
        } else if (mdVideo.type === TYPE_OVA) {
            title = 'OVA'
        } else {
            title = `Season ${mdVideo.season}`
        }

        return ({
            key: index + 1 + "",
            label: <div>
                <Typography.Title level={4}
                    className='text-font-beautiful'
                    style={{
                        fontWeight: 700,
                        margin: 0
                    }}>
                    {title}
                </Typography.Title>

                <Typography.Title level={4}
                    className='text-font-beautiful'
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        margin: 0
                    }}>
                    {mdVideo.year} {mdVideo.type !== TYPE_MOVIE ? `· ${nOfEpisodes} Episodes` : ''}
                </Typography.Title>
                <Typography.Title level={4}
                    className='text-font-beautiful'
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        margin: 0
                    }}>
                    {mdVideo.originalTitle}
                </Typography.Title>
            </div>,
            children: <NOfEpisodesWatchedComponent midiaVideo={mdVideo} />,
            extra: genExtra(mdVideo),
        })
    });

    return <>
        {
            isVisible && <Col>
                <Row>
                    {
                        isValidType &&
                        <Row>
                            <Divider style={{ margin: 0 }} />
                            <Descriptions>
                                <Descriptions.Item label="Types" span={23}>
                                    <div>
                                        {type?.map((item) => <Tag key={item} className="tags">{item}</Tag>)}
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Row>
                    }

                    <Row>
                        <Divider style={{ margin: 0 }} />
                        <Descriptions style={{ margin: 0 }}>
                            <Descriptions.Item label="No. of seasons">
                                {nOfSeason()}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider style={{ margin: 0 }} />
                    </Row>

                    <Row>
                        <Descriptions style={{ margin: 0 }}>
                            <Descriptions.Item label="No. of episodes">
                                {nOfEpisodes()}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider style={{ margin: 0 }} />
                    </Row>

                    <Row>
                        <Divider style={{ margin: 0 }} />
                        <Descriptions style={{ margin: 0 }}>
                            <Descriptions.Item label="No. of movies">
                                {nOfMovie()}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider style={{ margin: 0 }} />
                    </Row>

                    <Collapse
                        accordion
                        defaultActiveKey={['1']}
                        expandIconPosition="end"
                        size="large"
                        style={{ width: '100%' }}
                        items={items} />
                </Row>

                <Modal
                    title="Synopsis"
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
            </Col>
        }
    </>
}

interface NOfEpisodesWatchedComponentProps {
    midiaVideo: IMidiaVideo | undefined;
}

const NOfEpisodesWatchedComponent = ({ midiaVideo }: NOfEpisodesWatchedComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [watched, setWatched] = useState<(number | number[])[]>([0]);

    useEffect(() => {
        if (midiaVideo !== undefined) {
            var numerosCurrent: (number | number[])[] = [];
            const episodes = String(midiaVideo?.episodes);

            if (episodes?.includes('|') || episodes?.includes(',')) {
                setTotal(Number(episodes.substring(episodes.indexOf('|') + 2)));

                var episodesSubstr = episodes.substring(0, episodes.indexOf('|')); //'1-5, 6-7, 9';
                var episodesSplit = episodesSubstr.split(',');
                episodesSplit.forEach((e) => numerosCurrent.push(...rangeBySeparator(String(e), '-')));
                setNumeros([...numerosCurrent]);
            } else {
                const total = Number(episodes);
                setTotal(total);
                setNumeros([...range(1, total)]);
            }

            if (midiaVideo?.watchedEpisodes !== undefined) {
                setWatched([...range(0, midiaVideo?.watchedEpisodes)]);
            } else {
                setWatched([0]);
            }
        }
    }, [midiaVideo, midiaVideo?.episodes, midiaVideo?.watchedEpisodes]);

    return (
        <Space direction="vertical">
            <Space wrap>
                {
                    [...Array(total).keys()].map((index) => {
                        const indexCurrent = index + 1;
                        const contais = numeros.includes(indexCurrent);

                        var conditionColor = '#faad14';
                        if (watched.includes(indexCurrent)) {
                            conditionColor = '#52c41a';
                        } else if (contais) {
                            conditionColor = '#1677ff';
                        }

                        return <>
                            <Tag
                                key={indexCurrent}
                                className="tags"
                                color={conditionColor}>
                                {indexCurrent}
                            </Tag>
                        </>
                    })
                }
            </Space>
        </Space>
    );
}