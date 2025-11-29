import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CategorySelect from "./pages/CategorySelect";
import WebsitePreferences from "./pages/WebsitePreferences";
import Swipe from "./pages/Swipe";
import Settings from "./pages/Settings";
import AddWebsite from "./pages/AddWebsite";
import Feed from "./pages/Feed";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/categories", element: <CategorySelect /> },
  { path: "/website-preferences", element: <WebsitePreferences /> },
  { path: "/swipe", element: <Swipe /> },
  { path: "/add-website", element: <AddWebsite /> },
  { path: "/settings", element: <Settings /> },
  { path: "/feed", element: <Feed /> }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);