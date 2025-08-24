import React, { useEffect, useState } from "react";
import styles from "../components/Products.module.css";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useContextGlobal } from "../../../app/store/GlobalContext";

const Products = () => {
  const { state } = useContextGlobal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/products/paged?page=${page}&size=10`);
      const data = await response.json();
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        {products.map((product) => (
          <Card
            key={product.productId}
            className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader color="blue-gray" className="relative h-56">
              <img
                src={product.images[0]?.imageUrl} // Use the first image URL
                alt={product.name}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </CardHeader>
            <CardBody className="p-4 flex flex-col items-center text-center">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2 font-semibold"
              >
                {product.name}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Categoría: {product.category?.categoryName}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Precio por día: ${product.price_per_day}
              </Typography>
              <Typography className="text-sm text-gray-600 mb-1">
                Capacidad: {product.number_passengers} pasajeros
              </Typography>
              <Typography className="text-gray-800">
                {product.description}
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
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outlined"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index ? "filled" : "outlined"}
            size="sm"
            onClick={() => handlePageClick(index)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outlined"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
};

export default Products;
