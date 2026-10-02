import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import { useCurrentUserQuery } from "@/hooks/useAuthMutations";

export default function App() {
  useCurrentUserQuery();

  return <RouterProvider router={router} />;
}
