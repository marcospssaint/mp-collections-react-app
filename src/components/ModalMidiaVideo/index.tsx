import { useEffect, useState } from "react";

import './styles.css';

import { Badge, Button, Col, Descriptions, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { IMidiaVideoKV } from '../../entities';
import { ANIMES, IMidiaVideo, MOVIES, TV_SHOWS, TYPE_MOVIE, TYPE_OVA, TYPE_TV_SHOW } from "../../entities/midia-video";
import { isNotNull, isNotNullArray, range, rangeBySeparator, squash } from "../../utils/utils";
import { Modal, Tag } from "../antd";

import { FireFilled } from '@ant-design/icons';
import { PresetStatusColorType } from "antd/es/_util/colors";

interface ModalMidiaVideoPros {
    midiaVideo: IMidiaVideoKV | undefined;
    typeMidiaVideo: string;

    isModalOpen: boolean;
    witdhModal?: number;
    imgHeight?: number;
    hideModal: () => void;
}

export const ModalMidiaVideo = ({ midiaVideo, typeMidiaVideo, isModalOpen, witdhModal = 700, imgHeight = 360, hideModal, }: ModalMidiaVideoPros) => {
    const midiaVideoK = midiaVideo?.key;
    const midiaVideoV = midiaVideo?.value;

    const [midiaVideoSelected, setMidiaVideoSelected] = useState<IMidiaVideo>();
    const [type, setType] = useState<(string | undefined)[]>();
    const [genres, setGenres] = useState<(string | undefined)[]>();
    const [isValidType, setValidType] = useState<boolean>(false);
    const [isMovie, setMovie] = useState<boolean>(false);
    const [isTvShow, setTvShow] = useState<boolean>(false);
    const [isAnimeAndTVTK, setAnimeAndTVTK] = useState<boolean>(false);
    const [isVisibledTable, setVisibledTable] = useState<boolean>(false);

    const { Paragraph } = Typography;

    useEffect(() => {
        const types = squash(midiaVideoV?.map((v) => v.type)) ?? [];
        const isValidTypes = isNotNullArray(types) && isNotNull(types[0]);
        if (isValidTypes) {
            setType(types);
    
            setValidType(true);
        } else {
            setValidType(false);
        }

        setGenres(midiaVideoK?.genre?.split(', '));

        const isNotNullArrayMidiaV = isNotNullArray(midiaVideoV);
        const isAnime = typeMidiaVideo === ANIMES;

        if (
            (isAnime && midiaVideoV?.length === 1 && midiaVideoV[0].type === TYPE_MOVIE)
            || typeMidiaVideo === MOVIES
        ) {
            setMovie(true);
            setVisibledTable(midiaVideoV !== undefined && midiaVideoV?.length > 1);
        } else {
            setMovie(false);
            setVisibledTable(isNotNullArrayMidiaV);
        }

        setAnimeAndTVTK(types.length > 1 && isNotNullArrayMidiaV);
        setTvShow(typeMidiaVideo === TV_SHOWS);
        setMidiaVideoSelected(undefined);
    }, [midiaVideoK?.genre, midiaVideoV, typeMidiaVideo]);

    const casts = (cast?: string | null) => {
        return cast?.replaceAll(',', ' · ')
            .replaceAll('<<>>', 'Directors: ')
            .replaceAll('<>', 'Director: ')
            .replaceAll('*', 'Stars: ');
    }

    const isTypeTvShow = (midiaVideo: IMidiaVideo) => {
        return midiaVideo?.type === TYPE_TV_SHOW;
    }

    const isTypeMovie = (midiaVideos: IMidiaVideo[] | undefined) => {
        return midiaVideos?.some((mv) => mv.type === TYPE_MOVIE);
    }

    const isTypeOVA = (midiaVideos: IMidiaVideo[] | undefined) => {
        return midiaVideos?.some((mv) => mv.type === TYPE_OVA);
    }

    const nOfSeason = () => {
        return midiaVideo?.value?.filter((mv) =>isTypeTvShow(mv)).length;
    }

    const nOfMovies = () => {
        return midiaVideo?.value?.filter((mv) => mv.type === TYPE_MOVIE).length;
    }

    const nOfOVAs = () => {
        return midiaVideo?.value?.filter((mv) => mv.type === TYPE_OVA).length;
    }

    const nOfEpisodes = () => {
        return midiaVideoV?.filter((mv) => isTypeTvShow(mv))
            .map(md => md.episodes).map((e) => {
                var episode = String(e);
                if (episode === undefined) {
                    return 0;
                } else  if (episode != null && episode.includes('|')) {
                    return Number(episode.substring(episode.indexOf('|')+2));
                }
                return Number(episode);
            }).reduce((a, c) => {
                if (a != null && c != null) {
                    return a + c;
                }
                return 0;
            }, 0);
    }

    const columns: ColumnsType<IMidiaVideo> = [
        {
            title: 'Title',
            dataIndex: 'subtitle',
            key: 'subtitle',
            onHeaderCell: (_) => ({
                hidden: !isMovie
            }),
            onCell: (_: IMidiaVideo) => {
                return !isMovie ? { colSpan: 0 } : {};
            }
        },
        {
            title: 'Title Original',
            dataIndex: 'titleOriginal',
            key: 'titleOriginal',
            onHeaderCell: (_) => ({
                hidden: (!isAnimeAndTVTK || midiaVideoV?.length === 1)
            }),
            onCell: (_: IMidiaVideo) => {
                return (!isAnimeAndTVTK || midiaVideoV?.length === 1) ? { colSpan: 0 } : {};
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            render: (type) => type,
            onHeaderCell: (_) => ({
                hidden: (!isValidType)
            }),
            onCell: (_: IMidiaVideo) => {
                return (!isValidType) ? { colSpan: 0 } : {};
            }
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            align: 'center'
        },
        {
            title: 'Season',
            dataIndex: 'season',
            key: 'season',
            align: 'center',
            onHeaderCell: (_) => ({
                hidden: isMovie
            }),
            onCell: (_: IMidiaVideo) => {
                return isMovie ? { colSpan: 0 } : {};
            }
        },
        {
            title: 'Watched',
            dataIndex: 'watched',
            key: 'watched',
            align: 'center',
            render: (watched) => <WatchedComponent watched={watched} />,
        },
        {
            title: 'Owned',
            dataIndex: 'owned',
            key: 'owned',
            align: 'center',
            render: (owned) => !!owned ? <Badge status="success" /> : <Badge status="warning" text="I don't have" />,
        },
    ];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: IMidiaVideo[]) => {
            setMidiaVideoSelected(selectedRows[0]);
        },
    };

    return (
        <Modal
            isModalOpen={isModalOpen}
            hideModal={hideModal}
            witdh={witdhModal}
            imgHeight={!isVisibledTable ? 460 : imgHeight}
            img={midiaVideoK?.img}
            children={
                <Descriptions key={`${midiaVideoK}_descriptions`} layout="vertical" bordered style={{
                    maxHeight: !isVisibledTable ? 460 : imgHeight, overflow: 'auto'
                }}>
                    <Descriptions.Item label="Title" span={3}>{midiaVideoK?.title}</Descriptions.Item>
                    {
                        (isNotNull(midiaVideoK?.titleOriginal) && (!isVisibledTable || !!isTvShow)) &&
                        <Descriptions.Item label="Title Original" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            {midiaVideoK?.titleOriginal}
                        </Descriptions.Item>
                    }
                    {
                        (isNotNull(midiaVideoK?.subtitle) && (!isVisibledTable || !!isTvShow)) &&
                        <Descriptions.Item label="Subtitle" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            {midiaVideoK?.subtitle}
                        </Descriptions.Item>
                    }
                    {
                        !isVisibledTable &&
                        <Descriptions.Item label="Year" span={3}>
                            {midiaVideoK?.year}
                        </Descriptions.Item>
                    }
                    {
                        isNotNull(midiaVideoK?.genre) &&
                        <Descriptions.Item label="Genres" span={3}>
                            {genres?.map((genre, index) => <Badge color="blue" count={genre} key={index} />)}
                        </Descriptions.Item>
                    }
                    {
                        !isMovie &&
                        <>
                            <Descriptions.Item label="No. of seasons" style={{ textAlign: 'center' }}>
                                {nOfSeason()}
                            </Descriptions.Item>

                            <Descriptions.Item label="No. of episodes" span={2} style={{ textAlign: 'center' }}>
                                {nOfEpisodes()}
                            </Descriptions.Item>

                            {
                                isTypeMovie(midiaVideo?.value) &&
                                    <Descriptions.Item label="No. of movies" span={3} style={{ textAlign: 'center' }}>
                                        {nOfMovies()}
                                    </Descriptions.Item>
                            }

                            {
                                isTypeOVA(midiaVideo?.value) &&
                                    <Descriptions.Item label="No. of OVAs" span={3} style={{ textAlign: 'center' }}>
                                        {nOfOVAs()}
                                    </Descriptions.Item>
                            }

                            {
                                (!!midiaVideoSelected && isTypeTvShow(midiaVideoSelected)) &&
                                <Descriptions.Item label={`Season ${midiaVideoSelected.season} - List of episodes`} span={3}>
                                    <NOfEpisodesWatchedComponent
                                        key={`${midiaVideoSelected?.id}_nepisodes`}
                                        midiaVideo={midiaVideoSelected} />
                                </Descriptions.Item>
                            }
                        </>
                    }
                    {
                        isValidType &&
                        <Descriptions.Item label="Types" span={3} style={{ textAlign: 'center' }}>
                            { type?.map((type, index) => <Tag color="blue" label={type} key={index} />) }
                        </Descriptions.Item>
                    }
                    
                    {
                        (isNotNull(midiaVideoSelected?.synopsis) || !isVisibledTable) &&
                        <Descriptions.Item label="Synopsis" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }} style={{ textAlign: 'justify' }}>
                                {isVisibledTable ? midiaVideoSelected?.synopsis : midiaVideoK?.synopsis}
                            </Paragraph>
                        </Descriptions.Item>
                    }
                    {
                        (isNotNull(midiaVideoSelected?.cast) || !isVisibledTable) &&
                        <Descriptions.Item label="Cast" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                {isVisibledTable ? casts(midiaVideoSelected?.cast) : casts(midiaVideoK?.cast)}
                            </Paragraph>
                        </Descriptions.Item>
                    }
                    {
                        isNotNull(midiaVideoK?.notes) &&
                        <Descriptions.Item label="Notas" span={3} style={{ whiteSpace: 'pre-wrap' }}>
                            {midiaVideoK?.notes}
                        </Descriptions.Item>
                    }
                    {
                        !isVisibledTable &&
                        <>
                            <Descriptions.Item label="Watched">
                                <WatchedComponent watched={midiaVideoK?.watched ?? 'NOTW'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Owned" span={2}>
                                {!!midiaVideoK?.owned ? <Badge status="success" text="Yes" /> : <Badge status="warning" text="I don't have" />}
                            </Descriptions.Item>
                        </>
                    }
                </Descriptions>
            }
            subChildren={
                <>
                    {
                        isVisibledTable &&
                        <Col className='table-modal' span={24}>
                            <Table
                                columns={columns}
                                dataSource={midiaVideoV}
                                rowKey={(item) => item.id}
                                pagination={{
                                    pageSize: 2,
                                    position: ['topRight']
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

interface WatchedComponentProps {
    watched: string;
}

const WatchedComponent = ({ watched } : WatchedComponentProps) => {
    const [status, setStatus] = useState<PresetStatusColorType>('warning');
    const [text, setText] = useState<string>('Not Started');
    
    useEffect(() => {
        var statusOpt : PresetStatusColorType = 'processing';
        var textOpt = 'In process';

        if (watched === 'W') {
            statusOpt = 'success';
            textOpt = 'Yes';
        } else if (watched === 'NOTW') {
            statusOpt = 'warning';
            textOpt = 'Not Started';
        }

        setStatus(statusOpt);
        setText(textOpt);
    }, [watched]);

    return <Badge status={status} text={text} />;
}

interface NOfEpisodesWatchedComponentProps {
    midiaVideo: IMidiaVideo | undefined;
}

const NOfEpisodesWatchedComponent = ({midiaVideo} : NOfEpisodesWatchedComponentProps) => {

    const [total, setTotal] = useState<number>(0);
    const [numeros, setNumeros] = useState<(number | number[])[]>([0]);
    const [watched, setWatched] = useState<(number | number[])[]>([0]);

    useEffect(() => {
        if (midiaVideo !== undefined) {
            var numerosCurrent: (number | number[])[] = [];
            const episodes = String(midiaVideo?.episodes);

            if (episodes?.includes('|') || episodes?.includes(',')) {
                setTotal(Number(episodes.substring(episodes.indexOf('|')+2)));

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
                        const indexCurrent = index+1;
                        const contais = numeros.includes(indexCurrent);

                        var conditionColor = '#faad14';
                        if (watched.includes(indexCurrent)) {
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