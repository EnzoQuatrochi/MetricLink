import Home from './pages/Home'
import Login from './pages/Login'
import Metrics from './pages/Metrics'
import Landing from './pages/Landing'
import Register from './pages/Register'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/home', Component: Home },
  { path: '/metrics/:slug', Component: Metrics },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
])

export default function App() {
  return <RouterProvider router={router} />
}