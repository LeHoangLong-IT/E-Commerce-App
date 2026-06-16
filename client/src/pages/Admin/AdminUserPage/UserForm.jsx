import { Form, Input, Modal, Select, Row, Col } from "antd";
import { useEffect } from "react";

const UserForm = ({ open, onCancel, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleOk = async () => {
        const values = await form.validateFields();
        onSubmit(values);
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            title={initialValues ? "Update User" : "Create User"}
            width={700}
        >
            <Form layout="vertical" form={form}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please enter name" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter email" },
                                { type: "email", message: "Invalid email" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    {!initialValues && (
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: "Please enter password" }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={12}>
                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true }]}
                            initialValue="user"
                        >
                            <Select
                                options={[
                                    { value: "user", label: "User" },
                                    { value: "admin", label: "Admin" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UserForm;