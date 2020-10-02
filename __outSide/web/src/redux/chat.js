import * as ActionTypes from './ActionTypes'
export const chats = (state = {
    errMess: null,
    chats: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CHATS:
            return { ...state, errMess: null, chats: action.payload }
        case ActionTypes.CHAT_FAILED:
            return { ...state, errMess: action.payload, chats: [] }
        // case ActionTypes.DELETE_CHAT:
        //     return { ...state, isLoading: false, errMess: null, favorites: state.favorites.filter((item) => item.ad_id !== action.payload) }
        // case ActionTypes.POST_FAV:
        //     console.log(action.payload, state.favorites)
        //     return { ...state, isLoading: false, errMess: null, chats: state.favorites.concat(action.payload) }
        default:
            return state
    }
}