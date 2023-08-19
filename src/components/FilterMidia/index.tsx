
import { Col, DatePickerProps, Divider, Input, Row } from "antd";
import { BaseOptionType } from "antd/es/select";
import CheckableTag from "antd/es/tag/CheckableTag";

import { optionsGenres } from "../../entities";
import { optionsOwned, optionsRead, optionsWatched } from "../../entities/options";
import { DEFAULT_CHAR_INDEX } from '../../utils';
import { Select, SelectMultiple } from "../antd";

import { DatePicker } from 'antd';
import { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

interface FilterMidiaProps {
    selectedAlphabets: string[];
    optionsPublisher?: BaseOptionType[];

    isPublisher?: boolean;
    isWatcher?: boolean;
    isRead?: boolean;
    isOwned?: boolean;

    handleChangeSearch: (value: any) => void;
    handleChangeAlphabets: (value: string, checked: boolean) => void;
    handleChangeGenres: (value: string[]) => void;
    handleChangeRangeYear?: (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,) => void;

    handleChangeWatcher?: (value: string) => void;
    handleChangeRead?: (value: string) => void;
    handleChangeOwned?: (value: boolean) => void;
}

export const FilterMidia = ({
    selectedAlphabets,

    isWatcher = false,
    isRead = false,
    isOwned = false,

    handleChangeSearch,

    handleChangeAlphabets,
    handleChangeGenres,
    handleChangeRangeYear,

    handleChangeWatcher,
    handleChangeRead,
    handleChangeOwned
}: FilterMidiaProps) => {
    return (
        <>
            <Col className="border-col-filter">

                <Col className="col-search">
                    {
                        DEFAULT_CHAR_INDEX.map((item) => (
                            <CheckableTag
                                key={item}
                                checked={selectedAlphabets.includes(item)}
                                onChange={(checked) => handleChangeAlphabets(item, checked)}
                                className="filter-tags">
                                {item}
                            </CheckableTag>
                        ))
                    }
                </Col>
                <Col className="col-search">
                    <Row>
                        <Col span={18} offset={4}>
                            <Input
                                size="large"
                                placeholder="Search"
                                allowClear
                                onChange={handleChangeSearch}
                                style={{ textAlign: 'center' }} />
                        </Col>
                    </Row>
                </Col>
                <Col className="col-search">
                    <Row style={{ textAlign: 'center' }}>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <SelectMultiple
                                options={optionsGenres}
                                onChange={handleChangeGenres}
                                placeholder="Gernes"
                                style={{ width: '100%', margin: 2 }} />
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <RangePicker
                                picker="year"
                                size="large"
                                onChange={handleChangeRangeYear}
                                style={{ width: '100%', margin: 2 }} />
                        </Col>

                        {
                            isWatcher &&
                            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                <Select
                                    options={optionsWatched}
                                    onChange={handleChangeWatcher}
                                    placeholder="Watcher"
                                    style={{ width: '100%', margin: 2 }} />
                            </Col>
                        }

                        {
                            isOwned &&
                            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                <Select
                                    options={optionsOwned}
                                    onChange={handleChangeOwned}
                                    placeholder="Owned"
                                    style={{ width: '100%', margin: 2 }} />
                            </Col>
                        }

                        {
                            isRead &&
                            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                <Select
                                    options={optionsRead}
                                    onChange={handleChangeRead}
                                    placeholder="Read"
                                    style={{ width: '100%', margin: 2 }} />
                            </Col>
                        }
                    </Row>
                </Col>

            </Col>
            <Divider />
        </>
    );
}