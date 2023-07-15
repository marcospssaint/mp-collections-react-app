import React from 'react';

import { Alert, Space } from 'antd';

export const ErroPage: React.FC = () => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Alert
        message="Oops!"
        description="Sorry, an unexpected error has occurred."
        type="error"
      />
    </Space>
  );
}