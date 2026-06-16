import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag
} from "antd";
import {
    ShoppingCartOutlined,
    AppstoreOutlined,
    DollarOutlined,
    UserOutlined
} from "@ant-design/icons";

const DashboardPage = () => {

    const latestOrders = [
        {
            id: 1001,
            customer: "Nguyễn Văn A",
            total: 250000,
            status: "pending"
        },
        {
            id: 1002,
            customer: "Trần Văn B",
            total: 500000,
            status: "completed"
        }
    ];

    const lowStockProducts = [
        {
            id: 1,
            name: "Acc Liên Minh VIP",
            stock: 3
        },
        {
            id: 2,
            name: "Acc Valorant",
            stock: 2
        }
    ];

    return (
        <div>

            <h2
                style={{
                    marginBottom: 24
                }}
            >
                Dashboard
            </h2>

            {/* KPI */}

            <Row gutter={[16, 16]}>

                <Col xs={24} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={256}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đơn hàng"
                            value={1250}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Khách hàng"
                            value={845}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={125000000}
                            precision={0}
                            prefix={<DollarOutlined />}
                            formatter={(value) =>
                                Number(value).toLocaleString()
                            }
                        />
                    </Card>
                </Col>

            </Row>

            {/* ORDER STATUS */}

            <Row
                gutter={[16, 16]}
                style={{
                    marginTop: 16
                }}
            >

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Chờ xử lý"
                            value={15}
                            valueStyle={{
                                color: "#faad14"
                            }}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Hoàn thành"
                            value={350}
                            valueStyle={{
                                color: "#52c41a"
                            }}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Đã hủy"
                            value={12}
                            valueStyle={{
                                color: "#ff4d4f"
                            }}
                        />
                    </Card>
                </Col>

            </Row>

            {/* CHART PLACEHOLDER */}

            <Row
                gutter={[16, 16]}
                style={{
                    marginTop: 16
                }}
            >
                <Col span={16}>
                    <Card title="Doanh thu 7 ngày gần nhất">
                        <div
                            style={{
                                height: 300,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#999"
                            }}
                        >
                            Revenue Chart
                        </div>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Top sản phẩm bán chạy">
                        <p>Acc Liên Minh #1</p>
                        <p>Acc Valorant #2</p>
                        <p>Netflix Premium #3</p>
                        <p>YouTube Premium #4</p>
                    </Card>
                </Col>
            </Row>

            {/* TABLES */}

            <Row
                gutter={[16, 16]}
                style={{
                    marginTop: 16
                }}
            >
                <Col span={14}>
                    <Card title="Đơn hàng mới nhất">
                        <Table
                            rowKey="id"
                            size="small"
                            pagination={false}
                            dataSource={latestOrders}
                            columns={[
                                {
                                    title: "Mã",
                                    dataIndex: "id"
                                },
                                {
                                    title: "Khách hàng",
                                    dataIndex: "customer"
                                },
                                {
                                    title: "Tổng tiền",
                                    dataIndex: "total",
                                    render: value =>
                                        value.toLocaleString()
                                },
                                {
                                    title: "Trạng thái",
                                    dataIndex: "status",
                                    render: status => (
                                        <Tag
                                            color={
                                                status === "completed"
                                                    ? "green"
                                                    : "orange"
                                            }
                                        >
                                            {status}
                                        </Tag>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>

                <Col span={10}>
                    <Card title="Sản phẩm sắp hết hàng">
                        <Table
                            rowKey="id"
                            size="small"
                            pagination={false}
                            dataSource={lowStockProducts}
                            columns={[
                                {
                                    title: "Tên sản phẩm",
                                    dataIndex: "name"
                                },
                                {
                                    title: "Tồn kho",
                                    dataIndex: "stock",
                                    render: stock => (
                                        <Tag color="red">
                                            {stock}
                                        </Tag>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default DashboardPage;