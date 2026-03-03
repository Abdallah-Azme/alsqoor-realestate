"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Home,
  Calendar,
  CreditCard,
  Receipt,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVerifyPayment } from "@/features/packages/hooks/use-payment";

function SuccessContent() {
  const t = useTranslations("Payment");
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const {
    data: verificationData,
    isLoading,
    isError,
  } = useVerifyPayment(paymentId);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-green-500" />
          <CardHeader className="text-center pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary">
              {t("congratulations")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("success_title")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <p className="text-center text-muted-foreground">
              {t("success_description")}
            </p>

            <div className="rounded-xl bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Receipt className="h-4 w-4" />
                  <span>{t("transaction_id")}</span>
                </div>
                <span className="font-medium font-mono">
                  {paymentId || "---"}
                </span>
              </div>

              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ) : (
                <>
                  {verificationData && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          <span>{t("amount")}</span>
                        </div>
                        <span className="font-bold text-primary">
                          {verificationData.InvoiceDisplayValue || "---"}{" "}
                          {verificationData.InvoiceDisplayCurrency || ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{t("date")}</span>
                        </div>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {!isLoading && isError && (
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-600 border border-amber-200">
                {t("verifying")}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button asChild className="w-full text-lg h-12" size="lg">
              <Link href="/profile">
                <Package className="ml-2 h-5 w-5" />
                {t("view_package")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full text-lg h-12">
              <Link href="/">
                <Home className="ml-2 h-5 w-5" />
                {t("back_home")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
