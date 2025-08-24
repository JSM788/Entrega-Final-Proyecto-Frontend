import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
import { useContextGlobal } from "../../../app/store/GlobalContext";
import Swal from "sweetalert2";
import useIsMobile from "../../../shared/hooks/useIsMobile";
import MobileMessage from "../../../shared/ui/MobileMessage";

const TABLE_HEAD = ["ID", "Nombre", "Correo Electrónico", "Rol"];

export const AdminUsers = () => {
  console.log("AdminUsers component rendered");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContextGlobal();
  const { accessToken } = state;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/user/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
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

    const currentRoleName = currentUser.roles.includes("ADMIN") ? "ADMIN" : "USER";

    try {
      // Remove the current role
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await fetch(`${baseUrl}/api/user/removeRole`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roleName: currentRoleName }),
      });

      // Add the new role
      await fetch(`${baseUrl}/api/user/addRole`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roleName: newRole }),
      });

      // Actualiza el estado local para reflejar el nuevo rol
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, roles: [newRole] } : user
        )
      );
      // Muestra el mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Rol modificado",
        html: `El rol de <strong>${
          currentUser.name
        }</strong> ha sido actualizado a <strong>${
          newRole === "ADMIN" ? "Admin" : "User"
        }</strong>.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el rol.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Usuarios</h1>
          </div>
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
                  const isAdmin = user.roles.includes("ADMIN");
                  const email = user.email === "admin@movelt.com";
                  const isLast = index === users.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  console.log("User:", user, "state", state);
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
                        value={user.roles && user.roles.length > 0 ? user.roles[0].toUpperCase() : "USER"}
                        onChange={(value) => updateRole(user.userId, value)}
                        disabled={isAdmin && email}
                      >
                        <Option value="ADMIN">Admin</Option>
                        <Option value="USER">User</Option>
                      </Select>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
