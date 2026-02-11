"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FiSearch, FiHome } from "react-icons/fi";
import RequestPropertyDialog from "./request-property-dialog";
import ShowPropertyDialog from "./show-property-dialog";

interface AgentActionButtonsProps {
  agentId: string;
  agentName: string;
}

const AgentActionButtons = ({
  agentId,
  agentName,
}: AgentActionButtonsProps) => {
  const t = useTranslations("agent_profile");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [showPropertyDialogOpen, setShowPropertyDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-3">
        {/* Request Property Button */}
        <Button
          onClick={() => setRequestDialogOpen(true)}
          className="w-full bg-main-green hover:bg-main-green/90 text-white gap-2 py-6"
        >
          <FiSearch />
          {t("request_property")}
        </Button>

        {/* Show Property Button */}
        <Button
          onClick={() => setShowPropertyDialogOpen(true)}
          variant="outline"
          className="w-full border-main-green text-main-green hover:bg-main-green/10 gap-2 py-6"
        >
          <FiHome />
          {t("show_property")}
        </Button>
      </div>

      {/* Dialogs */}
      <RequestPropertyDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        agentId={agentId}
        agentName={agentName}
      />

      <ShowPropertyDialog
        open={showPropertyDialogOpen}
        onOpenChange={setShowPropertyDialogOpen}
        agentId={agentId}
        agentName={agentName}
      />
    </>
  );
};

export default AgentActionButtons;
