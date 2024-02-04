import { Select as SelectAntd } from 'antd';
import { BaseOptionType } from 'antd/es/select';

interface DefaultSelectProps {
    placeholder?: string;
    options?: BaseOptionType[];
    allowClear?: boolean;
    defaultValue?: any | null;
    style?: React.CSSProperties;
}

interface SelectProps extends DefaultSelectProps {
    onChange?: (value: any) => void;   
}

interface SelectMulProps extends DefaultSelectProps {
    onChange?: (value: any[]) => void;
}

export const Select = ({ onChange, placeholder, options, allowClear = true, defaultValue, style }: SelectProps) => {
    return (
        <SelectAntd
            placeholder={placeholder}
            onChange={onChange}
            style={style}
            allowClear={allowClear}
            options={options}
            defaultValue={defaultValue}
        />
    )
}

export const SelectMultiple = ({ onChange, placeholder, options, style }: SelectMulProps) => {
    return (
        <SelectAntd
            mode="multiple"
            placeholder={placeholder}
            onChange={onChange}
            style={style}
            allowClear
            options={options}
            size='large'
        />
    )
}