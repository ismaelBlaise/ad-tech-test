import React, { useState } from "react";
import {
  ChevronRight,
  Eye,
  ChevronLeft,
  MoreVertical,
  Target,
  Clock,
  Calendar,
  DollarSign,
  Plus,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    date: "01/06/2024 - 31/08/2024",
    advertiser: "Nike",
    budget: "50000 €",
    status: "Active",
    impressions: "1,3 M",
    clicks: "37,5 k",
    ctr: "3.00%",
  },
  {
    id: 2,
    name: "Back to School",
    date: "15/08/2024 - 30/09/2024",
    advertiser: "Apple",
    budget: "75000 €",
    status: "Active",
    impressions: "890 k",
    clicks: "22,3 k",
    ctr: "2.50%",
  },
  {
    id: 3,
    name: "Product Launch CTV",
    date: "01/09/2024 - 15/10/2024",
    advertiser: "Samsung",
    budget: "85000 €",
    status: "Active",
    impressions: "420 k",
    clicks: "12,6 k",
    ctr: "3.00%",
  },
  {
    id: 4,
    name: "Holiday Campaign",
    date: "01/11/2024 - 31/12/2024",
    advertiser: "Amazon",
    budget: "120000 €",
    status: "Planifié",
    impressions: "0",
    clicks: "0",
    ctr: "0%",
  },
  {
    id: 5,
    name: "Q1 Brand Awareness",
    date: "01/01/2024 - 31/03/2024",
    advertiser: "Microsoft",
    budget: "95000 €",
    status: "Terminé",
    impressions: "2,1 M",
    clicks: "45,2 k",
    ctr: "2.15%",
  },
  {
    id: 6,
    name: "Spring Collection",
    date: "01/03/2024 - 31/05/2024",
    advertiser: "Zara",
    budget: "65000 €",
    status: "Terminé",
    impressions: "1,8 M",
    clicks: "38,7 k",
    ctr: "2.15%",
  },
  {
    id: 7,
    name: "Mobile App Launch",
    date: "01/07/2024 - 31/08/2024",
    advertiser: "Spotify",
    budget: "55000 €",
    status: "Terminé",
    impressions: "1,2 M",
    clicks: "28,9 k",
    ctr: "2.41%",
  },
  {
    id: 8,
    name: "Black Friday",
    date: "15/11/2024 - 30/11/2024",
    advertiser: "Best Buy",
    budget: "180000 €",
    status: "Planifié",
    impressions: "0",
    clicks: "0",
    ctr: "0%",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CampaignsTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-[var(--color-success-500)]/20 to-emerald-500/20 text-[var(--color-success-500)] border border-[var(--color-success-500)]/30";
      case "Planifié":
        return "bg-gradient-to-r from-[var(--color-info-500)]/20 to-blue-500/20 text-[var(--color-info-500)] border border-[var(--color-info-500)]/30";
      case "Terminé":
        return "bg-gradient-to-r from-[var(--color-gray-200)] to-[var(--color-gray-300)] text-[var(--color-gray-700)] border border-[var(--color-gray-300)]";
      default:
        return "bg-gradient-to-r from-[var(--color-gray-200)] to-[var(--color-gray-300)] text-[var(--color-gray-700)] border border-[var(--color-gray-300)]";
    }
  };

  return (
    <div className="  overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-[var(--spacing-6)]">
        <div className="flex flex-col gap-4 mb-6 lg:mb-[var(--spacing-6)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-gray-900)] flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-lg shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span>Campagnes actives</span>
              <span className="px-2.5 py-0.5 text-xs sm:text-sm font-medium bg-[var(--color-primary-500)]/10 text-[var(--color-primary-700)] rounded-full">
                {campaigns.filter((c) => c.status === "Active").length} actives
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-gray-600)] mt-2">
              Gestion et suivi de vos campagnes publicitaires
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 sm:mt-4">
            <button className="flex items-center justify-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium group/cta order-2 sm:order-1">
              <span className="px-3 py-1.5 bg-[var(--color-primary-500)]/10 rounded-lg group-hover/cta:bg-[var(--color-primary-500)]/20 transition-colors text-sm sm:text-base">
                Explorer toutes les campagnes
              </span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/cta:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all shadow-sm group order-1 sm:order-2 sm:ml-auto">
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Nouvelle campagne</span>
              {/* <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> */}
            </button>
          </div>
        </div>

        <div className="hidden  lg:block rounded-[var(--radius-md)] border border-[var(--color-gray-200)] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-gray-200)]">
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Campagne
                  </th>
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Annonceur
                  </th>
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Budget
                  </th>
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Statistiques
                  </th>
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Statut
                  </th>
                  <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-[var(--color-gray-100)] hover:bg-gradient-to-r from-[var(--color-primary-50)]/20 to-white transition-all duration-200 group"
                  >
                    <td className="py-4 px-[var(--spacing-4)]">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-700)]/10 rounded-lg flex-shrink-0">
                          <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--color-gray-900)] group-hover:text-[var(--color-primary-700)] transition-colors">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-[var(--color-gray-500)] flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{campaign.date}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-[var(--spacing-4)]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gray-200)] to-[var(--color-gray-300)] flex items-center justify-center font-medium text-sm text-[var(--color-gray-700)] flex-shrink-0">
                          {campaign.advertiser.charAt(0)}
                        </div>
                        <span className="font-medium text-[var(--color-gray-900)]">
                          {campaign.advertiser}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-[var(--spacing-4)]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-md flex-shrink-0">
                          <DollarSign className="w-3 h-3 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-gray-900)] whitespace-nowrap">
                            {campaign.budget}
                          </div>
                          <div className="text-xs text-[var(--color-gray-500)]">
                            Budget
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-[var(--spacing-4)]">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="font-bold text-[var(--color-gray-900)] text-sm">
                            {campaign.impressions}
                          </div>
                          <div className="text-xs text-[var(--color-gray-500)]">
                            Impressions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-[var(--color-gray-900)] text-sm">
                            {campaign.clicks}
                          </div>
                          <div className="text-xs text-[var(--color-gray-500)]">
                            Clics
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-[var(--color-gray-900)] text-sm">
                            {campaign.ctr}
                          </div>
                          <div className="text-xs text-[var(--color-gray-500)]">
                            CTR
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-[var(--spacing-4)]">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(campaign.status)}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-[var(--spacing-4)]">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye">
                          <Eye className="w-6 h-6 text-[var(--color-gray-500)] group-hover/eye:text-[var(--color-primary-600)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-3">
          {currentCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-[var(--radius-md)] border border-[var(--color-gray-200)] shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-700)]/10 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[var(--color-gray-900)] mb-1">
                      {campaign.name}
                    </div>
                    <div className="text-xs text-[var(--color-gray-500)] flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{campaign.date}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(campaign.status)}`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--color-gray-100)]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gray-200)] to-[var(--color-gray-300)] flex items-center justify-center font-medium text-sm text-[var(--color-gray-700)] flex-shrink-0">
                  {campaign.advertiser.charAt(0)}
                </div>
                <span className="font-medium text-[var(--color-gray-900)] text-sm">
                  {campaign.advertiser}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-md flex-shrink-0">
                  <DollarSign className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-[var(--color-gray-900)] text-sm">
                    {campaign.budget}
                  </div>
                  <div className="text-xs text-[var(--color-gray-500)]">
                    Budget
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-[var(--color-gray-100)]">
                <div className="text-center">
                  <div className="font-bold text-[var(--color-gray-900)] text-sm">
                    {campaign.impressions}
                  </div>
                  <div className="text-xs text-[var(--color-gray-500)]">
                    Impressions
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[var(--color-gray-900)] text-sm">
                    {campaign.clicks}
                  </div>
                  <div className="text-xs text-[var(--color-gray-500)]">
                    Clics
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[var(--color-gray-900)] text-sm">
                    {campaign.ctr}
                  </div>
                  <div className="text-xs text-[var(--color-gray-500)]">
                    CTR
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button className="p-2 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye">
                  <Eye className="w-4 h-4 text-[var(--color-gray-500)] group-hover/eye:text-[var(--color-primary-600)]" />
                </button>
                <button className="p-2 hover:bg-[var(--color-gray-100)] rounded-[var(--radius-md)] transition-colors">
                  <MoreVertical className="w-4 h-4 text-[var(--color-gray-500)]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-gray-200)]">
          <div className="text-xs sm:text-sm text-[var(--color-gray-600)] text-center sm:text-left">
            Affichage{" "}
            <span className="font-semibold text-[var(--color-gray-900)]">
              {startIndex + 1}-{Math.min(endIndex, campaigns.length)}
            </span>{" "}
            sur{" "}
            <span className="font-semibold text-[var(--color-gray-900)]">
              {campaigns.length}
            </span>{" "}
            campagnes
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-[var(--radius-md)] transition-all ${currentPage === 1 ? "opacity-50 cursor-not-allowed bg-[var(--color-gray-100)]" : "hover:bg-[var(--color-gray-100)] hover:shadow-sm"}`}
              >
                <ChevronLeft className="w-4 h-4 text-[var(--color-gray-600)]" />
              </button>

              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-[var(--radius-md)] text-xs sm:text-sm font-medium transition-all ${currentPage === index + 1 ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-sm" : "hover:bg-[var(--color-gray-100)] text-[var(--color-gray-700)]"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-[var(--radius-md)] transition-all ${currentPage === totalPages ? "opacity-50 cursor-not-allowed bg-[var(--color-gray-100)]" : "hover:bg-[var(--color-gray-100)] hover:shadow-sm"}`}
              >
                <ChevronRight className="w-4 h-4 text-[var(--color-gray-600)]" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gray-100)] rounded-full">
              <span className="text-xs text-[var(--color-gray-600)]">Page</span>
              <span className="text-xs sm:text-sm font-semibold text-[var(--color-gray-900)]">
                {currentPage}/{totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
