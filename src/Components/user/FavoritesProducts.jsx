import { TrashIcon } from "@heroicons/react/24/outline"
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  IconButton,
} from "@material-tailwind/react"
import Swal from "sweetalert2"
import { useContextGlobal } from "../../Components/utils/global.context.jsx"
import { useEffect, useState } from "react"
import axios from "axios"

const TABLE_HEAD = ["ID", "Título", "Descripción", "Acciones"]
// const mockvehicleList = [
//   {
//     productId: 1,
//     title: "Scooter",
//     description: "Categoría relacionada con gadgets y software.",
//     imageUrl: "https://via.placeholder.com/50",
//   },
//   {
//     productId: 2,
//     title: "Motos",
//     description: "Recursos y cursos educativos.",
//     imageUrl: "https://via.placeholder.com/50",
//   },
//   {
//     productId: 3,
//     title: "Autos",
//     description: "Todo sobre deportes y actividades físicas.",
//     imageUrl: "https://via.placeholder.com/50",
//   },
// ];

export const FavoritesProducts = () => {
  const [vehicleList, setVehicleList] = useState([])
  const { state } = useContextGlobal()

  // useEffect(() => {
  //   console.log("Productos en el contexto global:", mockvehicleList);//pintarlos del GET API
  //   // setVehicleList(mockvehicleList || []);
  // }, [mockvehicleList]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/favorites/${state.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        console.log("Favoritos: ", response.data)
        setVehicleList(response.data || [])
      }
    } catch (error) {
      console.error("Hubo un error al traer favoritos:", error)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleDeleteVehicle = async (productId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#32CEB1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/favorites/${state.user.id}/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.accessToken}`, // Agregar token de autenticación
            },
          }
        );
  
        // Verifica que la respuesta sea exitosa
        if (response.status === 200) {
          // Actualiza la lista de vehículos eliminando el vehículo
          setVehicleList(vehicleList.filter((vehicle) => vehicle.productId !== productId));
  
          // Muestra el mensaje de éxito
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: "El vehículo ha sido eliminado de favoritos.",
            confirmButtonColor: "#32CEB1",
          });
        } else {
          // Muestra mensaje de error si la respuesta no fue exitosa
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el vehículo de favoritos.",
            confirmButtonColor: "#32CEB1",
          });
        }
      } catch (error) {
        // Muestra el mensaje de error en caso de que falle la solicitud
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el vehículo de favoritos.",
          confirmButtonColor: "#32CEB1",
        });
        console.error("Error en la solicitud:", error);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10">
      <Card className="w-full max-w-4xl">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none text-center"
        >
          <h1 className="font-semibold text-lg sm:text-xl">
            Lista de Favoritos
          </h1>
          <h2 className="mt-1 font-normal text-sm sm:text-base">
            Información sobre todos los favoritos
          </h2>
        </CardHeader>

        <CardBody className="overflow-hidden px-2 sm:px-4">
          {/* Tabla para pantallas medianas o más grandes */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="mt-4 w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-sm"
                    >
                      <span className="font-normal leading-none opacity-70">
                        {head}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleList.map((vehicle, index) => {
                  const isLast = index === vehicleList.length - 1
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50"

                  return (
                    <tr key={vehicle.productId}>
                      <td className={classes}>
                        <p className="font-normal">{index + 1}</p>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={vehicle.productImage}
                            alt={vehicle.productName}
                            size="sm"
                            className="rounded-full border border-aquaTeal"
                          />
                          <p className="font-normal">{vehicle.productName}</p>
                        </div>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">
                          {vehicle.productDescription}
                        </p>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Eliminar favorito">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              handleDeleteVehicle(vehicle.productId)
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="block sm:hidden">
            {vehicleList.map((vehicle) => (
              <div
                key={vehicle.productId}
                className="mb-4 border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={vehicle.imageUrl}
                    alt={vehicle.productName}
                    size="md"
                    className="rounded-full border border-aquaTeal"
                  />
                  <div>
                    <h3 className="text-sm font-medium">
                      {vehicle.productName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {vehicle.productDescription}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Tooltip content="Eliminar favorito">
                    <IconButton
                      variant="text"
                      onClick={() => handleDeleteVehicle(vehicle.productId)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
