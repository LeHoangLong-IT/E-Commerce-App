import React from 'react'

const QuickSaleComponent = ({Image}) => {
  return (
    <div className="card card-rounded rounded-4 card-animate">
        <img src={Image} alt="" className='rounded-4' />
    </div>
  )
}

export default QuickSaleComponent