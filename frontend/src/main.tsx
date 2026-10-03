import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/fraunces";
import "./index.css";
import App from "./App.tsx";
import { AppProviders } from "./app/providers.tsx";
import { bootstrap } from "./app/bootstrap.ts";

bootstrap()
  .catch((err) => {
    console.error("Error en bootstrap:", err);
  })
  .finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </StrictMode>,
    );
  });
