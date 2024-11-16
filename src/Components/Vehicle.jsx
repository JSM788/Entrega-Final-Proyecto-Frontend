import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import AutoBlack from "../assets/icons/auto-black.svg";
import dolar from "../assets/icons/dolar.svg";
import { useContextGlobal } from "../Components/utils/global.context";
import { Link } from "react-router-dom";
import { HeartIcon as FilledHeart } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";

export const VehicleCard = (props) => {
  const vehicle = props.vehicle;
  console.log(vehicle);
  const [isFavorite, setIsFavorite] = useState(false);
  const { state } = useContextGlobal();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aquí puedes manejar la lógica para actualizar el estado en el backend o en el contexto global si es necesario
  };

  return (
    <Card className="p-4 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-2">
        <div className="flex justify-center w-full">
          <Typography
            variant="h6"
            color="blue-gray"
            className="text-center font-bold w-full"
          >
            {vehicle.name}
          </Typography>
        </div>

        {/* Mostrar el botón de favorito solo si el usuario está autenticado */}
        {state.isAuth && (
          <button
            onClick={toggleFavorite}
            className="text-red-500 hover:text-red-700"
          >
            {isFavorite ? (
              <FilledHeart className="h-6 w-6" />
            ) : (
              <OutlineHeart className="h-6 w-6" />
            )}
          </button>
        )}
      </div>
      <div className="flex justify-center mb-4">
        <img
          src={vehicle.images[0]?.url}
          alt="Vehículo eléctrico"
          className="h-36 w-full object-contain"
        />
      </div>
      <div className="flex justify-evenly mb-4">
        <Link to={`/product/${vehicle.productId}`}>
          <Button size="sm" color="gray" className="sm:w-52 md:w-72 lg:w-48">
            VER MÁS
          </Button>
        </Link>
        <Button size="sm" className="bg-[#32CEB1] sm:w-52 md:w-72 lg:w-48">
          RESERVAR
        </Button>
      </div>

      <div className="flex justify-around text-gray-600 text-sm">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-4 w-4 mr-4"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
          </svg>
          <Typography variant="small">{vehicle.numberPassengers}</Typography>
        </div>
        <div className="flex items-center">
          <img
            src={AutoBlack}
            alt="Imagen del vehículo eléctrico"
            className="h-4 w-4 mr-3"
          />
          <Typography variant="small">{vehicle.chargeTime}</Typography>
        </div>

        <div className="flex items-center">
          <img
            src={dolar}
            alt="Imagen del vehículo eléctrico"
            className="h-4 w-4 mr-2"
          />
          <Typography variant="small" className="font-bold text-blue-gray-700">
            {vehicle.pricePerHour}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

const VehicleList = () => {
  const { state } = useContextGlobal();
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
            <VehicleCard key={vehicle.productId} vehicle={vehicle} />
          ))}
      </div>
    </>
  );
};
export { VehicleList };
