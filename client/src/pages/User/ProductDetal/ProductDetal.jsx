import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Breadcrumb, Spin } from 'antd';
import productApi from '../../../api/productApi';
import ProductImageGallery from '../../../components/User/ProductDetal/ProductImageGallery';
import ProductInfo from '../../../components/User/ProductDetal/ProductInfo';
import DeliveryInfo from '../../../components/User/ProductDetal/DeliveryInfo';
import AddToCartBox from '../../../components/User/ProductDetal/AddToCartBox';
import './ProductDetal.scss';

const ProductDetal = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productApi.getBySlug(slug);
        if (res.status === 'OK') {
          setProduct(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm!</div>;
  }

  return (
    <div className="productDetailWrapper">
      <div className="container">
        <Breadcrumb 
          className="breadcrumb"
          items={[
            { title: 'Trang chủ' },
            { title: product?.primary_category?.name || 'Sản phẩm' },
            { title: product.name },
          ]}
        />

        <Row gutter={[16, 16]}>
          {/* Cột trái: Hình ảnh */}
          <Col xs={24} md={8}>
            <ProductImageGallery product={product} />
          </Col>

          {/* Cột giữa: Thông tin sản phẩm & Vận chuyển */}
          <Col xs={24} md={10}>
            <ProductInfo product={product} />
            <DeliveryInfo />
          </Col>

          {/* Cột phải: Seller & Mua hàng */}
          <Col xs={24} md={6}>
            <AddToCartBox product={product} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetal;