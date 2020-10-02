import * as ActionTypes from './ActionTypes'

export const users = (state = {
    isLoading: true,
    errMess: null,
    users: [],
    chatUser: [],
    loggedInUserId: 0,
    loggedInUser: null
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_USER:
            return { ...state, isLoading: false, errMess: null, users: action.payload, chatUser: state.chatUser }
        case ActionTypes.USER_LOADING:
            return { ...state, isLoading: true, errMess: null, users: [], chatUser: [] }
        case ActionTypes.USER_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, users: [], chatUser: [] }
        case ActionTypes.ADD_CHAT_USER:
            return { ...state, isLoading: false, errMess: null, users: state.users, chatUser: action.payload }
        case ActionTypes.ADD_LOGGED_USER:
            action.payload[0].password = ''
            return { ...state, loggedInUser: action.payload }
        case ActionTypes.ADD_LOGGED_USER_ID:
            return { ...state, loggedInUserId: state.loggedInUser[0].id}
        case ActionTypes.FAILED_LOGGED_USER:
            return { ...state, loggedInUserId: 0, loggedInUser: null }
        default:
            return state
    }
}