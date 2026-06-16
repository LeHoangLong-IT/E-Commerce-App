import React, { useEffect, useState } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import LeftBarComponent from "../LeftBarComponent/LeftBarComponent";
import { MenuOutlined } from "@ant-design/icons";
import { Col, Row, ConfigProvider, theme, Button, Drawer } from "antd";

const DefaultComponent = ({ children, hideSidebar }) => {
    // Theme
    const [dark, setDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const currentTheme = dark ? "dark" : "light";
        document.body.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
    }, [dark]);

    // Category Filter
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Mobile Drawer State
    const [drawerVisible, setDrawerVisible] = useState(false);

    return (
        <ConfigProvider
            theme={{
                algorithm: dark
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm
            }}
        >
            <HeaderComponent
                dark={dark}
                setDark={setDark}
            />

            <div className="container">
                <Row
                    gutter={[32, 24]}
                    className="mt-4"
                >
                    {!hideSidebar && (
                        <Col xs={24} md={5}>
                            {/* Mobile Toggle Button */}
                            <div className="d-block d-md-none mb-2">
                                <Button 
                                    type="primary" 
                                    icon={<MenuOutlined />} 
                                    onClick={() => setDrawerVisible(true)}
                                    className="w-100 d-flex justify-content-center align-items-center"
                                    size="large"
                                >
                                    Xem danh mục sản phẩm
                                </Button>
                                <Drawer
                                    title="Danh mục sản phẩm"
                                    placement="left"
                                    onClose={() => setDrawerVisible(false)}
                                    open={drawerVisible}
                                    bodyStyle={{ padding: '0' }}
                                >
                                    <LeftBarComponent
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={(cat) => {
                                            setSelectedCategory(cat);
                                            setDrawerVisible(false); // Close on select
                                        }}
                                    />
                                </Drawer>
                            </div>

                            {/* Desktop Sidebar */}
                            <div className="d-none d-md-block">
                                <LeftBarComponent
                                    selectedCategory={selectedCategory}
                                    onSelectCategory={setSelectedCategory}
                                />
                            </div>
                        </Col>
                    )}

                    <Col xs={24} md={hideSidebar ? 24 : 19}>
                        {
                            children &&
                            React.cloneElement(
                                children,
                                {
                                    selectedCategory
                                }
                            )
                        }
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
};

export default DefaultComponent;