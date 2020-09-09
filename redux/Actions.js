import * as ActionTypes from './ActionTypes'
import { baseUrl } from '../shared/baseUrl'
import { act } from 'react-test-renderer'

export const fetchAds = () => (dispatch) => {
    // dispatch(adsLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}ads`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            .then(response => dispatch(addAllAds(response)))
            .catch(error => dispatch(adsFailed(error)))
    }
    fetchData()

}

export const adsLoading = () => ({
    type: ActionTypes.ADS_LOADING
})

export const adsFailed = (errmess) => ({
    type: ActionTypes.ADS_FAILED,
    payload: errmess
})

export const addAllAds = (ads) => ({
    type: ActionTypes.ADD_ADS,
    payload: ads
})

export const delAd = (adId) => (dispatch) => {
    console.log(adId)
    return fetch(`${baseUrl}ads`, {
        mode: 'no-cors',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adId: adId })
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return JSON.stringify(error)
            }
        },
            error => {
                var errmess = new Error(error.message)
                return JSON.stringify(errmess)
            })
        .then((response) => { return response.json() })
        .then(response => { console.log(response); if (response.success == true) dispatch(fetchAds()) })
        .catch(error => console.log(error))
}


export const fetchCategories = () => (dispatch) => {
    // dispatch(catLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}fetchCat`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            // .then (response => console.log((response)))
            .then(response => dispatch(catAllAds(response)))
            .catch(error => dispatch(catFailed(error)))
    }
    fetchData()
}

export const catLoading = () => ({
    type: ActionTypes.CAT_LOADING
})

export const catFailed = (errmess) => ({
    type: ActionTypes.CAT_FAILED,
    payload: errmess
})

export const catAllAds = (cat) => ({
    type: ActionTypes.ADD_CAT,
    payload: cat
})

export const fetchSubCategories = () => (dispatch) => {
    dispatch(subCatLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}fetchSubcat`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            // .then (response => console.log((response)))
            .then(response => dispatch(subCatAllAds(response)))
            .catch(error => dispatch(subCatFailed(error)))
    }
    fetchData()
}

export const subCatLoading = () => ({
    type: ActionTypes.SUBCAT_LOADING
})

export const subCatFailed = (errmess) => ({
    type: ActionTypes.SUBCAT_FAILED,
    payload: errmess
})

export const subCatAllAds = (subCat) => ({
    type: ActionTypes.ADD_SUBCAT,
    payload: subCat
})

export const fetchLoc = () => (dispatch) => {
    dispatch(locLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}loc`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            .then(response => dispatch(addAllLoc(response)))
            .catch(error => dispatch(locFailed(error)))
    }
    fetchData()
}

export const fetchProvince = () => (dispatch) => {
    dispatch(locLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}loc/province`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            .then(response => dispatch({ type: ActionTypes.ADD_PROVINCE, payload: response }))
            .catch(error => dispatch({ type: ActionTypes.LOC_FAILED, payload: error }))
    }
    fetchData()
}

export const fetchCity = () => (dispatch) => {
    dispatch(locLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}loc/city`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            .then(response => dispatch({ type: ActionTypes.ADD_CITY, payload: response }))
            .catch(error => dispatch({ type: ActionTypes.LOC_FAILED, payload: error }))
    }
    fetchData()
}

export const locLoading = () => ({
    type: ActionTypes.LOC_LOADING
})

export const locFailed = (errmess) => ({
    type: ActionTypes.LOC_FAILED,
    payload: errmess
})

export const addAllLoc = (loc) => ({
    type: ActionTypes.ADD_LOC,
    payload: loc
})

export const fetchUser = (userId) => (dispatch) => {
    // dispatch(userLoading(true))
    return fetch(`${baseUrl}users/${userId}`, {
        mode: 'no-cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => dispatch(addUser(response)))
        .catch(error => dispatch(userFailed(error)))
}

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
})

export const userFailed = (errmess) => ({
    type: ActionTypes.USER_FAILED,
    payload: errmess
})

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    payload: user
})

export const checkUser = (email, password) => (dispatch) => {
    return fetch(`${baseUrl}users/${email}/${password}`, {
        mode: 'no-cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(err => { return err })
}

export const fetchFav = (userId) => (dispatch) => {
    // dispatch(favLoading(true))
    async function fetchData() {
        return await fetch(`${baseUrl}favorite/${userId}`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    return error
                }
            },
                error => {
                    var errmess = new Error(error.message)
                    return errmess
                })
            .then((response) => { return response.json() })
            .then(response => dispatch(addFav(response)))
            .catch(error => dispatch(favFailed(error)))
    }
    fetchData()
}

export const favLoading = () => ({
    type: ActionTypes.FAV_LOADING
})

export const favFailed = (errmess) => ({
    type: ActionTypes.FAV_FAILED,
    payload: errmess
})

export const addFav = (fav) => ({
    type: ActionTypes.ADD_FAV,
    payload: fav
})

export const delFav = (userId, adId) => (dispatch) => {
    console.log(userId, adId)
    return fetch(`${baseUrl}favorite/${userId}/${adId}`, {
        mode: 'no-cors',
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => dispatch(deleteFav(adId)))
        .catch(error => dispatch(favFailed(error)))
}

export const deleteFav = (adId) => ({
    type: ActionTypes.DEL_FAV,
    payload: adId
})

export const postFav = (userId, adId) => (dispatch) => {
    return fetch(`${baseUrl}favorite/${userId}/${adId}`, {
        mode: 'no-cors',
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => dispatch(postFavorite({ "ad_id": adId, "user_id": userId })))
        .catch(error => dispatch(favFailed(error)))
}

export const postFavorite = (fav) => ({
    type: ActionTypes.POST_FAV,
    payload: fav
})

export const postAd = (userId, formData) => (dispatch) => {
    console.log('val', formData)
    var data = new FormData()
    data.append('img', formData.img)
    fetch(`${baseUrl}ads/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: data
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        // .then((response) => { return response.json() })
        .then(response => console.log(response))
        .catch(error => console.log(error))

    return fetch(`${baseUrl}ads/${userId}/form`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => dispatch(fetchAds()))
        .catch(error => dispatch(adsFailed(error)))
}

export const putStatus = (userId, adId, active) => (dispatch) => {
    console.log({ 'userId': userId, 'adId': adId, 'active': active })
    return fetch(`${baseUrl}setStatus`, {
        mode: 'no-cors',
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'userId': userId, 'adId': adId, 'active': active }),
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => dispatch(fetchAds()))
        .catch(error => dispatch(adsFailed))
}

export const fetchChatUser = (userId) => (dispatch) => {
    return fetch(`${baseUrl}users/chat/user/${userId}`, {
        mode: 'no-cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { dispatch(addChatUser(response)) })
        .catch(error => dispatch(userFailed(error)))
}

export const addChatUser = (user) => ({
    type: ActionTypes.ADD_CHAT_USER,
    payload: user
})

export const postChatMsg = (msg) => (dispatch) => {
    // console.log('msg', msg[0])
    return fetch(`${baseUrl}chat`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg[0])
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then(response => dispatch(fetchChats(msg[0].from_user_id, msg[0].user._id)))
        .catch(error => dispatch(chatFailed(error)))
}

export const fetchChats = (from_user, to_user) => (dispatch) => {
    // console.log('fetch', from_user, to_user)
    return fetch(`${baseUrl}chat/${from_user}/${to_user}`, {
        mode: 'no-cors',
        method: 'GET',
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { dispatch(addChats(response)) })
        .catch(error => dispatch(chatFailed(error)))
}

export const addChats = (chats) => ({
    type: ActionTypes.ADD_CHATS,
    payload: chats
})

export const chatFailed = (err) => ({
    type: ActionTypes.CHAT_FAILED,
    payload: err
})