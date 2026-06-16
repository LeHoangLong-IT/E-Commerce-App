import {
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from "@ant-design/icons";

import {
    Menu,
    Avatar,
    Typography,
    Divider,
    Button,
    Switch
} from "antd";

import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;

const AdminSidebar = ({ dark, toggleTheme }) => {

    const navigate = useNavigate();
    const location = useLocation();

    // TODO: lấy từ Redux/Auth Context
    const currentUser = {
        name: "Hoàng Long",
        role: "Administrator"
    };

    const items = [
        {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard"
        },
        {
            key: "/admin/users",
            icon: <UserOutlined />,
            label: "Users"
        },
        {
            key: "/admin/products",
            icon: <ShoppingOutlined />,
            label: "Products"
        },
        {
            key: "/admin/categories",
            icon: <AppstoreOutlined />,
            label: "Categories"
        },
        {
            key: "/admin/orders",
            icon: <ShoppingCartOutlined />,
            label: "Orders"
        }
    ];

    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/sign-in");
    };

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: '#001529'
            }}
        >

            {/* LOGO */}

            <div
                style={{
                    height: 70,
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 700,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                ADMIN
            </div>

            {/* USER INFO */}

            <div
                style={{
                    padding: "16px",
                    textAlign: "center"
                }}
            >
                <Avatar
                    size={64}
                    icon={<UserOutlined />}
                />

                <div
                    style={{
                        marginTop: 12
                    }}
                >
                    <Text
                        strong
                        style={{
                            color: "#fff",
                            display: "block"
                        }}
                    >
                        {currentUser.name}
                    </Text>

                    <Text
                        style={{
                            color: "#aaa",
                            fontSize: 12
                        }}
                    >
                        {currentUser.role}
                    </Text>
                </div>
            </div>

            <Divider
                style={{
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    margin: 0
                }}
            />

            {/* MENU */}

            <div
                style={{
                    flex: 1,
                    overflow: "auto",
                    marginTop: "1.6rem"
                }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    style={{ background: 'transparent', borderRight: 'none' }}
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={({ key }) => navigate(key)}
                />
            </div>

            {/* THEME TOGGLE */}
            <div
                style={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                }}
            >
                <span style={{ color: "#aaa", fontWeight: 500 }}>Chế độ Tối</span>
                <Switch 
                    checked={dark} 
                    onChange={toggleTheme} 
                    style={{ backgroundColor: dark ? '#1677ff' : 'rgba(255, 255, 255, 0.3)' }}
                />
            </div>

            {/* LOGOUT */}

            <div
                style={{
                    padding: 16,
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                }}
            >
                <Button
                    danger
                    block
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Đăng xuất
                </Button>
            </div>

        </div>
    );
};

export default AdminSidebar;