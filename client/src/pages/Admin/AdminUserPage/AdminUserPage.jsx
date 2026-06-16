import { Button, Table, Space, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import * as Api from "../../../api";

const UserPage = () => {
    const [users, setUsers] = useState([]);

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await Api.userApi.getAll();
            setUsers(res);
        } catch (error) {
            console.log(error);
        }
    };

    // CREATE + UPDATE
    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                await Api.userApi.update(editingUser.id, values);
            } else {
                await Api.userApi.create(values);
            }

            setOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await Api.userApi.delete(id);
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
        },
        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingUser(record);
                            setOpen(true);
                        }}
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h2>User List</h2>

            <Button
                type="primary"
                onClick={() => {
                    setEditingUser(null);
                    setOpen(true);
                }}
                style={{ marginBottom: 16 }}
            >
                + Add User
            </Button>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
            />

            <UserForm
                open={open}
                onCancel={() => setOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingUser}
            />
        </>
    );
};

export default UserPage;