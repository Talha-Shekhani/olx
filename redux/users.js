import * as ActionTypes from './ActionTypes'

export const users = (state = {
    isLoading: true,
    errMess: null,
    users: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_USER:
            return {...state, isLoading: false, errMess: null, users: action.payload}
        case ActionTypes.USER_LOADING:
            return {...state, isLoading: true, errMess: null, users: []}
        case ActionTypes.USER_FAILED:
                return {...state, isLoading: false, errMess: action.payload, users: []}
        default:
            return state
    }
}