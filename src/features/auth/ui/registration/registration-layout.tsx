"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OwnerRegistrationForm } from "./owner-registration-form";
import { AgentRegistrationForm } from "./agent-registration-form";
import { DeveloperRegistrationForm } from "./developer-registration-form";
import { SeekerRegistrationForm } from "./seeker-registration-form";
import { useTranslations } from "next-intl";

export function RegistrationLayout() {
  const t = useTranslations("sign_up");
  const [activeTab, setActiveTab] = useState<
    "seeker" | "owner" | "agent" | "developer"
  >("seeker");

  const tabTriggerClass =
    "px-3 py-3 md:px-4 md:py-4 rounded-xl text-[10px] md:text-sm font-bold transition-all duration-300 bg-main-light-gray text-gray-400 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:border-none data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=active]:z-10";

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "seeker" | "owner" | "agent" | "developer")
      }
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8 bg-transparent h-auto p-0">
        <TabsTrigger value="seeker" className={tabTriggerClass}>
          {t("seeker")}
        </TabsTrigger>
        <TabsTrigger value="owner" className={tabTriggerClass}>
          {t("owner")}
        </TabsTrigger>
        <TabsTrigger value="agent" className={tabTriggerClass}>
          {t("broker")}
        </TabsTrigger>
        <TabsTrigger value="developer" className={tabTriggerClass}>
          {t("developer")}
        </TabsTrigger>
      </TabsList>

      <div className="lg:p-12 p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <TabsContent value="seeker" className="mt-0">
          <SeekerRegistrationForm />
        </TabsContent>
        <TabsContent value="owner" className="mt-0">
          <OwnerRegistrationForm />
        </TabsContent>
        <TabsContent value="agent" className="mt-0">
          <AgentRegistrationForm />
        </TabsContent>
        <TabsContent value="developer" className="mt-0">
          <DeveloperRegistrationForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
