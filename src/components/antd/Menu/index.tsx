import {
    AliwangwangOutlined,
    BookOutlined,
    BugOutlined,
    HomeOutlined,
    LogoutOutlined,
    MessageOutlined,
    VideoCameraAddOutlined,
    VideoCameraOutlined,
    WechatOutlined
} from '@ant-design/icons';

import { Menu as MenuAntd } from 'antd';

import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/auth';

interface MenuAndProps {
    defaultSelectedKeys?: string[];
}

export const Menu = ({ defaultSelectedKeys }: MenuAndProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <MenuAntd
            theme='light'
            mode='horizontal'
            defaultSelectedKeys={defaultSelectedKeys}
            items={[
                {
                    key: '/home',
                    icon: <HomeOutlined />,
                    label: 'Home',
                    onClick: () => navigate('/home'),
                },
                {
                    key: '/movies',
                    icon: <VideoCameraOutlined />,
                    label: 'Movies',
                    onClick: () => navigate('movies'),
                },
                {
                    key: '/tv-shows',
                    icon: <VideoCameraAddOutlined />,
                    label: 'TV Shows',
                    onClick: () => navigate('tv-shows'),
                },
                {
                    key: '/tv-tokusatsus',
                    icon: <BugOutlined />,
                    label: 'TV Tokusatsu',
                    onClick: () => navigate('tv-tokusatsus'),
                },
                {
                    key: '/animes',
                    icon: <AliwangwangOutlined />,
                    label: 'Animes',
                    onClick: () => navigate('animes'),
                },
                {
                    key: '/comics',
                    icon: <WechatOutlined />,
                    label: 'Comics',
                    onClick: () => navigate('comics'),
                },
                {
                    key: '/mangas',
                    icon: <MessageOutlined />,
                    label: 'Mangas',
                    onClick: () => navigate('mangas'),
                },
                {
                    key: '/books',
                    icon: <BookOutlined />,
                    label: 'Books',
                    onClick: () => navigate('books'),
                },
                {
                    key: '/login',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: () => logout(),
                }
            ]}
        />
    )
};