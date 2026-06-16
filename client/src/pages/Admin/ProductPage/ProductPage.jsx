import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Image
} from "antd";

import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import productApi from "../../../api/productApi";
import uploadApi from "../../../api/uploadApi";

const ProductPage = () => {

    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await productApi.getAll();
            setProducts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= UPLOAD SINGLE FILE =================

    const uploadSingleFile = async (file) => {

        if (!file) return null;

        const formData = new FormData();

        formData.append("image", file);

        const res = await uploadApi.upload(formData);

        return res.data.url;
    };

    // ================= UPLOAD MULTIPLE FILE =================

    const uploadMultipleFiles = async (files = []) => {

        if (!files.length) return [];

        const urls = await Promise.all(
            files.map(async (file) => {

                const formData = new FormData();

                formData.append("image", file);

                const res = await uploadApi.upload(formData);

                return res.data.url;
            })
        );

        return urls;
    };

    // ================= CREATE + UPDATE =================

    const handleSubmit = async (values) => {


        console.log(values.imageFile);
        console.log(values.imageFiles);

        try {

            setLoading(true);

            let mainImage = values.imageOld || null;

            let galleryImages = values.imageUrls || [];

            // upload ảnh chính mới
            if (values.imageFile) {
                mainImage = await uploadSingleFile(
                    values.imageFile
                );
            }

            // upload ảnh phụ mới
            if (values.imageFiles?.length) {

                const newGalleryImages =
                    await uploadMultipleFiles(
                        values.imageFiles
                    );

                galleryImages = [
                    ...galleryImages,
                    ...newGalleryImages
                ];
            }

            const payload = {
                ...values,

                image: mainImage,

                images: galleryImages
            };

            delete payload.imageFile;
            delete payload.imageFiles;
            delete payload.imageOld;
            delete payload.imageUrls;

            if (editingProduct) {

                await productApi.update(
                    editingProduct.id,
                    payload
                );

                message.success(
                    "Cập nhật sản phẩm thành công"
                );

            } else {

                await productApi.create(payload);

                message.success(
                    "Tạo sản phẩm thành công"
                );
            }

            setOpen(false);
            setEditingProduct(null);

            fetchProducts();

        } catch (err) {

            console.log(err);

            message.error(
                err?.response?.data?.message ||
                "Có lỗi xảy ra"
            );

        } finally {

            setLoading(false);
        }
    };

    // ================= DELETE =================

    const handleDelete = async (id) => {

        try {

            await productApi.delete(id);

            message.success(
                "Xóa sản phẩm thành công"
            );

            fetchProducts();

        } catch (err) {

            console.log(err);

            message.error(
                "Không thể xóa sản phẩm"
            );
        }
    };

    const columns = [

        {
            title: "ID",
            dataIndex: "id",
            width: 70
        },

        {
            title: "Ảnh",
            dataIndex: "image",
            width: 100,
            render: (image) =>
                image ? (
                    <Image
                        src={image}
                        width={60}
                    />
                ) : "-"
        },

        {
            title: "Tên sản phẩm",
            dataIndex: "name"
        },

        {
            title: "Loại",
            dataIndex: "type"
        },

        {
            title: "Giá",
            dataIndex: "price"
        },

        {
            title: "Tồn kho",
            dataIndex: "count_in_stock"
        },

        {
            title: "Danh mục",
            render: (_, record) =>
                record.primary_category?.name ||
                "-"
        },

        {
            title: "Rating",
            dataIndex: "rating"
        },

        {
            title: "Trạng thái",
            dataIndex: "status"
        },

        {
            title: "Action",

            width: 180,

            render: (_, record) => (
                <Space>
                    <Button
                        onClick={() => {
                            setSelectedProduct(record);
                            setDetailOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingProduct(record);
                            setOpen(true);
                        }}
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete product?"
                        onConfirm={() =>
                            handleDelete(record.id)
                        }
                    >
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>

                </Space>
            )
        }
    ];

    return (
        <>
            <h2>Product List</h2>

            <Button
                type="primary"
                style={{
                    marginBottom: 16
                }}
                onClick={() => {
                    setEditingProduct(null);
                    setOpen(true);
                }}
            >
                + Add Product
            </Button>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={products}
                columns={columns}
            />
            <ProductDetail
                open={detailOpen}
                product={selectedProduct}
                onCancel={() => {
                    setDetailOpen(false);
                    setSelectedProduct(null);
                }}
            />
            <ProductForm
                open={open}
                initialValues={editingProduct}
                onSubmit={handleSubmit}
                onCancel={() => {
                    setOpen(false);
                    setEditingProduct(null);
                }}
            />
        </>
    );
};

export default ProductPage;