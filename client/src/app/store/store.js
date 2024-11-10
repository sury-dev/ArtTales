import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer
        // posts: postsReducer
    }
})

export default store