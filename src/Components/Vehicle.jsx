import { Typography } from "@material-tailwind/react";
import { useContextGlobal } from "../Components/utils/global.context";
import { VehicleCard } from "./VehicleCard";
import axios from "axios";
import { useEffect, useState } from "react";

export const VehicleList = () => {
  const { state, dispatch } = useContextGlobal();
  const [vehicleList, setVehicleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    // Solo intentamos obtener los favoritos si el usuario está autenticado
    if (state.isAuth && state.user && state.user.id) {
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
      } catch (error) {
        console.error("Hubo un error al traer favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setVehicleList([]);
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_FILTERED_VEHICLES", payload: state.vehicles });
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [state.isAuth, state.user.id, state.accessToken]);

  const handleClearSearch = () => {
    dispatch({ type: "SET_FILTERED_VEHICLES", payload: state.vehicles }); // Reinicia la lista filtrada
  };
  return (
    <>
      <div className="text-left pl-5 pt-4 mx-auto max-w-[1113px]">
        <Typography variant="h4">Productos</Typography>
      </div>
      {state.isLoadingVehicles || isLoading ? (
        <div className="text-center py-6">
          <Typography variant="h6">Cargando...</Typography>
        </div>
      ) : state.filteredVehicles.length === 0 ? (
        <div className="text-center py-6">
          <Typography variant="h6" className="text-gray-600">
            No se encuentran vehículos disponibles para la búsqueda realizada.
          </Typography>
          {/* 
          <button
            onClick={handleClearSearch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Limpiar búsqueda
          </button>
          */}
        </div>
      ) : (
        <>
          {/* 
          {state.filteredVehicles.length !== state.vehicles.length && (
            <div className="text-right py-2 pr-5">
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
            */}
          <div
            className="mx-auto max-w-[1113px]
                    grid gap-6 p-4 
                    grid-cols-1 
                    sm:grid-cols-1 
                    lg:grid-cols-2"
          >
            {state.filteredVehicles
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
        </>
      )}
    </>
  );
};
