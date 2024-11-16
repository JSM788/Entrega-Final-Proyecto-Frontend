import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Avatar } from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "Título", "Descripción"];

// Hook personalizado para verificar si el dispositivo es móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const AdminCategories = () => {
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
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="font-semibold">Lista de Categorías</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todas las categorías
          </h2>
        </CardHeader>

        <CardBody className="overflow-auto px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <h3 className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      {head}
                    </h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p className="font-normal">1</p>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src="https://img.freepik.com/vector-gratis/pequenos-programadores-que-trabajan-errores-sistema-computadora-monitor-ilustracion-vectorial-plana-internet-programacion-informatica-tecnologia-digital_74855-8632.jpg?t=st=1731716743~exp=1731720343~hmac=7cf9cf9791d2fc0b56a2c4ddf4c0b1e06c2f50a34e64ef21be91a7cc57aca857&w=740"
                      alt=""
                      size="sm"
                      className="rounded-full border border-aquaTeal"
                    />
                    <p className="font-normal">titulo de categoria 1</p>
                  </div>
                </td>
                <td>
                  <p className="font-normal">Descripción de categoria 1</p>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
