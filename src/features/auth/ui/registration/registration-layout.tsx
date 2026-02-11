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

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "seeker" | "owner" | "agent" | "developer")
      }
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-transparent h-auto">
        <TabsTrigger
          value="seeker"
          className="px-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-main-light-gray text-gray-600 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:border data-[state=active]:border-main-green data-[state=active]:shadow-xl data-[state=active]:scale-105"
        >
          {t("seeker")}
        </TabsTrigger>
        <TabsTrigger
          value="owner"
          className="px-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-main-light-gray text-gray-600 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:border data-[state=active]:border-main-green data-[state=active]:shadow-xl data-[state=active]:scale-105"
        >
          {t("owner")}
        </TabsTrigger>
        <TabsTrigger
          value="agent"
          className="px-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-main-light-gray text-gray-600 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:border data-[state=active]:border-main-green data-[state=active]:shadow-xl data-[state=active]:scale-105"
        >
          {t("broker")}
        </TabsTrigger>
        <TabsTrigger
          value="developer"
          className="px-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-main-light-gray text-gray-600 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:border data-[state=active]:border-main-green data-[state=active]:shadow-xl data-[state=active]:scale-105"
        >
          {t("developer")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="seeker">
        <SeekerRegistrationForm />
      </TabsContent>
      <TabsContent value="owner">
        <OwnerRegistrationForm />
      </TabsContent>
      <TabsContent value="agent">
        <AgentRegistrationForm />
      </TabsContent>
      <TabsContent value="developer">
        <DeveloperRegistrationForm />
      </TabsContent>
    </Tabs>
  );
}
