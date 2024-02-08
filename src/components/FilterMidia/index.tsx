
import { Col, Collapse, DatePickerProps, Divider, Input, Row, Typography } from "antd";

import { optionsOwned, optionsRead, optionsVisibleCollection, optionsWatched } from "../../entities/options";
import { Select } from "../antd";

import { DatePicker } from 'antd';
import { RangePickerProps } from "antd/es/date-picker";
import { BaseOptionType } from "antd/es/select";
import CheckableTag from "antd/es/tag/CheckableTag";

const { RangePicker } = DatePicker;

interface FilterMidiaProps {
    genres?: string[];
    countries?: string[];

    selectedGenres?: string[];
    selectedCountries?: string[];

    optionsLanguage: BaseOptionType[];

    isPublisher?: boolean;
    isCountries?: boolean;
    isLanguage?: boolean;
    isWatcher?: boolean;
    isRead?: boolean;
    isFilterCountries?: boolean;
    isVisibleCollection?: boolean;
    defaultValueCollection?: boolean;

    handleChangeSearch: (value: any) => void;
    handleChangeGenres: (genre: string, checked: boolean) => void;
    handleChangeCountries: (country: string, checked: boolean) => void;
    handleChangeRangeYear?: (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,) => void;

    handleChangeWatcher?: (value: string) => void;
    handleChangeRead?: (value: string) => void;
    handleChangeOwned?: (value: boolean) => void;
    handleChangeLanguage?: (value: string) => void;
    handleChangeVisibleCollection?: (value: boolean) => void;
}

export const FilterMidia = ({
    selectedGenres = [],
    selectedCountries = [],

    genres = [],
    countries = [],
    optionsLanguage = [],

    isLanguage = true,

    isWatcher = false,
    isRead = false,
    isFilterCountries = false,
    isVisibleCollection = false,
    defaultValueCollection = false,

    handleChangeSearch,
    handleChangeGenres,
    handleChangeCountries,
    handleChangeRangeYear,
    handleChangeLanguage,
    handleChangeWatcher,
    handleChangeRead,
    handleChangeOwned,
    handleChangeVisibleCollection,
}: FilterMidiaProps) => {
    return (
        <Row>
            <Collapse
                defaultActiveKey={['1']}
                expandIconPosition="end"
                style={{ width: '100%' }}
                items={[
                    {
                        key: '1',
                        label: 'Filters',
                        children:
                            <>
                                <Col>
                                    <div>
                                        <Typography.Title level={5}>Keywords</Typography.Title>
                                        <Input
                                            placeholder="Filter by keywords..."
                                            allowClear
                                            onChange={handleChangeSearch}
                                        />
                                    </div>
                                    <Divider />
                                    <div>
                                        <Typography.Title level={5}>Genres</Typography.Title>
                                        {
                                            genres.map((item) => (
                                                <CheckableTag
                                                    key={item}
                                                    className="tags"
                                                    checked={selectedGenres.includes(item)}
                                                    onChange={(checked) => handleChangeGenres(item, checked)}>
                                                    {item}
                                                </CheckableTag>
                                            ))
                                        }
                                    </div>
                                    <Divider />
                                    {
                                        isFilterCountries && <>
                                            <div>
                                                <Typography.Title level={5}>Countries</Typography.Title>
                                                {
                                                    countries.map((item) => (
                                                        <CheckableTag
                                                            key={item}
                                                            className="tags"
                                                            checked={selectedCountries.includes(item)}
                                                            onChange={(checked) => handleChangeCountries(item, checked)}>
                                                            {item}
                                                        </CheckableTag>
                                                    ))
                                                }
                                            </div>
                                            <Divider />
                                        </>
                                    }

                                    <div>
                                        <Typography.Title level={5}>Release Dates</Typography.Title>
                                        <RangePicker
                                            picker="year"
                                            onChange={handleChangeRangeYear}
                                            placeholder={['from', 'to']}
                                            style={{ width: '100%' }} />
                                    </div>
                                    <Divider />
                                    {
                                        isWatcher && <>
                                            <div>
                                                <Typography.Title level={5}>Watcher</Typography.Title>
                                                <Select
                                                    options={optionsWatched}
                                                    onChange={handleChangeWatcher}
                                                    placeholder="None Selected"
                                                    style={{ width: '100%' }} />
                                            </div>
                                            <Divider />
                                        </>
                                    }
                                    <div>
                                        <Typography.Title level={5}>Owned</Typography.Title>
                                        <Select
                                            options={optionsOwned}
                                            onChange={handleChangeOwned}
                                            placeholder="None Selected"
                                            style={{ width: '100%' }} />
                                    </div>
                                    <Divider />
                                    {
                                        isRead && <>
                                            <div>
                                                <Typography.Title level={5}>Read</Typography.Title>
                                                <Select
                                                    options={optionsRead}
                                                    onChange={handleChangeRead}
                                                    placeholder="None Selected"
                                                    style={{ width: '100%' }} />
                                            </div>
                                            <Divider />
                                        </>
                                    }
                                    {
                                        isVisibleCollection && <>
                                            <div>
                                                <Typography.Title level={5}>Collection</Typography.Title>
                                                <Select
                                                    options={optionsVisibleCollection}
                                                    allowClear={false}
                                                    defaultValue={defaultValueCollection}
                                                    onChange={handleChangeVisibleCollection}
                                                    placeholder="None Selected"
                                                    style={{ width: '100%' }} />
                                            </div>
                                            <Divider />
                                        </>
                                    }
                                    {
                                        isLanguage && <>
                                            <div>
                                                <Typography.Title level={5}>Language</Typography.Title>
                                                <Select
                                                    options={optionsLanguage}
                                                    onChange={handleChangeLanguage}
                                                    placeholder="None Selected"
                                                    style={{ width: '100%' }} />
                                            </div>
                                            <Divider />
                                        </>
                                    }
                                </Col>
                            </>
                    },
                ]}
            />
        </Row>
    );
}