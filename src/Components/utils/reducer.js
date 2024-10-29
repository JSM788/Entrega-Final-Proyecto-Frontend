export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_VEHICLES":
            return{...state, vehicles: action.payload}
    }
}