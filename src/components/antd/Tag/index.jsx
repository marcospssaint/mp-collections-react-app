import { Tag as TagAntd } from 'antd';

const COLOR_SUCSS = '#52c41a';
const COLOR_INSUCSS = '#faad14';

export const Tag = ({ label = '', color = '' }) => (
    <TagAntd color={color}>
        {label}
    </TagAntd>
);

export const TagConditional = ({ condition = false, labelSucess = '', labelInsuccess = '', }) => (
    <TagAntd color={condition ? COLOR_SUCSS : COLOR_INSUCSS}>
        {condition ? labelSucess : labelInsuccess}
    </TagAntd>
);