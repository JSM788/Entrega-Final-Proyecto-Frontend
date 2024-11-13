import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { PencilIcon } from "@heroicons/react/24/solid"
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react"
import { useEffect, useState } from "react"

const TABLE_HEAD = [
  "ID",
  "Vehículo",
  "Categoría",
  "Año",
  "Precio por hora",
  "Acciones",
]

// Datos ficticios de vehículos
const VEHICLE_DATA = [
  {
    id: "VH001",
    name: "Toyota Prius",
    img: "https://via.placeholder.com/40",
    category: "Carros",
    year: 2020,
    price: "$20/hora",
  },
  {
    id: "VH002",
    name: "Tesla Model 3",
    img: "https://via.placeholder.com/40",
    category: "Carros",
    year: 2022,
    price: "$35/hora",
  },
  {
    id: "VH003",
    name: "Nissan Leaf",
    img: "https://via.placeholder.com/40",
    category: "Carros",
    year: 2019,
    price: "$25/hora",
  },
];

// Hook personalizado para verificar si el dispositivo es móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajusta el tamaño según tus necesidades
    };

    // Chequear el tamaño inicial y añadir event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const AdminVehicles = () => {
  const [vehicleData, setVehicleData] = useState({
    name: "",
    category: "",
    year: "",
    price: "",
    img: "",
  });

  const [vehicleList, setVehicleList] = useState(VEHICLE_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVehicle = {
      id: `VH00${vehicleList.length + 1}`, // Generar un nuevo ID automáticamente
      ...vehicleData, // Usar directamente vehicleData
    };

    setVehicleList([...vehicleList, newVehicle]);
    console.log("Vehicle added:", newVehicle);
    setVehicleData({ name: "", category: "", year: "", price: "", img: "" }); // Reset form
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Acceso no disponible
          </h2>
          <p className="text-gray-700">
            La página de administración no está disponible en dispositivos
            móviles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="w-1/3">
        <Card className="h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <Typography variant="h5" color="blue-gray">
              Agregar Vehículo
            </Typography>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {['name', 'category', 'year', 'price', 'img'].map((field, index) => (
                <div key={index}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 text-left">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace("img", "URL de Imagen")}
                  </label>
                  <input
                    name={field}
                    type={field === 'year' || field === 'price' ? 'number' : 'text'}
                    value={vehicleData[field]}
                    onChange={handleInputChange}
                    required
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder={`Ingrese ${field === 'img' ? 'la URL de la imagen' : field}`}
                  />
                </div>
              ))}
              <Button type="submit" variant="filled">
                Agregar
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
      <div className="flex-1">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <Typography variant="h5" color="blue-gray">
              Lista de Vehículos
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Información sobre todos los vehículos
            </Typography>
          </CardHeader>
          <CardBody className="overflow-auto px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                        {head}
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleList.map(({ id, name, img, category, year, price }, index) => {
                  const isLast = index === vehicleList.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">{id}</Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography variant="small" color="blue-gray" className="font-normal">{name}</Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">{category}</Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">{year}</Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">{price}</Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex space-x-2">
                          <Tooltip content="Editar vehículo">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Eliminar vehículo">
                            <IconButton variant="text">
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Page 1 of 10
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm">Previous</Button>
              <Button variant="outlined" size="sm">Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};