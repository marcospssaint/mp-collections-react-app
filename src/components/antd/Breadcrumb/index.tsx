import React from 'react';

import { Breadcrumb as BreadcrumbAnd, Col } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

const ITEMS = [{
    title: 'Home',
}];

interface BreadcrumbProps {
    items: ItemType[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (<Col span={24}><BreadcrumbAnd style={{ margin: '16px 0' }} items={[...ITEMS, ...items]} /></Col>)
};