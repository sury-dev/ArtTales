import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Explore, Authenticate, AddArtPostPage, UserProfile } from './components/pages/index.js'
import { Protected, SignupComponent, LoginComponent, ArtPostModal } from './components/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Protected authentication><Explore /></Protected>,
        children:[
          {
            path: 'artpost/:id',
            element: <ArtPostModal />
          }
        ]
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
        path: '/add-art-post',
        element: <Protected authentication><AddArtPostPage /></Protected>
      },
      {
        path: '/user-profile/:username',
        element: <Protected authentication><UserProfile /></Protected>,
        children:[
          {
            path: 'artpost/:id',
            element: <ArtPostModal />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
)
