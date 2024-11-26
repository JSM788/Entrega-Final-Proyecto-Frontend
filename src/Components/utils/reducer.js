const loginLs = localStorage.getItem("login")
  ? JSON.parse(localStorage.getItem("login"))
  : false;
const userLs = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const tokenLs = localStorage.getItem("accessToken") || "";

export const initialState = {
  vehicles: [],
  filteredVehicles: [],
  isAuth: loginLs,
  user: userLs,
  accessToken: tokenLs,
  isLoadingVehicles: false,
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
      return {
        ...state,
        isAuth: true,
        user: action.payload,
        accessToken: action.payload.accessToken,
      };
    case "logout":
      return { ...state, isAuth: false, user: [], accessToken: "" };
    default:
      return state;
  }
};
