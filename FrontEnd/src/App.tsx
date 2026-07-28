import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Metrics from "./pages/Metrics"

const router = createBrowserRouter([
    {
        path: "/",
        Component: Home,
    },
    {
        path: "/url/:slug",
        Component: Home,
    },
    {
        path: "/metrics/:slug",
        Component: Metrics,
    },
])

export default function App() {
    return <RouterProvider router={router} />
}
