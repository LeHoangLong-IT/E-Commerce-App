
import { Col, Row, Input, Button } from 'antd';
import './HeaderComponent.scss'
import { ShoppingCart, MoonStar, Sun, User, Search } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from "react-router";

const HeaderComponent = ({ dark, setDark }) => {

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
  }, [dark]);

  return (
    <div>
      <Row className='header-wrapper' gutter={[48, 0]} align="middle">
        <Col flex="none">
          <div className="d-flex align-items-center justify-content-between gap-5">
            <Link to="/">
              <h1 className='header-logo'>I-Shop</h1>
            </Link>
            {/* <MoonStar /> */}
            {dark
              ? (<Sun onClick={() => setDark(false)} />)
              : (<MoonStar onClick={() => setDark(true)} />
              )}
          </div>
        </Col>
        <Col flex="auto">
          <div className="d-flex bg-white">
            <Input size="large"
              className='header-input'
              variant={false}
              placeholder="Input search text"
              allowClear
            />
            <Button size="large" className='header-button' icon={<Search size={16} />}>Tìm kiếm</Button>
          </div>
        </Col>
        <Col flex="none">
          <div className="right d-flex align-items-center gap-5 justify-content-between">
            {/* <h3>Đăng nhập / Đăng ký</h3> */}

            {/* <div className="d-flex gap-3 py-3 fs-3">
              <User /> Tài khoản
            </div> */}

            <div className="header-userinfo d-flex position-relative gap-3 py-3 fs-3">
              <User /> Hoàng Long

              <div className="userinfo-container">
                <div className="userinfo-item">
                  Thông tin tài khoảng
                </div>

                <div className="userinfo-item">
                  Giỏ hàng
                </div>

                <div className="userinfo-item">
                  Lịch sử mua hàng
                </div>

                <div className="userinfo-item">
                  Đăng xuất
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 py-3 fs-3">
              <ShoppingCart /> Giỏ hàng
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default HeaderComponent