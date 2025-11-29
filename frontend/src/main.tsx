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

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/categories", element: <CategorySelect /> },
  { path: "/website-preferences", element: <WebsitePreferences /> },
  { path: "/swipe", element: <Swipe /> },
  { path: "/settings", element: <Settings /> }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);