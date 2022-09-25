import ACTIONS from "../Acctions";

const initialstate = {
    user: [],
    isLogger:false,
    isAdmin:false
};

const authReducer = (state = initialstate, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogger:true
            }
        case ACTIONS.GET_USER:
            return {
                ...state,
                user:action.payload.user,
                isAdmin: action.payload.isAdmin
            }
        default:
            return state
    }
}

export default authReducer
