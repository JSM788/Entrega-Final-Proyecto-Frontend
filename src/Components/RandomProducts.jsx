import React from 'react'
import Product from './Product.jsx'
import { useContextGlobal } from '../Components/utils/global.context'


const RandomProducts = () => {
  const {state} = useContextGlobal();
  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
        {         
        state.vehicles
          .sort(() => Math.random() - 0.5)
          .map( (vehicle)=> (
            <Product key={vehicle.productId} vehicle={vehicle} />
        ))
        }

      </div>
    </div>
  )
}

export default RandomProducts
