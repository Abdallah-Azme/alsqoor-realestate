"use client";

import { useActiveAgents } from "../hooks/use-partners";
import { AgentCard } from "./agent-card";
import { AgentCardSkeleton } from "./agent-card-skeleton";
import { AnimatedSection, AnimatedItem } from "@/components/motion/animated-section";
import { useTranslations } from "next-intl";

const SKELETON_COUNT = 8;

export const PartnersList = () => {
  const { data: agents, isLoading, error } = useActiveAgents();
  const t = useTranslations("agents");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Error loading partners. Please try again later.</p>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-lg font-medium">{t('no_agents')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {agents.map((agent, index) => (
        <AnimatedItem key={agent.id} index={index}>
          <AgentCard agent={agent} />
        </AnimatedItem>
      ))}
    </div>
  );
};
