import SliderComponent from "../../components/Elements/SliderComponent/SliderComponent"
import Slider1 from "../../assets/images/sliders/Slider1.webp"
import Slider2 from "../../assets/images/sliders/Slider2.webp"
import Slider3 from "../../assets/images/sliders/Slider3.webp"
import Slider4 from "../../assets/images/sliders/Slider4.webp"

import "./HomePage.scss"

const HomePage = () => {
  return (
    <div className="card p-4 card-rounded">
      <SliderComponent arrImages={[Slider1, Slider2, Slider3, Slider4]} />
    </div>
  )
}

export default HomePage