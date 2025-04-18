import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Registration from "./pages/Auth/Registration";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound/NotFound";
import OtherProfile from "./pages/OtherProfile/OtherProfile";
import Messenger from "./pages/Messenger/Messenger";

function AppRoutes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "gallery",
          element: <Gallery />,
        },
        {
          path: "user/:userId",
          element: <OtherProfile />,
        },
        {
          path: "messenger",
          element: (
            <PrivateRoute>
              <Messenger />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "registration",
          element: <Registration />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "not-found",
          element: <NotFound />,
        },
        {
          path: "*",
          element: <Navigate to={"/not-found"} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;
