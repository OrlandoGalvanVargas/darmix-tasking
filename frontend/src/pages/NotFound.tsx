import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

const LEAF = "M8 15C3.2 12 2 6.2 8 1c6 5.2 4.8 11 0 14Z";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      {}
      <svg
        width="260"
        height="120"
        viewBox="0 0 260 120"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        aria-hidden="true"
      >
        <path
          d="M10 40C50 24 80 56 120 40S190 24 210 38"
          stroke="currentColor"
          strokeWidth="2.2"
          pathLength={1}
          className="draw"
        />
        {[
          { x: 48, y: 28, r: -35 },
          { x: 96, y: 56, r: 145 },
          { x: 144, y: 28, r: -35 },
          { x: 186, y: 52, r: 145 },
        ].map((leaf, i) => (
          <g
            key={i}
            transform={`translate(${leaf.x - 8} ${leaf.y - 8}) rotate(${leaf.r} 8 8)`}
          >
            <path
              d={LEAF}
              fill="currentColor"
              className="leaf-pop"
              style={{
                ["--delay" as string]: `${500 + i * 120}ms`,
                transformBox: "fill-box",
                transformOrigin: "50% 100%",
              }}
            />
          </g>
        ))}
        {}
        <path
          d="M222 46C236 64 226 84 238 104"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          className="text-foreground-muted/50"
        />
        <g transform="translate(224 96) rotate(70 8 8)" className="text-accent">
          <path d={LEAF} fill="currentColor" opacity="0.9" />
        </g>
      </svg>

      <div className="space-y-3">
        <p className="font-soft font-serif text-7xl font-light leading-none tabular-nums text-foreground">
          404
        </p>
        <h1 className="font-soft text-2xl font-medium text-foreground">
          Página no encontrada
        </h1>
        <p className="mx-auto max-w-xs text-sm text-foreground-muted">
          La ruta que buscas no existe o fue movida.
        </p>
      </div>

      <Button onClick={() => navigate(ROUTES.projects)}>
        Volver a proyectos
      </Button>
    </div>
  );
}
