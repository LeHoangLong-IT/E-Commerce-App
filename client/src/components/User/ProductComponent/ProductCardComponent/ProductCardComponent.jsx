import {
    Card,
    Tag,
    Rate,
    Progress
} from "antd";

import {
    ShoppingCartOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import "./ProductCardComponent.scss"

const ProductCardComponent = ({ product }) => {

    const navigate = useNavigate();

    const price = Number(product.price || 0);
    const salePrice = Number(product.sale_price || 0);

    const discount =
        price > 0
            ? Math.round(
                ((price - salePrice) / price) * 100
            )
            : 0;



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
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <ShoppingCartOutlined />
                </span>,

                <span
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <ThunderboltOutlined />
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
        </Card>
    );
};

export default ProductCardComponent;