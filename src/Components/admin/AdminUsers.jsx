import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  // CardFooter,
  Typography,
  // IconButton,
  // Tooltip,
  // Button,
  Select,
  Option,
} from "@material-tailwind/react";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContextGlobal } from "../utils/global.context";

const TABLE_HEAD = ["ID", "Nombre", "Correo Electrónico", "Rol"]; //,"Acciones"

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { state } = useContextGlobal();
  const { accessToken } = state;

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
    console.log(currentRole, newRoleId)
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
          user.userId === userId
            ? { ...user, roles: [newRoleId] }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };  

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h5" color="blue-gray">
            Lista de Usuarios
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Información sobre todos los usuarios
          </Typography>
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
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
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

                return (
                  <tr key={user.email}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user.email}
                      </Typography>
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
                        disabled={isFirstUser} // Deshabilitar el select para el primer usuario
                      >
                        <Option value="admin" disabled={isFirstUser}>
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
