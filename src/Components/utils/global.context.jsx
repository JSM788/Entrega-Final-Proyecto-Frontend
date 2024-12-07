import { useContext, createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { initialState, reducer } from "./reducer";

const ContextGlobal = createContext();

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const endpointProducts = "http://localhost:8080/api/products";

  console.log(state.reservations);

  const reloadVehicles = () => {
    dispatch({ type: "SET_IS_LOADING_VEHICLES", payload: true });
    axios(endpointProducts)
      .then((response) => {
        dispatch({ type: "SET_VEHICLES", payload: response.data });
        dispatch({ type: "SET_FILTERED_VEHICLES", payload: response.data });
        dispatch({ type: "SET_IS_LOADING_VEHICLES", payload: false });
      })
      .catch((error) => {
        console.error("Error recargando vehículos:", error);
        dispatch({ type: "SET_IS_LOADING_VEHICLES", payload: false });
      });
  };

  useEffect(() => {
    reloadVehicles(); // Carga inicial
    localStorage.setItem("login", JSON.stringify(state.isAuth));
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("accessToken", state.accessToken || "");
    if (Array.isArray(state.reservations)) {
      localStorage.setItem("reservations", JSON.stringify(state.reservations));
    }
  }, [state.isAuth, state.user, state.accessToken, state.reservations]);

  return <ContextGlobal.Provider value={{ state, dispatch, reloadVehicles }}>{children}</ContextGlobal.Provider>;
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
