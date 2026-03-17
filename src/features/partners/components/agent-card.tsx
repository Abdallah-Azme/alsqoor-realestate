"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Phone, MessageSquare, BadgeCheck, Building2, User, Calendar, ExternalLink } from "lucide-react";
import { Agent } from "../types/partner.types";
import { Link } from "@/i18n/navigation";

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const t = useTranslations("agents");

  const isIndividual = agent.agentType === "individual";
  const avatar = isIndividual ? agent.avatarUrl : (agent.companyLogoUrl || agent.avatarUrl);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
      {/* Top Banner / Decorative Element */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-main-green/10 via-emerald-50 to-main-green/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 pt-10 flex-1 flex flex-col">
        {/* Header: Avatar and Badges */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-tr from-main-green to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              <Image
                src={avatar || "/placeholder-avatar.png"}
                alt={agent.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Removed falLicenseStatus badge as requested */}
            
            {agent.mobileVerified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-semibold border border-blue-100">
                <BadgeCheck className="w-3 h-3" />
                {t('verified')}
              </div>
            )}
          </div>
        </div>

        {/* Content: Name and Type */}
        <div className="space-y-3 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-main-green transition-colors line-clamp-1">
                {agent.name}
              </h3>
              {isIndividual ? (
                <User className="w-4 h-4 text-gray-400" />
              ) : (
                <Building2 className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-main-green" />
                {t(agent.agentType || 'individual')}
              </p>
              {agent.companyName && (
                <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-main-green" />
                  {agent.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-3 py-4 border-y border-gray-50 mb-6 mt-auto">
          {agent.falNumber && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-main-green" />
                {t('fal_number')}
              </span>
              <span className="font-mono font-semibold text-gray-700">{agent.falNumber}</span>
            </div>
          )}
          
          {agent.falExpiryDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-main-green" />
                {t('license_status')}
              </span>
              <span className="text-gray-700 font-medium">{agent.falExpiryDate}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          {(agent.mobile || agent.whatsapp) && (
            <div className="flex gap-2">
              {agent.mobile && (
                <a 
                  href={`tel:${agent.mobile}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-main-green hover:text-white text-gray-700 font-semibold text-sm transition-all duration-300 border border-gray-100 hover:border-main-green"
                  title={t('call')}
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}

              {agent.whatsapp && (
                <a 
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 font-semibold text-sm transition-all duration-300 border border-emerald-100 hover:border-emerald-500"
                  title={t('whatsapp')}
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
          
          <Link 
            href={`/partners/${agent.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-main-green text-white font-bold text-sm shadow-lg shadow-main-green/20 hover:shadow-main-green/40 hover:bg-main-green/90 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
            {t('view_profile')}
          </Link>
        </div>
      </div>
    </div>
  );
};
