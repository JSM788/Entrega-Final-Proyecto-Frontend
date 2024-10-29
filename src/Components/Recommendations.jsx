import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import AutoPlata from "../assets/icons/auto-plata.svg";

export const RecommendationCard = () => {
  return (
    <Card className="w-full max-w-md flex flex-col md:flex-row items-center p-4 border rounded-lg shadow-md">
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-full md:w-1/3 shrink-0 rounded-b-none md:rounded-r-none"
      >
        <img
          src="/public/Car-Brand.png"
          alt="Imagen del vehículo eléctrico"
          className="h-full w-full object-cover rounded-lg"
        />
      </CardHeader>
      <CardBody className="w-full md:w-2/3 pl-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Typography variant="small" color="gray" className="font-bold">
              Camioneta
            </Typography>
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-yellow-900 hidden sm:block"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <Button
            size="sm"
            className="text-xs font-bold bg-[#2A606E]"
            ripple={true}
          >
            4
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h6" color="blue-gray" className="font-bold">
            Modelo X
          </Typography>
          <span className="text-xs text-gray-500">Excelente</span>
        </div>
        <div className="flex items-start">
          <Typography variant="small" color="gray" className="mb-1">
            Autonomía: 300 km
          </Typography>
        </div>

        <div className="flex space-x-4 text-gray-500">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-500"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
            </svg>
            <Typography variant="small" className="ml-1">
              6
            </Typography>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-500"
            >
              <path d="M13 3h-2v10h3l-4 8v-6H7l6-12z" />
            </svg>
            <Typography variant="small" className="ml-1">
              Carga Rápida
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const Recommendations = () => {
  return (
    <div className="bg-[#DEECEC] p-4 m-5 mx-auto max-w-[1113px]">
      <div className="text-left pl-5 pt-2">
        <Typography variant="h4">Recomendaciones</Typography>
      </div>
      <div
        className="grid gap-6 p-4 
                    grid-cols-1 
                    sm:grid-cols-1 
                    lg:grid-cols-2 justify-items-center"
      >
        <RecommendationCard />
        <RecommendationCard />
      </div>
    </div>
  );
};
