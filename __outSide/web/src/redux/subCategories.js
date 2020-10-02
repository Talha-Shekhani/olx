import * as ActionTypes from './ActionTypes'

export const subcategories = (state = {
    isLoading: true,
    errMess: null,
    subcategories: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_SUBCAT:
            return {...state, isLoading: false, errMess: null, subcategories: action.payload}
        case ActionTypes.SUBCAT_LOADING:
            return {...state, isLoading: true, errMess: null, subcategories: []}
        case ActionTypes.SUBCAT_FAILED:
                return {...state, isLoading: false, errMess: action.payload, subcategories: []}
        default:
            return state
    }
}