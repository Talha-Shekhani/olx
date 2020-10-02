import * as ActionTypes from './ActionTypes'

export const Ads = (state = {
    isLoading: true,
    errMess: null,
    ads: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DISHES:
            return {...state, isLoading: false, errMess: null, ads: action.payload}
        case ActionTypes.DISHES_LOADING:
            return {...state, isLoading: true, errMess: null, ads: []}
        case ActionTypes.DISHES_FAILED:
                return {...state, isLoading: false, errMess: action.payload, ads: []}
        default:
            return state
    }
}