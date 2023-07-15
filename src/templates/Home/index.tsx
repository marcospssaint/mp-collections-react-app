import React from 'react';

import { Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
    return (
        <Row style={{ paddingTop: 24, minHeight: 360 }}>
            <Typography>
                <Title>Welcome!</Title>
                <Paragraph>
                    This project aims to help organize your video and reading media collections.
                </Paragraph>
            </Typography>
        </Row>
    );
}