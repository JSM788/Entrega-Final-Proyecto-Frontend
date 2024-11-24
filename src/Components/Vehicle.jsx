import { Typography } from "@material-tailwind/react";
import { useContextGlobal } from "../Components/utils/global.context";
import { VehicleCard } from "./VehicleCard";
import axios from "axios";
import { useEffect, useState } from "react";

export const VehicleList = () => {
  const { state } = useContextGlobal();
  const [vehicleList, setVehicleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/favorites/${state.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setVehicleList(response.data || []);
      }
    } catch (error) {
      console.error("Hubo un error al traer favoritos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);
  return (
    <>
      <div className="text-left pl-5 pt-4 mx-auto max-w-[1113px]">
        <Typography variant="h4">Productos</Typography>
      </div>
      {isLoading ? (
        <div className="text-center py-6">
          <Typography variant="h6">Cargando...</Typography>
        </div>
      ) : (
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
                favoriteList={vehicleList}
              />
            ))}
        </div>
      )}
    </>
  );
};
