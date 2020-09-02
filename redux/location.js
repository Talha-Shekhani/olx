import * as ActionTypes from './ActionTypes'

export const loc = (state = {
    isLoading: true,
    errMess: null,
    loc: [],
    city: [],
    province: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_LOC:
            return { ...state, isLoading: false, errMess: null, loc: action.payload, city: state.city, province: state.province }
        case ActionTypes.LOC_LOADING:
            return { ...state, isLoading: true, errMess: null, loc: state.loc, city: state.city, province: state.province }
        case ActionTypes.LOC_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, loc: [], city: [], province: [] }
        case ActionTypes.ADD_PROVINCE:
            return { ...state, isLoading: false, errMess: null, loc: state.loc, city: state.city, province: action.payload }
        case ActionTypes.ADD_CITY:
            return { ...state, isLoading: false, errMess: null, loc: state.loc, city: action.payload, province: state.province }
        default:
            return state
    }
}