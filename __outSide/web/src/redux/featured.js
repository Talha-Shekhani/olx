import * as ActionTypes from './ActionTypes'
export const featured = (state = {
    errMess: null,
    featured: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_FEAT:
            return { ...state, errMess: null, featured: action.payload }
        case ActionTypes.FEAT_FAILED:
            return { ...state, errMess: action.payload, featured: [] }
        default:
            return state
    }
}