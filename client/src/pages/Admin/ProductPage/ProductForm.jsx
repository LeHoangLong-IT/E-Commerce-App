import {
    Modal,
    Form,
    Input,
    InputNumber,
    Row,
    Col,
    Select,
    Upload,
    Button
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import categoryApi from "../../../api/categoryApi";

const ProductForm = ({
    open,
    onCancel,
    onSubmit,
    initialValues
}) => {

    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    // ================= LOAD CATEGORY =================

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {

            const res = await categoryApi.getAll();

            setCategories(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    // ================= LOAD CHILD CATEGORY =================

    const loadSubCategories = async (parentId) => {

        if (!parentId) {
            setSubCategories([]);
            return;
        }

        try {

            const res =
                await categoryApi.getChildren(parentId);

            setSubCategories(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    // ================= CHANGE PRIMARY =================

    const handlePrimaryChange = async (parentId) => {

        form.setFieldValue(
            "secondary_categories",
            []
        );

        await loadSubCategories(parentId);
    };

    // ================= EDIT =================

    useEffect(() => {

        if (!initialValues) {

            form.resetFields();
            setSubCategories([]);

            return;
        }

        const secondaryIds =
            initialValues.product_categories?.map(
                item => item.category_id
            ) || [];

        form.setFieldsValue({

            ...initialValues,

            secondary_categories: secondaryIds,

            image: initialValues.image
                ? [
                    {
                        uid: "-1",
                        name: "image",
                        status: "done",
                        url: initialValues.image
                    }
                ]
                : [],

            images:
                initialValues.images?.map(
                    (img, index) => ({
                        uid: `-${index}`,
                        name: `image-${index}`,
                        status: "done",
                        url: img
                    })
                ) || []
        });

        if (initialValues.primary_category_id) {

            loadSubCategories(
                initialValues.primary_category_id
            );
        }

    }, [initialValues, form]);

    // ================= FILE FORMAT =================

    const normFile = (e) => {

        if (Array.isArray(e)) return e;

        return e?.fileList || [];
    };

    // ================= SUBMIT =================

    const handleOk = async () => {

        try {

            const values =
                await form.validateFields();

            const payload = {

                ...values,

                imageFile:
                    values.image?.[0]
                        ?.originFileObj || null,

                imageOld:
                    values.image?.[0]?.url || null,

                imageFiles:
                    values.images
                        ?.filter(
                            item =>
                                item.originFileObj
                        )
                        .map(
                            item =>
                                item.originFileObj
                        ) || [],

                imageUrls:
                    values.images
                        ?.filter(
                            item => item.url
                        )
                        .map(
                            item => item.url
                        ) || []
            };

            onSubmit(payload);

        } catch (err) {

            console.log(err);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            width={1000}
            destroyOnClose
            title={
                initialValues
                    ? "Cập nhật sản phẩm"
                    : "Tạo sản phẩm"
            }
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={16}>

                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Nhập tên sản phẩm"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="price"
                            label="Giá"
                        >
                            <InputNumber
                                style={{
                                    width: "100%"
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="sale_price"
                            label="Giá bán"
                        >
                            <InputNumber
                                min={0}
                                style={{
                                    width: "100%"
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="count_in_stock"
                            label="Tồn kho"
                        >
                            <InputNumber
                                style={{
                                    width: "100%"
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="primary_category_id"
                            label="Danh mục chính"
                        >
                            <Select
                                placeholder="Chọn danh mục chính"
                                onChange={
                                    handlePrimaryChange
                                }
                                options={categories
                                    .filter(
                                        c =>
                                            !c.parent_id
                                    )
                                    .map(c => ({
                                        label: c.name,
                                        value: c.id
                                    }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="secondary_categories"
                            label="Danh mục phụ"
                        >
                            <Select
                                mode="multiple"
                                placeholder={
                                    subCategories.length
                                        ? "Chọn danh mục phụ"
                                        : "Vui lòng chọn danh mục chính trước"
                                }
                                disabled={
                                    !subCategories.length
                                }
                                options={subCategories.map(
                                    c => ({
                                        label: c.name,
                                        value: c.id
                                    })
                                )}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Loại sản phẩm"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                        >
                            <Select
                                options={[
                                    {
                                        value: "active",
                                        label:
                                            "Đang bán"
                                    },
                                    {
                                        value: "inactive",
                                        label:
                                            "Ngừng bán"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="image"
                            label="Ảnh chính"
                            valuePropName="fileList"
                            getValueFromEvent={
                                normFile
                            }
                        >
                            <Upload
                                beforeUpload={() => false}
                                maxCount={1}
                                listType="picture"
                            >
                                <Button
                                    icon={
                                        <UploadOutlined />
                                    }
                                >
                                    Chọn ảnh
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="images"
                            label="Ảnh phụ"
                            valuePropName="fileList"
                            getValueFromEvent={
                                normFile
                            }
                        >
                            <Upload
                                beforeUpload={() => false}
                                multiple
                                listType="picture"
                            >
                                <Button
                                    icon={
                                        <UploadOutlined />
                                    }
                                >
                                    Chọn nhiều ảnh
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                        >
                            <Input.TextArea
                                rows={5}
                            />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    );
};

export default ProductForm;