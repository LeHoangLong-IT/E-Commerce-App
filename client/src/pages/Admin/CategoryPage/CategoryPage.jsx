import { useEffect, useState } from "react";
import {
    Card,
    Table,
    Form,
    Input,
    Button,
    Select,
    Space,
    Popconfirm,
    Drawer,
    Tag
} from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOutlined,
    TagOutlined,
} from "@ant-design/icons";

import categoryApi from "../../../api/categoryApi";

const CategoryPage = () => {

    const [categories, setCategories] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState(null);
    const [parentTemp, setParentTemp] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const buildTree = (list, parentId = null) => {
        return list
            .filter(item => item.parent_id === parentId)
            .map(item => ({
                ...item,
                children: buildTree(list, item.id)
            }));
    };

    const fetchData = async () => {
        const res = await categoryApi.getAll();
        const data = res.data;

        setCategories(data);
        setTreeData(buildTree(data));
    };

    const openCreate = (parent = null) => {
        setEditing(null);
        setParentTemp(parent);

        form.resetFields();
        form.setFieldsValue({
            parent_id: parent ? parent.id : null
        });

        setOpen(true);
    };

    const openEdit = (record) => {
        setEditing(record);
        setParentTemp(null);

        form.setFieldsValue({
            name: record.name,
            parent_id: record.parent_id || null
        });

        setOpen(true);
    };

    const handleSubmit = async (values) => {
        if (editing) {
            await categoryApi.update(editing.id, values);
        } else {
            await categoryApi.create(values);
        }

        setOpen(false);
        setEditing(null);
        form.resetFields();
        fetchData();
    };

    const handleDelete = async (id) => {
        await categoryApi.delete(id);
        fetchData();
    };

    const columns = [
        {
            title: "Category",
            render: (_, record) => (
                <Space>
                    {record.parent_id ? (
                        <Tag color="green" icon={<TagOutlined />}>
                        </Tag>
                    ) : (
                        ""
                    )}

                    <span
                        style={{
                            fontWeight: record.parent_id ? 400 : 600
                        }}
                    >
                        {record.name}
                    </span>
                </Space>
            )
        },
        {
            title: "Actions",
            width: 200,
            render: (_, record) => (
                <Space>

                    {/* edit */}
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openEdit(record)}
                    />

                    {/* delete */}
                    <Popconfirm
                        title="Delete category?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>

                    

                    {/* add child */}
                    {!record.parent_id && (
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => openCreate(record)}
                        />
                    )}

                </Space>
            )
        }
    ];

    return (
        <Card
            title="Category Management"
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openCreate(null)}
                >
                    Add Category
                </Button>
            }
        >
            {/* TABLE TREE */}
            <Table
                rowKey="id"
                dataSource={treeData}
                columns={columns}
                pagination={false}
                expandable={{
                    childrenColumnName: "children",
                    defaultExpandAllRows: true
                }}
            />

            {/* DRAWER FORM */}
            <Drawer
                title={editing ? "Edit Category" : "Create Category"}
                open={open}
                onClose={() => setOpen(false)}
                width={420}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>

                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        name="parent_id"
                        label="Parent Category"
                    >
                        <Select
                            allowClear
                            placeholder="Root category"
                            options={categories.map(c => ({
                                label: c.name,
                                value: c.id
                            }))}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        {editing ? "Update" : "Create"}
                    </Button>

                </Form>
            </Drawer>
        </Card>
    );
};

export default CategoryPage;