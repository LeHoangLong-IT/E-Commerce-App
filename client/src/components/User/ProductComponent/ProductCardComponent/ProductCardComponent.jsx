import {
    Card,
    Tag,
    Rate,
    Progress,
    notification,
    Modal,
    Button
} from "antd";

import { useState } from "react";

import cartApi from "../../../../api/cartApi";

import {
    ShoppingCartOutlined,
    EyeOutlined,
    CheckCircleFilled
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import "./ProductCardComponent.scss"

const ProductCardComponent = ({ product }) => {

    const navigate = useNavigate();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const price = Number(product.price || 0);
    const salePrice = Number(product.sale_price || 0);

    const discount =
        price > 0
            ? Math.round(
                ((price - salePrice) / price) * 100
            )
            : 0;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                notification.warning({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' });
                navigate('/sign-in');
                return;
            }
            const res = await cartApi.addToCart({
                productId: product.id,
                quantity: 1
            });
            if (res.status === 'OK') {
                notification.open({ 
                    message: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52c41a' }}>
                                <CheckCircleFilled style={{ fontSize: '20px' }} />
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Thêm vào giỏ hàng thành công</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <img src={product.image} alt={product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #f0f0f0', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {product.name}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                        <span style={{ fontSize: '13px', color: '#888' }}>x1</span>
                                        <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '16px' }}>
                                            {salePrice.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                    duration: 3,
                    style: { width: 380, padding: '16px' }
                });
            } else {
                notification.error({ message: res.message || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            notification.error({ message: error.response?.data?.message || 'Có lỗi xảy ra' });
        }
    };

    return (
        <Card

            hoverable={false}
            className="product-card"
            bodyStyle={{
                padding: 12
            }}
            onClick={() =>
                navigate(`/product/${product.slug}`)
            }
            cover={
                <div
                    style={{
                        position: "relative"
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: "100%",
                            height: 240,
                            objectFit: "cover"
                        }}
                    />

                    {/* DISCOUNT */}

                    {discount > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                background: "#ff424e",
                                color: "#fff",
                                padding: "6px 10px",
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: 13
                            }}
                        >
                            -{discount}%
                        </div>
                    )}
                </div>
            }
            actions={[
                <span
                    onClick={handleAddToCart}
                >
                    <ShoppingCartOutlined />
                </span>,

                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickViewOpen(true);
                    }}
                >
                    <EyeOutlined />
                </span>
            ]}
        >
            {/* CATEGORY */}

            <div
                style={{
                    marginBottom: 8
                }}
            >
                <Tag color="blue">
                    {product.primary_category?.name}
                </Tag>
            </div>

            {/* TITLE */}

            <div
                style={{
                    height: 48,
                    overflow: "hidden",
                    fontSize: 14,
                    lineHeight: "24px",
                    fontWeight: 500,
                    color: "var(--textColor)"
                }}
            >
                {product.name}
            </div>

            {/* PRICE */}

            <div
                style={{
                    marginTop: 12
                }}
            >
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#ff424e"
                    }}
                >
                    {salePrice.toLocaleString("vi-VN")}₫
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4
                    }}
                >
                    <Tag color="red">
                        -{discount}%
                    </Tag>

                    <span
                        style={{
                            color: "var(--textSecondary)",
                            textDecoration:
                                "line-through"
                        }}
                    >
                        {price.toLocaleString("vi-VN")}₫
                    </span>
                </div>
            </div>

            {/* RATING + SOLD */}

            <div
                style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center"
                }}
            >
                <Rate
                    disabled
                    allowHalf
                    value={Number(product.rating)}
                    style={{
                        fontSize: 12
                    }}
                />

                <span
                    style={{
                        color: "var(--textSecondary)",
                        fontSize: 12
                    }}
                >
                    Đã bán {product.sold}
                </span>
            </div>


            {/* STOCK */}

            <div
                style={{
                    marginTop: 8,
                    color:
                        product.count_in_stock > 10
                            ? "#52c41a"
                            : "#faad14",
                    fontSize: 12
                }}
            >
                Còn {product.count_in_stock} sản phẩm
            </div>

            <Modal
                title="Xem Nhanh Sản Phẩm"
                open={isQuickViewOpen}
                onCancel={(e) => {
                    e.stopPropagation();
                    setIsQuickViewOpen(false);
                }}
                footer={null}
                centered
                width={600}
            >
                <div style={{ display: 'flex', gap: '20px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{product.name}</h3>
                        <div style={{ marginBottom: '8px' }}>
                            <Tag color="blue">{product.primary_category?.name}</Tag>
                            <Rate disabled allowHalf value={Number(product.rating)} style={{ fontSize: 12, marginLeft: '8px' }} />
                        </div>
                        <div style={{ color: '#ff424e', fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                            {salePrice.toLocaleString("vi-VN")}₫
                        </div>
                        <p style={{ color: 'var(--textSecondary)', marginBottom: '8px' }}>
                            Đã bán {product.sold} | Còn {product.count_in_stock} sản phẩm
                        </p>
                        {product.description && (
                            <p style={{ 
                                fontSize: '13px', 
                                color: '#666', 
                                display: '-webkit-box', 
                                WebkitLineClamp: 2, 
                                WebkitBoxOrient: 'vertical', 
                                overflow: 'hidden' 
                            }}>
                                {product.description.replace(/(<([^>]+)>)/gi, "")}
                            </p>
                        )}
                        <Button type="primary" danger onClick={handleAddToCart} style={{ marginTop: '15px', height: '40px', width: '100%', fontSize: '16px' }}>
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default ProductCardComponent;