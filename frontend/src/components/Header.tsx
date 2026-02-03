import { BarChart3, Megaphone, Plus, Menu, X } from "lucide-react";
import { useActiveTab } from "../contexts/ActiveTabContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { activeTab, setActiveTab } = useActiveTab();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate("/create");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-[var(--spacing-6)] py-3 md:py-[var(--spacing-3)] bg-white border-b border-[var(--color-gray-200)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3 md:gap-[var(--spacing-3)]">
          <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-lg md:rounded-xl shadow-sm">
            <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-[var(--color-gray-900)] font-[var(--font-sans)] tracking-tight">
              AdTech
            </h1>
            <p className="text-xs text-[var(--color-gray-500)] font-[var(--font-sans)]">
              Ad Tech Dashboard
            </p>
          </div>
          <div className="md:hidden">
            <h1 className="text-lg font-bold text-[var(--color-gray-900)] font-[var(--font-sans)]">
              AdTech
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-[var(--spacing-2)]">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              navigate("/");
            }}
            className={`
              flex h-10 items-center gap-[var(--spacing-2)] 
              font-medium font-[var(--font-sans)] 
              transition-all duration-200 ease-out
              px-[var(--spacing-4)] py-[var(--spacing-2.5)] 
              rounded-[var(--radius-md)]
              ${
                activeTab === "dashboard"
                  ? "text-[var(--color-primary-700)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] shadow-sm"
                  : "text-[var(--color-gray-600)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-gray-50)]"
              }
            `}
          >
            <BarChart3
              className={`w-4 h-4 ${activeTab === "dashboard" ? "text-[var(--color-primary-600)]" : "text-[var(--color-gray-500)]"}`}
            />
            Dashboard
            {activeTab === "dashboard" && (
              <div className="ml-2 w-2 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("campagnes");
              navigate("/campaigns");
            }}
            className={`
              flex h-10 items-center gap-[var(--spacing-2)] 
              font-medium font-[var(--font-sans)] 
              transition-all duration-200 ease-out
              px-[var(--spacing-4)] py-[var(--spacing-2.5)] 
              rounded-[var(--radius-md)]
              ${
                activeTab === "campagnes"
                  ? "text-[var(--color-primary-700)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] shadow-sm"
                  : "text-[var(--color-gray-600)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-gray-50)]"
              }
            `}
          >
            <Megaphone
              className={`w-4 h-4 ${activeTab === "campagnes" ? "text-[var(--color-primary-600)]" : "text-[var(--color-gray-500)]"}`}
            />
            Campagnes
            {activeTab === "campagnes" && (
              <div className="ml-2 w-2 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse"></div>
            )}
          </button>

          <div className="h-6 w-px bg-[var(--color-gray-200)] mx-[var(--spacing-2)]"></div>

          <button
            onClick={handleCreateCampaign}
            className="
              flex h-10 items-center gap-[var(--spacing-2)] 
              bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
              hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]
              text-white font-medium font-[var(--font-sans)] 
              px-[var(--spacing-4)] py-[var(--spacing-2.5)] 
              rounded-[var(--radius-md)] 
              transition-all duration-200 ease-out
              shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
              active:scale-[0.98]
              group
            "
          >
            <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden lg:inline">Nouvelle Campagne</span>
            <span className="lg:hidden">Nouvelle</span>
            <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                ⌘N
              </span>
            </div>
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={handleCreateCampaign}
            className="flex h-9 items-center gap-2 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium font-[var(--font-sans)] px-3 py-1.5 rounded-[var(--radius-md)] transition-all duration-200 ease-out shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed top-16 md:hidden left-0 right-0 z-40 bg-white border-b border-[var(--color-gray-200)] shadow-md animate-slideDown">
          <div className="px-4 py-3">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
                className={`
                  flex items-center gap-3
                  font-medium font-[var(--font-sans)] 
                  transition-all duration-200 ease-out
                  px-4 py-3 
                  rounded-[var(--radius-md)]
                  ${
                    activeTab === "dashboard"
                      ? "text-[var(--color-primary-700)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
                      : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)]"
                  }
                `}
              >
                <BarChart3
                  className={`w-5 h-5 ${activeTab === "dashboard" ? "text-[var(--color-primary-600)]" : "text-[var(--color-gray-500)]"}`}
                />
                <span>Dashboard</span>
                {activeTab === "dashboard" && (
                  <div className="ml-auto w-2 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("campagnes");
                  setMobileMenuOpen(false);
                  navigate("/campaigns");
                }}
                className={`
                  flex items-center gap-3
                  font-medium font-[var(--font-sans)] 
                  transition-all duration-200 ease-out
                  px-4 py-3 
                  rounded-[var(--radius-md)]
                  ${
                    activeTab === "campagnes"
                      ? "text-[var(--color-primary-700)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
                      : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)]"
                  }
                `}
              >
                <Megaphone
                  className={`w-5 h-5 ${activeTab === "campagnes" ? "text-[var(--color-primary-600)]" : "text-[var(--color-gray-500)]"}`}
                />
                <span>Campagnes</span>
                {activeTab === "campagnes" && (
                  <div className="ml-auto w-2 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse"></div>
                )}
              </button>

              <div className="pt-2 mt-2 border-t border-[var(--color-gray-200)]">
                <button
                  onClick={handleCreateCampaign}
                  className="
                    flex items-center justify-center gap-2
                    w-full
                    bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
                    hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]
                    text-white font-medium font-[var(--font-sans)] 
                    px-4 py-3 
                    rounded-[var(--radius-md)] 
                    transition-all duration-200 ease-out
                    shadow-sm
                    active:scale-[0.98]
                  "
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle Campagne
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
