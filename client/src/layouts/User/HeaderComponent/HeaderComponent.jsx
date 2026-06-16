import { Col, Row, Input, Button, Dropdown } from 'antd';
import './HeaderComponent.scss'
import { ShoppingCart, MoonStar, Sun, User, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router";
import { logout } from "../../../utils/auth";

const HeaderComponent = ({ dark, setDark }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
  }, [dark]);

  // load user from localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    logout(navigate);
    setUser(null);
  };

  return (
    <div>
      <Row className='header-wrapper' gutter={[16, 16]} align="middle">

        {/* LEFT */}
        <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 1 }}>
          <div className="d-flex align-items-center justify-content-start gap-3 gap-md-5">
            <Link to="/">
              <h1 className='header-logo'>I-Shop</h1>
            </Link>

            {dark
              ? <Sun onClick={() => setDark(false)} />
              : <MoonStar onClick={() => setDark(true)} />
            }
          </div>
        </Col>

        {/* SEARCH */}
        <Col xs={{ span: 24, order: 3 }} md={{ span: 10, order: 2 }}>
          <div className="d-flex bg-white w-100">
            <Input size="large"
              className='header-input w-100'
              placeholder="Input search text"
              allowClear
            />
            <Button size="large" className='header-button' icon={<Search size={16} />}>
              <span className="d-none d-sm-inline">Tìm kiếm</span>
            </Button>
          </div>
        </Col>

        {/* RIGHT */}
        <Col xs={{ span: 12, order: 2 }} md={{ span: 8, order: 3 }}>
          <div className="right d-flex align-items-center gap-3 gap-md-5 justify-content-end">

            {/* LOGIN / USER CONDITIONAL */}
            {!user ? (
              <div className="d-flex gap-2 gap-md-3 py-3 fs-5 fs-md-3">
                <Link to="/sign-in" className='text-white text-decoration-none'>
                  <User className='me-1 me-md-2'/> <span className="d-none d-sm-inline">Đăng nhập</span>
                </Link>
              </div>
            ) : (
              <div className="d-flex header-userinfo position-relative gap-2 gap-md-3 py-3 fs-5 fs-md-3">
                <User /> <span className="d-none d-sm-inline">{user.name}</span>

                <div className="userinfo-container">

                  {user.role === 'admin' && (
                    <div className="userinfo-item" onClick={() => navigate('/admin')}>
                      Quản trị viên
                    </div>
                  )}

                  <div className="userinfo-item">
                    Thông tin tài khoản
                  </div>

                  <div className="userinfo-item" onClick={() => navigate('/cart')}>
                    Giỏ hàng
                  </div>

                  <div className="userinfo-item" onClick={() => navigate('/my-orders')}>
                    Lịch sử đơn hàng
                  </div>

                  <div
                    className="userinfo-item text-danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>

                </div>
              </div>
            )}

            {/* CART */}
            <div className="d-flex gap-2 gap-md-3 py-3 fs-5 fs-md-3" style={{cursor: 'pointer'}} onClick={() => navigate('/cart')}>
              <ShoppingCart /> <span className="d-none d-sm-inline">Giỏ hàng</span>
            </div>

          </div>
        </Col>

      </Row>
    </div>
  )
}

export default HeaderComponent