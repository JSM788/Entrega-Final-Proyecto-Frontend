import { useContextGlobal } from "../../../app/store/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminLayout } from "./AdminLayout";

const Admin = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isAuth || !state.user.roles.includes("ADMIN")) {
      navigate("/403");
    }
  }, [state.isAuth, state.user.roles, navigate]);

  if (!state.isAuth || !state.user.roles.includes("ADMIN")) {
    return null;
  }

  return <AdminLayout />;
};

export default Admin;