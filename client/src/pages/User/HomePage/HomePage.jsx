import SliderComponent from "../../../components/User/SliderComponent/SliderComponent"
import Slider1 from "../../../assets/images/sliders/Slider1.webp"
import Slider2 from "../../../assets/images/sliders/Slider2.webp"
import Slider3 from "../../../assets/images/sliders/Slider3.webp"
import Slider4 from "../../../assets/images/sliders/Slider4.webp"

import QuickSale1 from "../../../assets/images/quicksales/a17-a07-sp-hot.webp"
import QuickSale2 from "../../../assets/images/quicksales/web-poco-m7.webp"
import QuickSale3 from "../../../assets/images/quicksales/sanphamhot2-x6c.webp"
import QuickSale4 from "../../../assets/images/quicksales/iphone-17e-sp-hot_639082569936454383.webp"


import { Col, Row, Card } from 'antd';

import "./HomePage.scss"
import ProductListComponent from "../../../components/User/ProductComponent/ProductListComponent/ProductListComponent"
import QuickSaleComponent from "../../../components/User/QuickSaleComponent/QuickSaleComponent"


const HomePage = ({
    selectedCategory
}) => {
  return (
    <>
      {/* Slider */}
      <div className="card p-4 card-rounded main-bg">
        <SliderComponent arrImages={[Slider1, Slider2, Slider3, Slider4]} />
      </div>

      {/* QuickSale */}
      <Row gutter={[10, 10]} className="mt-3">
        <Col xs={12} sm={12} md={6} lg={6}>
          <QuickSaleComponent Image={QuickSale1} />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <QuickSaleComponent Image={QuickSale2} />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <QuickSaleComponent Image={QuickSale3} />
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <QuickSaleComponent Image={QuickSale4} />
        </Col>
      </Row>


      <div className="main-bg card p-4 card-rounded rounded-4 mt-3">
        <h4 className="main-title">Dành cho bạn</h4>

        <ProductListComponent
          selectedCategory={
            selectedCategory
          }
        />
      </div>
    </>
  )
}

export default HomePage