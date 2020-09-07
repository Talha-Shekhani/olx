import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { persistStore, persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { ads } from './ads'
import { categories } from './categories'
import { subcategories } from './subCategories'
import { loc } from './location'
import { users } from './users'
import { favorites } from './favorites'
import { chats } from './chat'

export const configureStore = () => {
    const config = {
        key: 'root',
        storage: AsyncStorage,
        debug: true
    }

    const store = createStore(
        persistCombineReducers(config, {
            ads,
            categories,
            subcategories,
            loc,
            users,
            favorites,
            chats
        }),
        compose(
            applyMiddleware(thunk)
            // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()            
        )
    )
    const persistor = persistStore(store)
    return { persistor, store }
}