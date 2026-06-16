import {
    Modal,
    Row,
    Col,
    Image,
    Tag,
    Card,
    Rate,
    Statistic,
    Space,
    Divider
} from "antd";

const ProductDetail = ({
    open,
    onCancel,
    product
}) => {

    if (!product) return null;

    // ================= PRICE =================

    const price = Number(product.price || 0);

    const salePrice = Number(
        product.sale_price || 0
    );

    const discountPercent =
        price > 0 && salePrice > 0
            ? Math.round(
                ((price - salePrice) / price) * 100
            )
            : 0;

    return (
        <Modal
            open={open}
            footer={null}
            onCancel={onCancel}
            width={1200}
            title={null}
            centered
        >
            <Row gutter={40}>

                {/* ================= LEFT IMAGE ================= */}

                <Col span={10}>
                    <Card
                        bordered={false}
                        style={{
                            boxShadow:
                                "0 2px 12px rgba(0,0,0,0.06)",
                            borderRadius: 12
                        }}
                    >
                        <Image
                            src={product.image}
                            width="100%"
                            style={{
                                borderRadius: 12
                            }}
                        />

                        {product.images?.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginTop: 16,
                                    flexWrap: "wrap"
                                }}
                            >
                                {product.images.map(
                                    (img, index) => (
                                        <Image
                                            key={index}
                                            src={img}
                                            width={80}
                                            height={80}
                                            style={{
                                                objectFit:
                                                    "cover",
                                                borderRadius: 8
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* ================= RIGHT INFO ================= */}

                <Col span={14}>

                    {/* TITLE */}

                    <div>
                        <h1
                            style={{
                                fontSize: 30,
                                fontWeight: 700,
                                marginBottom: 10,
                                lineHeight: 1.4
                            }}
                        >
                            {product.name}
                        </h1>

                        <Space
                            size={24}
                            style={{
                                color: "var(--textSecondary)"
                            }}
                        >
                            <div>
                                <Rate
                                    disabled
                                    value={Number(product.rating || 0)}
                                />

                                <span
                                    style={{
                                        marginLeft: 8
                                    }}
                                >
                                    {product.rating || 0}
                                </span>
                            </div>

                            <span>
                                Đã bán {product.sold || 0}
                            </span>

                            <Tag color="blue">
                                ID #{product.id}
                            </Tag>
                        </Space>
                    </div>

                    {/* PRICE */}

                    <Card
                        style={{
                            marginTop: 24,
                            background: "var(--bgSoft)",
                            borderRadius: 12,
                            border: "none"
                        }}
                    >
                        <Space
                            direction="vertical"
                            size={8}
                            style={{
                                width: "100%"
                            }}
                        >

                            {discountPercent > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12
                                    }}
                                >
                                    <div
                                        style={{
                                            textDecoration:
                                                "line-through",
                                            color: "var(--textSecondary)",
                                            fontSize: 16
                                        }}
                                    >
                                        {price.toLocaleString()} ₫
                                    </div>

                                    <Tag color="red">
                                        -{discountPercent}%
                                    </Tag>
                                </div>
                            )}

                            <div
                                style={{
                                    fontSize: 40,
                                    fontWeight: 700,
                                    color: "#ff424e",
                                    lineHeight: 1
                                }}
                            >
                                {salePrice.toLocaleString()} ₫
                            </div>

                        </Space>
                    </Card>

                    {/* QUICK INFO */}

                    <Row
                        gutter={16}
                        style={{
                            marginTop: 20
                        }}
                    >
                        <Col span={12}>
                            <Card
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                <Statistic
                                    title="Tồn kho"
                                    value={
                                        product.count_in_stock || 0
                                    }
                                />
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                <Statistic
                                    title="Đã bán"
                                    value={
                                        product.sold || 0
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* CATEGORY */}

                    <Card
                        style={{
                            marginTop: 20,
                            borderRadius: 12
                        }}
                    >
                        <Row gutter={[24, 20]}>

                            <Col span={12}>
                                <div
                                    style={{
                                        color: "var(--textSecondary)",
                                        marginBottom: 6
                                    }}
                                >
                                    Loại sản phẩm
                                </div>

                                <b>
                                    {product.type ||
                                        "Chưa cập nhật"}
                                </b>
                            </Col>

                            <Col span={12}>
                                <div
                                    style={{
                                        color: "var(--textSecondary)",
                                        marginBottom: 6
                                    }}
                                >
                                    Danh mục chính
                                </div>

                                <Tag color="blue">
                                    {
                                        product
                                            .primary_category
                                            ?.name
                                    }
                                </Tag>
                            </Col>

                            {product.product_categories
                                ?.length > 0 && (
                                <Col span={24}>
                                    <div
                                        style={{
                                            color: "var(--textSecondary)",
                                            marginBottom: 10
                                        }}
                                    >
                                        Danh mục phụ
                                    </div>

                                    <Space wrap>
                                        {product.product_categories.map(
                                            (
                                                item
                                            ) => (
                                                <Tag
                                                    key={
                                                        item.category_id
                                                    }
                                                    color="cyan"
                                                >
                                                    {
                                                        item
                                                            .category
                                                            .name
                                                    }
                                                </Tag>
                                            )
                                        )}
                                    </Space>
                                </Col>
                            )}

                        </Row>
                    </Card>

                </Col>

            </Row>

            {/* DESCRIPTION */}

            <Divider
                orientation="left"
                style={{
                    marginTop: 32
                }}
            >
                Mô tả sản phẩm
            </Divider>

            <div
                style={{
                    padding: "0 10px",
                    lineHeight: 1.8,
                    fontSize: 15,
                    color: "var(--textColor)",
                    whiteSpace: "pre-wrap"
                }}
            >
                {product.description ||
                    "Chưa có mô tả"}
            </div>

        </Modal>
    );
};

export default ProductDetail;