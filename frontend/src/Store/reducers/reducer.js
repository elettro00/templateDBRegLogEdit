import { SET_AUTH } from "../actions/actions";

const initialState = {
    isAuth: Boolean
}

function CheckAction(state = initialState, action)
{
    switch(action.type)
    {
        case SET_AUTH:
        state.isAuth = action.payload
        return state
        default:
            return state
    }
}

export default CheckAction