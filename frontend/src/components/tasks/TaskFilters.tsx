import { useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { TASK_PRIORITY, TASK_STATUS } from "@/constants/task";

export interface FiltersValue {
  status: string;
  priority: string;
  search: string;
}

interface TaskFiltersProps {
  value: FiltersValue;
  onChange: (next: FiltersValue) => void;
  onCreate: () => void;
}

const statusOptions = [
  { value: "", label: "Todos los estados" },
  ...Object.entries(TASK_STATUS).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

const priorityOptions = [
  { value: "", label: "Todas las prioridades" },
  ...Object.entries(TASK_PRIORITY).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

export function TaskFilters({ value, onChange, onCreate }: TaskFiltersProps) {
  const [search, setSearch] = useState(value.search);
  const [prevPropSearch, setPrevPropSearch] = useState(value.search);

  if (value.search !== prevPropSearch) {
    setPrevPropSearch(value.search);
    setSearch(value.search);
  }

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    if (debouncedSearch !== value.search) {
      onChange({ ...value, search: debouncedSearch });
    }
  }, [debouncedSearch, value, onChange]);

  const hasFilters = Boolean(value.status || value.priority || value.search);

  return (
    <div className="flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-end">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          label="Estado"
          options={statusOptions}
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value })}
        />
        <Select
          label="Prioridad"
          options={priorityOptions}
          value={value.priority}
          onChange={(e) => onChange({ ...value, priority: e.target.value })}
        />
        <Input
          label="Buscar"
          placeholder="Título o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          }
        />
      </div>

      <div className="flex gap-2 sm:items-end">
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              onChange({ status: "", priority: "", search: "" });
            }}
          >
            Limpiar
          </Button>
        )}
        <Button
          onClick={onCreate}
          leftIcon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          Nueva tarea
          <kbd className="ml-1 hidden rounded border border-primary-foreground/30 px-1.5 text-[11px] font-medium leading-5 text-primary-foreground/80 sm:inline">
            N
          </kbd>
        </Button>
      </div>
    </div>
  );
}
