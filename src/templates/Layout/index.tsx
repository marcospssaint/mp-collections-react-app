import './styles.css';

import React from 'react';
import { Outlet, useLocation } from "react-router-dom";

import { Layout, theme } from 'antd';
import { Footer } from 'antd/es/layout/layout';

import { Menu } from '../../components';

const { Header, Content } = Layout;

export const LayoutTemplate: React.FC = () => {
    const {
        token: { colorBgContainer, colorBgBase },
    } = theme.useToken();
    const location = useLocation();

    return (
        <Layout className='site-layout'>
            <Header style={{
                padding: 0,
                background: colorBgContainer,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                alignItems: 'center',
            }}>
                <Menu defaultSelectedKeys={[location.pathname]} />
            </Header>

            <Content
                className='layout-content'
                style={{
                    background: colorBgBase,
                }}>
                <Outlet />
            </Content>

            <Footer style={{ textAlign: 'center', fontSize: '16px' }}><div>My Collections ©2023 Created by MP-SS</div></Footer>
        </Layout>
    );
}