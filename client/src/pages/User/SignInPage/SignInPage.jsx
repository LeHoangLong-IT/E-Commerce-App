import React from 'react';
import './SignInPage.scss';

import userApi from "../../../api/userApi";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import {
    Form,
    Input,
    Button,
    Typography,
    Card,
    Checkbox,
    Space
} from 'antd';

import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const SignInPage = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await userApi.login(values);

            const { access_token, user } = res.data;

            // save localStorage
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            message.success("Đăng nhập thành công!");

            // redirect theo role
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (error) {
            message.error(
                error?.response?.data?.message || "Login failed"
            );
        }
    };

    // Dev Login
    const handleDevLogin = (type) => {

        const accounts = {
            admin: {
                username: 'test4@gmail.com',
                password: '123123'
            },

            user: {
                username: '12341234@gmail.com',
                password: '12341234'
            }
        };

        form.setFieldsValue(accounts[type]);
    };

    return (
        <div className="sign-in-container">

            <Card className="sign-in-card">

                {/* Header */}
                <div className="sign-in-header">

                    <Title level={2}>
                        Đăng nhập
                    </Title>

                    <Text type="secondary">
                        Chào mừng bạn quay trở lại 👋
                    </Text>

                </div>

                {/* Dev Account */}
                <div className="dev-login-group">

                    <Text className="dev-login-title">
                        Dev Test Account
                    </Text>

                    <Space wrap>

                        <Button onClick={() => handleDevLogin('admin')}>
                            Admin
                        </Button>

                        <Button onClick={() => handleDevLogin('user')}>
                            User
                        </Button>

                    </Space>

                </div>

                {/* Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    {/* Username */}
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên đăng nhập!'
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Nhập email"
                        />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!'
                            }
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>

                    {/* Remember + Forgot */}
                    <div className="sign-in-options">

                        <Checkbox>
                            Ghi nhớ đăng nhập
                        </Checkbox>

                        <Link href="/forgot-password">
                            Quên mật khẩu?
                        </Link>

                    </div>

                    {/* Login Button */}
                    <Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                        >
                            Đăng nhập
                        </Button>

                    </Form.Item>

                    {/* Footer */}
                    <div className="sign-in-footer">

                        <Text>
                            Chưa có tài khoản?
                        </Text>{' '}

                        <Link href="/sign-up">
                            Đăng ký ngay
                        </Link>

                    </div>

                </Form>

            </Card>

        </div>
    );
};

export default SignInPage;