import * as ActionTypes from './ActionTypes'

export const categories = (state = {
    isLoading: true,
    errMess: null,
    categories: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CAT:
            return {...state, isLoading: false, errMess: null, categories: action.payload}
        case ActionTypes.CAT_LOADING:
            return {...state, isLoading: true, errMess: null, categories: []}
        case ActionTypes.CAT_FAILED:
                return {...state, isLoading: false, errMess: action.payload, categories: []}
        default:
            return state
    }
}