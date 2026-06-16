import { useEffect, useState } from "react";

import {
    Row,
    Col,
    Empty,
    Skeleton
} from "antd";

import ProductCardComponent from "../ProductCardComponent/ProductCardComponent";

import productApi from "../../../../api/productApi";

const ProductListComponent = ({
    selectedCategory
}) => {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        try {

            const res =
                await productApi.getAll();

            setProducts(
                res.data || []
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    let filteredProducts =
        [...products];

    // lọc category cha

    if (
        selectedCategory &&
        selectedCategory.type ===
        "parent"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.primary_category_id ===
                    selectedCategory.id
            );
    }

    // lọc category con

    if (
        selectedCategory &&
        selectedCategory.type ===
        "child"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.product_categories?.some(
                        item =>
                            item.category_id ===
                            selectedCategory.id
                    )
            );
    }

    if (loading) {
        return <Skeleton active />;
    }

    if (
        !loading &&
        filteredProducts.length === 0
    ) {
        return (
            <Empty
                description="Không có sản phẩm"
            />
        );
    }

    return (
        <Row gutter={[16, 16]}>

            {filteredProducts.map(
                product => (

                    <Col
                        key={product.id}
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        xl={6}
                    >
                        <ProductCardComponent
                            product={product}
                        />
                    </Col>

                )
            )}

        </Row>
    );
};

export default ProductListComponent;