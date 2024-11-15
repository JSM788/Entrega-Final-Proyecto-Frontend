import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContextGlobal } from "../utils/global.context";
import Swal from "sweetalert2";

const TABLE_HEAD = ["ID", "Nombre", "Correo Electrónico", "Rol"]; //,"Acciones"

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

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContextGlobal();
  const { accessToken } = state;

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        console.log("data", data);
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected data:", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken]);

  const updateRole = async (userId, newRole) => {
    const currentUser = users.find((user) => user.userId === userId);
    if (!currentUser) return;

    // Detecta el rol actual y define los IDs de rol correspondientes
    const currentRole = currentUser.roles.includes(1) ? 1 : 2;
    const newRoleId = newRole === "admin" ? 1 : 2;
    console.log(currentRole, newRoleId);
    try {
      // Remove the current role
      await fetch("http://localhost:8080/api/user/removeRole", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roleId: currentRole }),
      });

      // Add the new role
      await fetch("http://localhost:8080/api/user/addRole", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roleId: newRoleId }),
      });

      // Actualiza el estado local para reflejar el nuevo rol
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, roles: [newRoleId] } : user
        )
      );
      // Muestra el mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Rol modificado",
        html: `El rol de <strong>${
          currentUser.name
        }</strong> ha sido actualizado a <strong>${
          newRole === "admin" ? "Admin" : "User"
        }</strong>.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el rol.",
      });
    }
  };

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
          <h1 className="font-semibold">Lista de Usuarios</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todos los usuarios
          </h2>
        </CardHeader>

        <CardBody className="overflow-auto px-0">
          {loading ? (
            <div className="text-center p-4">
              <h2>Cargando...</h2>
            </div>
          ) : (
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
                {users.map((user, index) => {
                  const isAdmin = user.roles.includes(1);
                  const isLast = index === users.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const isFirstUser = user.email === "admin@gmail.com"; // Check if it's the first user (admin)

                  const isUserLoggedIn = user.userId === state.user.id; // Verificar si es el usuario logueado

                  return (
                    <tr key={user.email}>
                      <td className={classes}>
                        <p className="font-normal">{index + 1}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{user.name}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{user.email}</p>
                      </td>
                      <td className={classes}>
                        <Select
                          value={isAdmin ? "admin" : "user"}
                          onChange={(value) => {
                            updateRole(
                              user.userId,
                              value === "admin" ? "admin" : "user"
                            );
                          }}
                          disabled={isFirstUser || isUserLoggedIn} // Deshabilitar el select
                        >
                          <Option
                            value="admin"
                            disabled={isFirstUser || isUserLoggedIn}
                          >
                            Admin
                          </Option>
                          <Option value="user">User</Option>
                        </Select>
                      </td>
                      {/* <td className={classes}>
                      <div className="flex space-x-2">
                        <Tooltip content="Editar usuario">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar usuario">
                          <IconButton variant="text">
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
        {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
};
