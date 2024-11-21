import { Link } from "react-router-dom"
import { HeartIcon as FilledHeart } from "@heroicons/react/24/solid"
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline"
import axios from "axios"
import { useState } from "react"
import { Card, Typography, Button } from "@material-tailwind/react"
import AutoBlack from "../assets/icons/auto-black.svg"
import dolar from "../assets/icons/dolar.svg"

export const VehicleCard = (props) => {
  const vehicle = props.vehicle
  const state = props.state
  const [isFavorite, setIsFavorite] = useState(false)
  // console.log(state, "state")
  // console.log(state.accessToken, "accessToken")

  const toggleFavorite = async () => {
    // console.log(state, "token")
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`, // Agregar token de autenticación
        },
      }

      if (!isFavorite) {
        // Agregar favorito (POST)
        const response = await axios.post(
          "http://localhost:8080/api/favorites",

          {
            userId: state.user.id,
            productId: vehicle.productId,
          },
          config
        )

        if (response.status === 200 || response.status === 201) {
          setIsFavorite(true)
          console.log("Favorito agregado")
        } else {
          console.error("Error al agregar el favorito")
        }
      } else {
        // Eliminar favorito (DELETE)
        const response = await axios.delete(
          `http://localhost:8080/api/favorites/${state.user.id}/${vehicle.productId}`,
          {
            ...config,
          }
        )

        if (response.status === 200) {
          setIsFavorite(false)
          console.log("Favorito eliminado")
        } else {
          console.error("Error al eliminar el favorito")
        }
      }
    } catch (error) {
      console.error("Error al realizar la operación:", error)
    }
  }

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
  )
}
