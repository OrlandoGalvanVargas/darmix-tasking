import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <p className="text-5xl font-bold text-foreground">404</p>
      <h1 className="text-xl font-semibold text-foreground">
        Página no encontrada
      </h1>
      <p className="text-sm text-foreground-muted">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link to={ROUTES.projects}>
        <Button>Volver a proyectos</Button>
      </Link>
    </div>
  );
}
