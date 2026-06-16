import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderComponent.scss"

const SliderComponent = ({ arrImages }) => {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <Slider  {...settings}>
            {arrImages.map((img, index) => (
                <img key={index} src={img} alt="slider" style={{ width: "100%" }} />
            ))}
        </Slider>
    )
}



export default SliderComponent