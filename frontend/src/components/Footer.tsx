import { Mail, Phone, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--color-gray-200)]">
      <div className="px-4 md:px-[var(--spacing-4)] py-3 md:py-[var(--spacing-3)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-[var(--spacing-4)]">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-[var(--spacing-3)]">
              <div className="flex items-center gap-3 md:gap-[var(--spacing-3)]">
                <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-full">
                  <span className="text-sm font-bold text-white font-[var(--font-sans)]">
                    BI
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-sm font-semibold text-[var(--color-gray-900)] font-[var(--font-sans)]">
                    Andrianaivo Blaise Ismael
                  </h3>
                  <p className="text-xs text-[var(--color-primary-600)] font-medium font-[var(--font-sans)] md:hidden">
                    Full Stack Developer
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-[var(--spacing-4)]">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[var(--color-gray-500)]" />
                  <a
                    href="mailto:ismablaise@gmail.com"
                    className="text-xs text-[var(--color-gray-600)] font-[var(--font-sans)] hover:text-[var(--color-primary-600)] transition-colors"
                  >
                    ismablaise@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[var(--color-gray-500)]" />
                  <a
                    href="tel:+261345552510"
                    className="text-xs text-[var(--color-gray-600)] font-[var(--font-sans)] hover:text-[var(--color-primary-600)] transition-colors"
                  >
                    +261 034 55 525 10
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-[var(--color-gray-500)]" />
                  <span className="text-xs text-[var(--color-gray-600)] font-[var(--font-sans)]">
                    WhatsApp
                  </span>
                </div>
              </div>

              <div className="flex md:hidden items-center justify-center gap-4 pt-2">
                <a
                  href="mailto:ismablaise@gmail.com"
                  className="p-1.5 hover:bg-[var(--color-gray-100)] rounded-full transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--color-gray-600)]" />
                </a>
                <a
                  href="tel:+261345552510"
                  className="p-1.5 hover:bg-[var(--color-gray-100)] rounded-full transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-gray-600)]" />
                </a>
                <div className="p-1.5">
                  <MessageCircle className="w-4 h-4 text-[var(--color-gray-600)]" />
                </div>
                <div className="p-1.5">
                  <Globe className="w-4 h-4 text-[var(--color-gray-600)]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-[var(--spacing-2)]">
              <div className="md:hidden flex items-center gap-2 mb-2">
                <div className="h-px w-8 bg-[var(--color-gray-300)]"></div>
                <span className="text-xs text-[var(--color-gray-400)] font-[var(--font-sans)]">
                  •
                </span>
                <div className="h-px w-8 bg-[var(--color-gray-300)]"></div>
              </div>
              <p className="text-xs text-[var(--color-gray-500)] font-[var(--font-sans)] whitespace-nowrap">
                &copy; {currentYear}
              </p>
              <span className="hidden md:inline text-[var(--color-gray-300)]">
                •
              </span>
              <p className="text-xs text-[var(--color-gray-500)] font-[var(--font-sans)] hidden md:block">
                Madagascar
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[var(--color-gray-100)] md:hidden">
            <div className="text-center">
              <p className="text-xs text-[var(--color-gray-500)] font-[var(--font-sans)]">
                &copy; {currentYear} Andrianaivo Blaise Ismael
              </p>
              <p className="text-xs text-[var(--color-gray-400)] font-[var(--font-sans)] mt-1">
                Full Stack Developer • AdTech Specialist
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
