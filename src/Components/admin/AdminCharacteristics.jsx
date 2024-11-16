import { Card, CardHeader, CardBody, Avatar } from "@material-tailwind/react";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";

const TABLE_HEAD = ["ID", "Título", "Descripción"];

const fakeCharacteristics = [
  {
    id: 1,
    title: "Bluetooth",
    description: "Conectividad inalámbrica de alta velocidad.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    title: "Pantalla Táctil",
    description: "Interacción intuitiva con pantallas.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    title: "Asistencia de Voz",
    description: "Control por comandos de voz inteligentes.",
    imageUrl: "https://via.placeholder.com/50",
  },
];

export const AdminCharacteristics = () => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="font-semibold">Lista de Características</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todas las características
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
              {fakeCharacteristics.map((characteristic, index) => {
                const isLast = index === fakeCharacteristics.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={characteristic.id}>
                    <td className={classes}>
                      <p className="font-normal">{index + 1}</p>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={characteristic.imageUrl}
                          alt={characteristic.title}
                          size="sm"
                          className="rounded-full border border-aquaTeal"
                        />
                        <p className="font-normal">{characteristic.title}</p>
                      </div>
                    </td>
                    <td className={classes}>
                      <p className="font-normal">
                        {characteristic.description}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
