const loginLs = localStorage.getItem('login') ? JSON.parse(localStorage.getItem('login')) : false;
const userLs = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const tokenLs = localStorage.getItem('accessToken') || "";

export const initialState = {
    vehicles: [],
    isAuth: loginLs,
    user: userLs,
    accessToken: tokenLs
  };

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_VEHICLES":
            return{...state, vehicles: action.payload}
        case "login": 
            return { ...state, isAuth: true, user: action.payload, accessToken: action.payload.accessToken }
        case "logout":
            return { ...state, isAuth: false, user:[], accessToken: "" }
    }
}