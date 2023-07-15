import { Button, Col, Form, Input, Row, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/auth';
//import { useAuth } from '../../contexts/auth';

export const Login: React.FC = () => {
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an username incorrect',
        });
    };

    const onFinishFailed = () => { };

    const { login } = useAuth();

    const onFinish = (values: any) => {
        const username = values["username"] as string;

        login({
            name: username,
        }).then(() => {
           navigate('/home', { replace: true });
        }).catch(() => {
            error();
        });
    };

    return (
        <Row>
            {contextHolder}

            <Col xs={2} sm={2} md={2} lg={6} xl={6} />
            <Col xs={20} sm={20} md={20} lg={12} xl={12} style={{ paddingTop: '250px' }}>
                <Form
                    name="normal_login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            className='site-form-input' />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Col xs={2} sm={2} md={2} lg={6} xl={6} />
        </Row>
    )
};