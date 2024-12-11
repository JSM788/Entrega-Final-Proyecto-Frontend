import { useContextGlobal } from "../../Components/utils/global.context.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { VehicleCard } from "../VehicleCard.jsx";
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export const FavoritesProducts = () => {
  const { state } = useContextGlobal();
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/api/favorites/${state.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setVehicleList(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Hubo un error al traer favoritos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveVehicle = (vehicleId) => {
    // Filtrar el vehículo eliminado de la lista
    setVehicleList((prevVehicles) =>
      prevVehicles.filter((vehicle) => vehicle.productId !== vehicleId)
    );
  };

  // Filtramos la lista de vehículos para que solo contenga los favoritos
  const filteredVehicles = state.vehicles.filter((vehicle) =>
    vehicleList.some((favorite) => favorite.productId === vehicle.productId)
  );

  return (
    <div className="h-[70vh]">
      <header className="m-auto flex sm:flex-row flex-col items-start sm:items-center py-4 px-7 w-full">
        <Button
          size="sm"
          variant="text"
          className="flex items-center justify-end"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6 text-deepTeal" />
        </Button>
        <h1 className="font-semibold text-lg sm:text-xl">
          VEHÍCULOS FAVORITOS
        </h1>
      </header>
      <div
        className="mx-auto w-full max-w-[1113px]
                  grid gap-10 p-4 
                  grid-cols-1 
                  sm:grid-cols-1 
                  lg:grid-cols-3"
      >
        {state.isLoadingVehicles || loading ? (
          <p>Cargando tus favoritos...</p>
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.productId}
              vehicle={vehicle}
              state={state}
              favoriteList={vehicleList}
              onRemoveVehicle={handleRemoveVehicle}
            />
          ))
        ) : (
          <p>No tienes vehículos favoritos aún.</p>
        )}
      </div>
    </div>
  );
};
