import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/layout/PublicOnlyRoute";
import { ROUTES } from "@/constants/routes";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <Login /> },
          { path: ROUTES.register, element: <Register /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to={ROUTES.projects} replace /> },
          { path: ROUTES.projects, element: <Projects /> },
          { path: "/projects/:id", element: <ProjectDetail /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
