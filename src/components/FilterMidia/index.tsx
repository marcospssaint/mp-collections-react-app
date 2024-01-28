
import { Button, Col, DatePickerProps, Divider, Input, Radio, Row, Tooltip } from "antd";
import CheckableTag from "antd/es/tag/CheckableTag";

import { SearchOutlined } from '@ant-design/icons';
import { optionsOwned, optionsRead, optionsVisibleCollection, optionsWatched } from "../../entities/options";
import { DEFAULT_CHAR_INDEX } from '../../utils';
import { Select, SelectMultiple } from "../antd";

import { DatePicker, Form } from 'antd';
import { RangePickerProps } from "antd/es/date-picker";
import { BaseOptionType } from "antd/es/select";
import { useState } from "react";

const { RangePicker } = DatePicker;

interface FilterMidiaProps {
    selectedAlphabets: string[];
    optionsCountries: BaseOptionType[];
    optionsGenres: BaseOptionType[];
    optionsLanguage: BaseOptionType[];

    isPublisher?: boolean;
    isCountries?: boolean;
    isLanguage?: boolean;
    isWatcher?: boolean;
    isRead?: boolean;
    isOwned?: boolean;
    isFilterCountries?: boolean;
    isVisibleCollection?: boolean;
    defaultValueCollection?: boolean;
    selectedCountry?: string;

    handleChangeSearch: (value: any) => void;
    handleChangeAlphabets: (value: string, checked: boolean) => void;
    handleSelectedCountry: (e: any) => void;
    handleChangeGenres: (value: string[]) => void;
    handleChangeRangeYear?: (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,) => void;

    handleChangeCountries?: (value: string[]) => void;
    handleChangeLanguage?: (value: string) => void;

    handleChangeWatcher?: (value: string) => void;
    handleChangeRead?: (value: string) => void;
    handleChangeOwned?: (value: boolean) => void;
    handleChangeVisibleCollection?: (value: boolean) => void;
}

export const FilterMidia = ({
    selectedAlphabets,
    optionsCountries = [],
    optionsGenres = [],
    optionsLanguage = [],

    isLanguage = true,

    isWatcher = false,
    isRead = false,
    isOwned = false,
    isFilterCountries = false,
    isVisibleCollection = false,
    defaultValueCollection = true,
    selectedCountry = '',

    handleChangeSearch,

    handleChangeAlphabets,
    handleSelectedCountry,
    handleChangeGenres,
    handleChangeRangeYear,
    handleChangeLanguage,
    handleChangeWatcher,
    handleChangeRead,
    handleChangeOwned,
    handleChangeVisibleCollection,
}: FilterMidiaProps) => {

    const [isVisibled, setVisibled] = useState<boolean>(true);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    return (
        <Col className="border-col-filter" offset={2}>
            <Col className="col-search" style={{ paddingBottom: 30 }}>
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
            <Form
                size='small'
                {...formItemLayout}
                style={{ maxWidth: 800 }}
            >
                <Form.Item label="Search Term:" >
                    <Row gutter={8}>
                        <Col span={22}>
                            <Input
                                size="large"
                                placeholder="Search for a title.."
                                allowClear
                                onChange={handleChangeSearch} />
                        </Col>
                        <Col span={2}>
                            <Tooltip title="search">
                                <Button
                                    size="large"
                                    shape="circle"
                                    icon={<SearchOutlined />}
                                    onClick={() => {
                                        setVisibled(!isVisibled)
                                    }} />
                            </Tooltip>
                        </Col>
                    </Row>
                </Form.Item>
                <Col style={{ display: isVisibled ? 'none' : '' }}>
                    <Form.Item label="Genres:">
                        <SelectMultiple
                            options={optionsGenres}
                            onChange={handleChangeGenres}
                            placeholder="Please select" />
                    </Form.Item>
                    <Form.Item label="Range Year:">
                        <RangePicker
                            picker="year"
                            onChange={handleChangeRangeYear}
                            style={{ width: '100%' }} />
                    </Form.Item>

                    {
                        isLanguage &&
                        <Form.Item label="Languages:">
                            <Select
                                options={optionsLanguage}
                                onChange={handleChangeLanguage}
                                placeholder="Please select language" />
                        </Form.Item>
                    }

                    {
                        isWatcher &&
                        <Form.Item label="Watcher:">
                            <Select
                                options={optionsWatched}
                                onChange={handleChangeWatcher}
                                placeholder="Please select watcher" />
                        </Form.Item>
                    }

                    {
                        isOwned &&
                        <Form.Item label="Owned:">
                            <Select
                                options={optionsOwned}
                                onChange={handleChangeOwned}
                                placeholder="Please select owned" />
                        </Form.Item>
                    }

                    {
                        isRead &&
                        <Form.Item label="Read:">
                            <Select
                                options={optionsRead}
                                onChange={handleChangeRead}
                                placeholder="Please select read" />
                        </Form.Item>
                    }

                    {
                        isVisibleCollection &&
                        <Form.Item label="Colletion:">
                            <Select
                                options={optionsVisibleCollection}
                                allowClear={false}
                                defaultValue={defaultValueCollection}
                                onChange={handleChangeVisibleCollection}
                                placeholder="Please select visible collection" />
                        </Form.Item>
                    }
                </Col>
            </Form>
            {
                isFilterCountries &&
                <Col className="col-search" style={{ paddingBottom: 30 }}>
                    <Radio.Group buttonStyle="solid" value={selectedCountry} onChange={handleSelectedCountry}>
                        {
                            optionsCountries
                                .map((country) => {
                                    var value = country["value"];
                                    if (value === '') return 'All';
                                    return value;
                                })
                                .map((item) => (
                                    <Radio.Button value={item}>{item}</Radio.Button>
                                ))
                        }
                    </Radio.Group>
                </Col>
            }
            <Divider />
        </Col>
    );
}