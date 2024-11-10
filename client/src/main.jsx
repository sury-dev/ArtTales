import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Explore, Authenticate, AddPost } from './components/pages/index.js'
import { Protected, SignupComponent, LoginComponent } from './components/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Explore />
      },
      {
        path: '/auth',
        element: <Protected authentication={false}><Authenticate /></Protected>,
        children: [
          {
            path: 'login',
            element: <LoginComponent />
          },
          {
            path: 'signup',
            element: <SignupComponent />
          }
        ]
      },
      {
        path: '/add-post',
        element: <Protected authentication><AddPost /></Protected>
      },
      {
        path: '/user-profile',
        element: <Protected authentication><AddPost /></Protected>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
