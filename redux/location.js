import * as ActionTypes from './ActionTypes'

export const loc = (state = {
    isLoading: true,
    errMess: null,
    loc: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_LOC:
            return {...state, isLoading: false, errMess: null, loc: action.payload}
        case ActionTypes.LOC_LOADING:
            return {...state, isLoading: true, errMess: null, loc: []}
        case ActionTypes.LOC_FAILED:
                return {...state, isLoading: false, errMess: action.payload, loc: []}
        default:
            return state
    }
}