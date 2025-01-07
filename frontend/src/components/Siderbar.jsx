import React from "react";
import { Layout, Menu } from "antd";
import  {
    DashboardOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapse }) => {
    return (
        <Sider collapsible collapsed={collapse} trigger={null}>
            <div className="demo-logo-vertical">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key={1} icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key={2} icon={<SettingOutlined />}>
                        <Link to="/dashboard/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key={3} icon={<LogoutOutlined />}>
                        <Link to="/logout">Logout</Link>
                    </Menu.Item>
                </Menu>
            </div>
        </Sider>
    );
}

export default Sidebar;