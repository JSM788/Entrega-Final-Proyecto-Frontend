import { Typography } from "@material-tailwind/react"
import { useContextGlobal } from "../Components/utils/global.context"
import { VehicleCard } from "./VehicleCard"

const VehicleList = () => {
  const { state } = useContextGlobal()
  return (
    <>
      <div className="text-left pl-5 pt-4 mx-auto max-w-[1113px]">
        <Typography variant="h4">Productos</Typography>
      </div>
      <div
        className="mx-auto max-w-[1113px]
                    grid gap-6 p-4 
                    grid-cols-1 
                    sm:grid-cols-1 
                    lg:grid-cols-2"
      >
        {state.vehicles
          .sort(() => Math.random() - 0.5)
          .map((vehicle) => (
            <VehicleCard
              key={vehicle.productId}
              vehicle={vehicle}
              state={state}
            />
          ))}
      </div>
    </>
  )
}
export { VehicleList }
