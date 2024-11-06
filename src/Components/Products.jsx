import React from "react";
import styles from "../Components/Styles/Products.module.css";
import carsData from "../assets/cars.json";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
const Products = () => {
  const cars = [...carsData];
  shuffleArray(cars);
  return (
    <>
      <div className={styles.container}>
        {cars.map((car) => (
          <Card
            key={car.modelo}
            className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader color="blue-gray" className="relative h-56">
              <img
                src={car.imagen} // Cambia esto para usar la imagen del carro
                alt={car.modelo}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </CardHeader>
            <CardBody className="p-4 flex flex-col items-center text-center">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2 font-semibold"
              >
                {car.modelo}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Categoría: {car.categoria}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Precio por día: ${car.precio_por_día}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Capacidad: {car.capacidad_pasajeros} pasajeros
              </Typography>
              <Typography className="text-gray-800">
                {car.descripcion}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button color="blue" className="w-full">
                Leer más
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Products;
