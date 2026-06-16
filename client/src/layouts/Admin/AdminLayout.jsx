import { Layout, ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
    // Đọc theme từ localStorage để đồng bộ với User
    const [dark, setDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setDark(localStorage.getItem("theme") === "dark");
        };
        // Lắng nghe thay đổi theme (nếu có cách khác trigger)
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleTheme = () => {
        const nextTheme = dark ? "light" : "dark";
        setDark(!dark);
        localStorage.setItem("theme", nextTheme);
        document.body.setAttribute("data-theme", nextTheme);
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}
        >
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    width={260}
                    theme="dark"
                    style={{
                        position: "sticky",
                        top: 0,
                        left: 0,
                        height: "100vh",
                        background: '#001529'
                    }}
                >
                    <AdminSidebar dark={dark} toggleTheme={toggleTheme} />
                </Sider>

                <Layout style={{ background: dark ? '#141414' : '#f5f5f5' }}>
                    <Content
                        style={{
                            padding: 24,
                            background: dark ? '#141414' : '#f5f5f5',
                            color: 'var(--textColor)'
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AdminLayout;