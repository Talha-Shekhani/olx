import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import logger from 'redux-logger'
import { ads } from './ads'
import { categories } from './categories'
import { subcategories } from './subCategories'
import { loc } from './location'
import { users } from './users'
import { favorites } from './favorites'
import { chats } from './chat'
import { featured } from './featured'

export const configureStore = () => {

    const store = createStore(
        combineReducers({
            ads,
            categories,
            subcategories,
            loc,
            users,
            favorites,
            chats,
            featured
        }),
        compose(
            applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    )
    return store
}