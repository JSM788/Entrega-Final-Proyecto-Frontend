import { useContext, createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { initialState, reducer } from "./reducer";

const ContextGlobal = createContext();

const ContextProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const endpointProducts = "http://localhost:8080/api/products";

  useEffect( ()=> {

    axios(endpointProducts).then( (response) => {
      console.log("en axios")
      console.log(response)
      dispatch({ type: "SET_VEHICLES", payload: response.data });      
    
    }).catch((error) => {
      console.error("Error obteniendo vehículos:", error);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('login', JSON.stringify(state.isAuth));
    localStorage.setItem('user', JSON.stringify(state.user));
    localStorage.setItem('accessToken', state.accessToken || "");
  }, [state.isAuth, state.user, state.accessToken]);

  return (
    <ContextGlobal.Provider value = {{state, dispatch}}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);