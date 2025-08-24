const loginLs = localStorage.getItem("login")
  ? JSON.parse(localStorage.getItem("login"))
  : false;
const userLs = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {}; // Cambiado a un objeto vacío
const tokenLs = localStorage.getItem("accessToken") || "";
const reservationLs = localStorage.getItem("reservations")
  ? Array.isArray(JSON.parse(localStorage.getItem("reservations")))
    ? JSON.parse(localStorage.getItem("reservations"))
    : []
  : [];

const vehiclesLs = localStorage.getItem("vehicles")
  ? JSON.parse(localStorage.getItem("vehicles"))
  : [];

export const initialState = {
  vehicles: vehiclesLs,
  filteredVehicles: vehiclesLs,
  isAuth: !!tokenLs,
  user: userLs,
  accessToken: tokenLs,
  isLoadingVehicles: false,
  reservations: reservationLs
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_VEHICLES":
      return { ...state, vehicles: action.payload };
    case "SET_FILTERED_VEHICLES":
      return { ...state, filteredVehicles: action.payload };
    case "SET_IS_LOADING_VEHICLES":
      return { ...state, isLoadingVehicles: action.payload };
    case "login":
      const { accessToken, tokenType, ...userData } = action.payload;
      return {
        ...state,
        isAuth: true,
        user: userData,
        accessToken: accessToken || "",
      };
    case "logout":
      return { ...state, isAuth: false, user: {}, accessToken: "" };
    case "ADD_RESERVATION": {
      const currentReservations = Array.isArray(state.reservations)
        ? state.reservations
        : [];
      return {
        ...state,
        reservations: Array.isArray(action.payload)
          ? [...currentReservations, ...action.payload] 
          : [...currentReservations, action.payload], 
      };
    }
    default:
      return state;
  }
};
