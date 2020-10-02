import * as ActionTypes from './ActionTypes'

export const ads = (state = {
    isLoading: true,
    errMess: null,
    ads: [],
    premiumAds: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ADS:
            return { ...state, isLoading: false, errMess: null, ads: action.payload, premiumAds: state.ads.filter(item => item.type === 'premium') }
        case ActionTypes.ADS_LOADING:
            return { ...state, isLoading: true, errMess: null, ads: [], premiumAds: [] }
        case ActionTypes.ADS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, ads: [], premiumAds: [] }
        default:
            return state
    }
}