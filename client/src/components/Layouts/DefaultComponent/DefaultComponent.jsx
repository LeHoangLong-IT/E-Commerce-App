import HeaderComponent from '../HeaderComponent/HeaderComponent'
import LeftBarComponent from '../LeftBarComponent/LeftBarComponent';
import { Col, Row } from 'antd';

// Dark Mode
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";

const DefaultComponent = ({ children }) => {
    // Load theme ngay khi app start (không bị flash)
    const [dark, setDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Khi dark thay đổi → cập nhật body + lưu localStorage
    useEffect(() => {
        const currentTheme = dark ? "dark" : "light";
        document.body.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
    }, [dark]);

    return (
        <ConfigProvider
            theme={{
                algorithm: dark
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
            }}
        >
            <HeaderComponent dark={dark} setDark={setDark} />

            <div className="container">
                <Row gutter={[32, 24]} className='mt-4'>
                <Col span={5}><LeftBarComponent /></Col>
                <Col span={19}>{children}</Col>
                {/* <Col span={5}></Col> */}
            </Row>
            </div>
        </ConfigProvider>
    )
}

export default DefaultComponent