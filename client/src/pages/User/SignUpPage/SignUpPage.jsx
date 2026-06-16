import React from 'react';
import './SignUpPage.scss';

import {
    Form,
    Input,
    Button,
    Typography,
    Card
} from 'antd';

import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const SignUpPage = () => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Register Success:', values);
    };

    return (
        <div className="sign-up-container">

            <Card className="sign-up-card">

                {/* Header */}
                <div className="sign-up-header">

                    <Title level={2}>
                        Đăng ký
                    </Title>

                    <Text type="secondary">
                        Tạo tài khoản mới
                    </Text>

                </div>

                {/* Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    {/* Name */}
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ tên!'
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Nhập họ và tên"
                        />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!'
                            },
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!'
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="Nhập email"
                        />
                    </Form.Item>

                    {/* Phone */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!'
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<PhoneOutlined />}
                            placeholder="Nhập số điện thoại"
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

                    {/* Confirm Password */}
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu!'
                            },

                            ({ getFieldValue }) => ({
                                validator(_, value) {

                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        new Error('Mật khẩu không khớp!')
                                    );
                                }
                            })
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Nhập lại mật khẩu"
                        />
                    </Form.Item>

                    {/* Button */}
                    <Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                        >
                            Đăng ký
                        </Button>

                    </Form.Item>

                    {/* Footer */}
                    <div className="sign-up-footer">

                        <Text>
                            Đã có tài khoản?
                        </Text>{' '}

                        <Link href="/sign-in">
                            Đăng nhập ngay
                        </Link>

                    </div>

                </Form>

            </Card>

        </div>
    );
};

export default SignUpPage;