import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onAction?: () => void;
  actionType?: "button" | "dialog";
  className?: string;
  defaultRole?: "agent" | "owner" | "developer";
}

const EmptyState = ({
  title,
  description,
  buttonText = "إضافة جديد",
  onAction,
  actionType = "button",
  className,
  defaultRole,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6 mt-6",
        className,
      )}
    >
      <div className="bg-main-green/10 p-6 rounded-full">
        <FiPlus className="h-10 w-10 text-main-green" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-main-navy">{title}</h3>
        <p className="text-gray-500 max-w-sm px-4">{description}</p>
      </div>

      {actionType === "dialog" ? (
        <CreateMarketplacePropertyDialog
          triggerClassName="bg-main-green hover:bg-main-green/90 text-white gap-2 px-8"
          buttonText={buttonText}
          defaultRole={defaultRole}
        />
      ) : (
        <Button
          onClick={onAction}
          className="bg-main-green hover:bg-main-green/90 text-white gap-2"
        >
          <FiPlus className="text-lg" />
          <span>{buttonText}</span>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
