import { BarChart3, Megaphone, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-[var(--spacing-6)] py-[var(--spacing-3)] bg-white border-b border-[var(--color-gray-100)] shadow-[var(--shadow-sm)]">
      {/* Logo / Title Section avec icône */}
      <div className="flex items-center gap-[var(--spacing-3)]">
        <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-primary-500)] rounded-xl">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-gray-900)] font-[var(--font-sans)] tracking-tight">
            AdTech
          </h1>
          <p className="text-xs text-[var(--color-gray-500)] font-[var(--font-sans)]">
            Ad Tech Dashboard
          </p>
        </div>
      </div>

      {/* Navigation Section avec icônes */}
      <nav className="flex items-center gap-[var(--spacing-6)]">
        <a
          href="#"
          className="flex items-center gap-[var(--spacing-2)] text-[var(--color-gray-700)] hover:text-[var(--color-primary-600)] font-medium font-[var(--font-sans)] transition-colors px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-50)]"
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </a>
        <a
          href="#"
          className="flex items-center gap-[var(--spacing-2)] text-[var(--color-gray-700)] hover:text-[var(--color-primary-600)] font-medium font-[var(--font-sans)] transition-colors px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-50)]"
        >
          <Megaphone className="w-4 h-4" />
          Campagnes
        </a>
        <button className="flex h-10 items-center gap-[var(--spacing-2)] bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-medium font-[var(--font-sans)] px-[var(--spacing-4)] py-[var(--spacing-2.5)] rounded-[var(--radius-md)] transition-colors shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">
          <Plus className="w-4 h-4" />
          Nouvelle Campagne
        </button>
      </nav>
    </header>
  );
}
