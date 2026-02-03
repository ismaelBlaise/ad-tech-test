/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Target,
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  MousePointer,
} from "lucide-react";
import { toast } from "react-toastify";
import type { CampaignStatus } from "../types/campaigns";
import { useCreateCampaign } from "../hooks/useCreateCampaign";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const createCampaignMutation = useCreateCampaign();

  const [formData, setFormData] = useState({
    name: "",
    advertiser: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE" as CampaignStatus,
    impressions: "",
    clicks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la campagne est requis";
    }
    if (!formData.advertiser.trim()) {
      newErrors.advertiser = "Le nom de l'annonceur est requis";
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      newErrors.budget = "Le budget doit être supérieur à 0";
    }
    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }
    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate =
          "La date de fin doit être postérieure à la date de début";
      }
    }

    const impressions = formData.impressions ? Number(formData.impressions) : 0;
    const clicks = formData.clicks ? Number(formData.clicks) : 0;

    if (impressions < 0) {
      newErrors.impressions =
        "Le nombre d'impressions ne peut pas être négatif";
    }
    if (clicks < 0) {
      newErrors.clicks = "Le nombre de clics ne peut pas être négatif";
    }
    if (clicks > impressions) {
      newErrors.clicks =
        "Le nombre de clics ne peut pas être supérieur au nombre d'impressions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCTR = (): string => {
    const impressions = formData.impressions ? Number(formData.impressions) : 0;
    const clicks = formData.clicks ? Number(formData.clicks) : 0;

    if (impressions === 0) return "0%";
    const ctr = (clicks / impressions) * 100;
    return `${ctr.toFixed(2).replace(".", ",")}%`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      await createCampaignMutation.mutateAsync({
        name: formData.name,
        advertiser: formData.advertiser,
        budget: Number(formData.budget),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
        impressions: formData.impressions ? Number(formData.impressions) : 0,
        clicks: formData.clicks ? Number(formData.clicks) : 0,
      });

      toast.success("Campagne créée avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/campaigns");
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la campagne",
        {
          position: "top-right",
          autoClose: 5000,
        },
      );
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const today = new Date().toISOString().split("T")[0];
  const impressions = formData.impressions ? Number(formData.impressions) : 0;
  const clicks = formData.clicks ? Number(formData.clicks) : 0;
  const ctr = calculateCTR();
  const isCtrGood = parseFloat(ctr) > 2.0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>
        </div>

        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-gray-200)] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nouvelle campagne</h1>
                <p className="text-white/80 text-sm mt-1">
                  Créez une nouvelle campagne publicitaire
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[var(--color-primary-600)]" />
                    Informations de base
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Nom de la campagne *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                        }`}
                        placeholder="Ex: Campagne Noël 2026"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Annonceur *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="w-4 h-4 text-[var(--color-gray-400)]" />
                        </div>
                        <input
                          type="text"
                          name="advertiser"
                          value={formData.advertiser}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                            errors.advertiser
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                          }`}
                          placeholder="Ex: Nike"
                        />
                      </div>
                      {errors.advertiser && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.advertiser}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Budget (€) *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <DollarSign className="w-4 h-4 text-[var(--color-gray-400)]" />
                        </div>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          min="1"
                          step="0.01"
                          className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                            errors.budget
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                          }`}
                          placeholder="5000"
                        />
                      </div>
                      {errors.budget && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.budget}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">En pause</option>
                        <option value="FINISHED">Terminée</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--color-primary-600)]" />
                    Période de la campagne
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={today}
                        className={`w-full px-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                          errors.startDate
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                        }`}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || today}
                        className={`w-full px-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                          errors.endDate
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                        }`}
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--color-primary-600)]" />
                    Métriques initiales (optionnelles)
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Impressions
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Eye className="w-4 h-4 text-[var(--color-gray-400)]" />
                        </div>
                        <input
                          type="number"
                          name="impressions"
                          value={formData.impressions}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                            errors.impressions
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                          }`}
                          placeholder="0"
                        />
                      </div>
                      {errors.impressions && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.impressions}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Clics
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <MousePointer className="w-4 h-4 text-[var(--color-gray-400)]" />
                        </div>
                        <input
                          type="number"
                          name="clicks"
                          value={formData.clicks}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-md)] text-sm ${
                            errors.clicks
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-[var(--color-gray-300)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                          }`}
                          placeholder="0"
                        />
                      </div>
                      {errors.clicks && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.clicks}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-gray-50)] to-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4">
                    Aperçu des performances
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[var(--color-gray-500)] mb-1">
                        Impressions
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                        {formatNumber(impressions)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-[var(--color-gray-500)] mb-1">
                        Clics
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                        {formatNumber(clicks)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-[var(--color-gray-500)] mb-1">
                        CTR (Taux de clic)
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-gray-900)] flex items-center gap-2">
                        {ctr}
                        {impressions > 0 &&
                          clicks > 0 &&
                          (isCtrGood ? (
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-amber-500" />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-gray-200)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-sm font-medium text-[var(--color-gray-700)] bg-white border border-[var(--color-gray-300)] hover:bg-[var(--color-gray-50)] rounded-[var(--radius-md)] transition-colors w-full sm:w-auto"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createCampaignMutation.isPending}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)] rounded-[var(--radius-md)] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {createCampaignMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création en cours...
                    </span>
                  ) : (
                    "Créer la campagne"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
