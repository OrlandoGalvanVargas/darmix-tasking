import { useState } from "react";
import { Outlet } from "react-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/ui/BrandMark";
import { GrowthBranch, LeafGlyph } from "@/components/projects/GrowthBranch";
import {
  type AuthOutletContext,
  type FieldLevel,
} from "@/components/layout/authGrowth";

const TOTAL_LEAVES = 12;

function toCounts(levels: FieldLevel[]) {
  const per = levels.length ? Math.floor(TOTAL_LEAVES / levels.length) : 0;
  let done = 0;
  let doing = 0;
  let todo = 0;
  levels.forEach((level) => {
    if (level === 2) done += per;
    else if (level === 1) doing += per;
    else todo += per;
  });
  return { done, doing, todo };
}

export function AuthLayout() {
  const [levels, setLevels] = useState<FieldLevel[]>([0, 0]);
  const { done, doing, todo } = toCounts(levels);
  const context: AuthOutletContext = { setLevels };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {}
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <BrandMark size={40} />
          <span className="font-soft font-serif text-xl font-medium tracking-tight">
            Darmix Tasking
          </span>
        </div>

        <div className="max-w-lg">
          <h2 className="font-soft text-balance text-5xl font-medium leading-[1.05] tracking-tight xl:text-6xl">
            Cada tarea es una hoja.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-primary-foreground/75">
            Las pendientes son brotes, las que avanzan se abren y las terminadas
            completan la rama.
          </p>

          <div className="mt-14 space-y-5">
            <GrowthBranch
              size="lg"
              tone="inverse"
              reactive
              pending={todo}
              inProgress={doing}
              completed={done}
              label="Rama que crece mientras completas el formulario"
            />
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/75">
              <li className="inline-flex items-center gap-2">
                <LeafGlyph kind="todo" size={16} tone="inverse" />
                Pendiente
              </li>
              <li className="inline-flex items-center gap-2">
                <LeafGlyph kind="doing" size={16} tone="inverse" />
                En progreso
              </li>
              <li className="inline-flex items-center gap-2">
                <LeafGlyph kind="done" size={16} tone="inverse" />
                Completada
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-primary-foreground/55">
          © {new Date().getFullYear()} Darmix Tasking
        </p>
      </aside>

      {}
      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark size={28} className="text-primary" />
            <span className="font-soft font-serif text-lg font-medium tracking-tight text-foreground">
              Darmix Tasking
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
          <div className="animate-fade-in w-full max-w-sm">
            {}
            <GrowthBranch
              size="sm"
              reactive
              pending={todo}
              inProgress={doing}
              completed={done}
              className="mb-8 lg:hidden"
              label="Rama que crece mientras completas el formulario"
            />
            <Outlet context={context} />
          </div>
        </div>
      </div>
    </div>
  );
}
