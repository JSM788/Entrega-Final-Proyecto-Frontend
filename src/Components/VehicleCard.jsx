import { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { HeartIcon as FilledHeart } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export const VehicleCard = (props) => {
  const { vehicle, state, favoriteList, onRemoveVehicle } = props;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleRemoveVehicle = () => {
    // Llamar a la función del padre (onRemoveVehicle)
    onRemoveVehicle(vehicle.productId);
  };

  useEffect(() => {
    // Verificamos si el vehículo ya está en la lista de favoritos
    setIsFavorite(
      favoriteList.some((favorite) => favorite.productId === vehicle.productId)
    );
  }, [favoriteList, vehicle.productId]);

  const deleteVehicleFavorites = async (item) => {
    const result = await Swal.fire({
      title: "Eliminar de favoritos",
      html: `¿Desea eliminar <strong>${item.name.toUpperCase()}</strong> de tu lista de favoritos?`,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#32CEB1",
      cancelButtonColor: "#D9534F",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/favorites/${state.user.id}/${vehicle.productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            html: `
              <div style="width: 100%; height: 5px; background-color: #4caf50; margin-bottom: 10px; border-radius:10px;"></div>
              <p class="text-left">"El producto fue eliminado de tu lista de favoritos." </p>
            `,
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: "max-w-sm w-full p-4",
            },
          });
          setIsFavorite(false);
          if (onRemoveVehicle) {
            handleRemoveVehicle();
          }
        } else {
          throw new Error("No se pudo eliminar de favoritos");
        }
      } catch (error) {
        Swal.fire({
          position: "top-end",
          html: `
              <div style="width: 100%; height: 5px; background-color: #D9534F; margin-bottom: 10px; border-radius:10px;"></div>
              <p class="text-left">"Error al eliminar el producto. Por favor, vuelve a intentarlo." </p>
            `,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "max-w-sm w-full p-4",
          },
        });
      }
    }
  };

  const addVehicleToFavorites = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/favorites",

        {
          userId: state.user.id,
          productId: vehicle.productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsFavorite(true);
        Swal.fire({
          position: "top-end",
          html: `
              <div style="width: 100%; height: 5px; background-color: #4caf50; margin-bottom: 10px; border-radius:10px;"></div>
              <p class="text-left">¡Éxito! Ahora está en tus favoritos.</p>
              <p class="text-left">${item.name.toUpperCase()}</p>
            `,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "max-w-sm w-full p-4",
          },
        });
      } else {
        throw new Error("No se pudo agregar a favoritos");
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        html: `
            <div style="width: 100%; height: 5px; background-color: #D9534F; margin-bottom: 10px; border-radius:10px;"></div>
            <p class="text-left">"No se pudo añadir a favoritos. Inténtalo de nuevo."</p>
          `,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "max-w-sm w-full p-4",
        },
      });
    }
  };

  const toggleFavorite = async (vehicle) => {
    if (isFavorite) {
      deleteVehicleFavorites(vehicle);
    } else {
      addVehicleToFavorites(vehicle);
    }
  };

  return (
    <Card
      className="p-4 rounded-[20px] bg-[#f9f9f9] shadow border"
      style={{
        "--tw-border-opacity": 1,
        borderColor: "rgba(98, 91, 113, 0.16)",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-bold w-full uppercase"
          >
            {vehicle.name}
          </Typography>
        </div>

        {/* Mostrar el botón de favorito solo si el usuario está autenticado */}
        {state.isAuth && (
          <button
            onClick={() => toggleFavorite(vehicle)}
            className={`transition-colors duration-300 ${
              isFavorite
                ? "text-red-500 hover:text-red-700"
                : "text-black hover:text-gray-600"
            }`}
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
      <div className="flex justify-evenly gap-3 mb-4">
        <Link to={`/product/${vehicle.productId}`} className="w-full">
          <Button size="sm" color="gray" className="w-full">
            VER MÁS
          </Button>
        </Link>
        <Button size="sm" className="bg-[#32CEB1] w-full">
          RESERVAR
        </Button>
      </div>

      <div className="flex justify-around text-gray-600 text-sm">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 mr-4"
          >
            <path
              d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9542 16.85 17.8625 16.7C17.7708 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5625 14.775 15.3375C13.8583 15.1125 12.9333 15 12 15C11.0667 15 10.1417 15.1125 9.225 15.3375C8.30833 15.5625 7.4 15.9 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.0208 9.80417 13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10Z"
              fill="#2A606E"
            />
          </svg>
          <Typography variant="small" className="text-black font-semibold">
            {vehicle.numberPassengers}
          </Typography>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            className="h-4 w-4 mr-3"
          >
            <path
              d="M3 14.5V15.5C3 15.7833 2.90417 16.0208 2.7125 16.2125C2.52083 16.4042 2.28333 16.5 2 16.5H1C0.716667 16.5 0.479167 16.4042 0.2875 16.2125C0.0958333 16.0208 0 15.7833 0 15.5V7.5L2.1 1.5C2.2 1.2 2.37917 0.958333 2.6375 0.775C2.89583 0.591667 3.18333 0.5 3.5 0.5H14.5C14.8167 0.5 15.1042 0.591667 15.3625 0.775C15.6208 0.958333 15.8 1.2 15.9 1.5L18 7.5V15.5C18 15.7833 17.9042 16.0208 17.7125 16.2125C17.5208 16.4042 17.2833 16.5 17 16.5H16C15.7167 16.5 15.4792 16.4042 15.2875 16.2125C15.0958 16.0208 15 15.7833 15 15.5V14.5H3ZM2.8 5.5H15.2L14.15 2.5H3.85L2.8 5.5ZM4.5 11.5C4.91667 11.5 5.27083 11.3542 5.5625 11.0625C5.85417 10.7708 6 10.4167 6 10C6 9.58333 5.85417 9.22917 5.5625 8.9375C5.27083 8.64583 4.91667 8.5 4.5 8.5C4.08333 8.5 3.72917 8.64583 3.4375 8.9375C3.14583 9.22917 3 9.58333 3 10C3 10.4167 3.14583 10.7708 3.4375 11.0625C3.72917 11.3542 4.08333 11.5 4.5 11.5ZM13.5 11.5C13.9167 11.5 14.2708 11.3542 14.5625 11.0625C14.8542 10.7708 15 10.4167 15 10C15 9.58333 14.8542 9.22917 14.5625 8.9375C14.2708 8.64583 13.9167 8.5 13.5 8.5C13.0833 8.5 12.7292 8.64583 12.4375 8.9375C12.1458 9.22917 12 9.58333 12 10C12 10.4167 12.1458 10.7708 12.4375 11.0625C12.7292 11.3542 13.0833 11.5 13.5 11.5ZM2 12.5H16V7.5H2V12.5Z"
              fill="#2A606E"
            />
          </svg>
          <Typography variant="small" className="text-black font-semibold">
            {vehicle.chargeTime}
          </Typography>
        </div>

        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            className="h-4 w-4 mr-2"
          >
            <path
              d="M4.0252 18V15.85C3.14186 15.65 2.37936 15.2667 1.7377 14.7C1.09603 14.1333 0.625195 13.3333 0.325195 12.3L2.1752 11.55C2.4252 12.35 2.79603 12.9583 3.2877 13.375C3.77936 13.7917 4.4252 14 5.2252 14C5.90853 14 6.4877 13.8458 6.9627 13.5375C7.4377 13.2292 7.6752 12.75 7.6752 12.1C7.6752 11.5167 7.49186 11.0542 7.1252 10.7125C6.75853 10.3708 5.90853 9.98333 4.5752 9.55C3.14186 9.1 2.15853 8.5625 1.6252 7.9375C1.09186 7.3125 0.825195 6.55 0.825195 5.65C0.825195 4.56667 1.1752 3.725 1.8752 3.125C2.5752 2.525 3.29186 2.18333 4.0252 2.1V0H6.0252V2.1C6.85853 2.23333 7.54603 2.5375 8.0877 3.0125C8.62936 3.4875 9.0252 4.06667 9.2752 4.75L7.4252 5.55C7.2252 5.01667 6.94186 4.61667 6.5752 4.35C6.20853 4.08333 5.70853 3.95 5.0752 3.95C4.34186 3.95 3.78353 4.1125 3.4002 4.4375C3.01686 4.7625 2.8252 5.16667 2.8252 5.65C2.8252 6.2 3.0752 6.63333 3.5752 6.95C4.0752 7.26667 4.94186 7.6 6.1752 7.95C7.3252 8.28333 8.19603 8.8125 8.7877 9.5375C9.37936 10.2625 9.6752 11.1 9.6752 12.05C9.6752 13.2333 9.3252 14.1333 8.6252 14.75C7.9252 15.3667 7.05853 15.75 6.0252 15.9V18H4.0252Z"
              fill="#2A606E"
            />
          </svg>
          <Typography variant="small" className="text-black font-semibold">
            {vehicle.pricePerHour}
          </Typography>
        </div>
      </div>
    </Card>
  );
};
