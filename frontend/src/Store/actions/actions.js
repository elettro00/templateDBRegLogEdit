export const SET_AUTH = "GET_AUTH"

export function SetAuth(auth)
{
    const action = {
        type: SET_AUTH,
        payload: auth
    }

    return action
}