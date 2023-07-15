import React from 'react';

import { Badge as BadgeAntd } from 'antd';

import { COLOR_SUCSS, COLOR_INSUCSS } from '../../../utils'

export interface RibbonProps {
    condition: boolean;
    text?: React.ReactNode;
    children?: React.ReactNode;
}

export const BadgeRibbon = ({ condition = false, text = '', children }: RibbonProps) => {
    const color = condition ? COLOR_SUCSS : COLOR_INSUCSS;
    return (<BadgeAntd.Ribbon key={text?.toString()} text={text} color={color} children={children}/>)
}