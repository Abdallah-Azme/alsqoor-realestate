"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, MessageCircle, Home } from "lucide-react";
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

function FailContent() {
  const t = useTranslations("Payment");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-red-500" />
          <CardHeader className="text-center pt-8">
            <motion.div
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600"
            >
              <XCircle className="h-12 w-12" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-red-600">
              {t("payment_failed")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("fail_title")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <p className="text-center text-muted-foreground">
              {t("fail_description")}
            </p>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 font-mono text-xs text-red-700 border border-red-100">
                <span className="font-bold mr-2 uppercase">Error:</span>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-6 text-sm text-center">
              <p className="font-medium text-foreground">
                {t("common.error.description")}
              </p>
              <div className="flex items-center justify-center gap-4 text-primary">
                <Link
                  href="/contact-info"
                  className="flex items-center gap-1 hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t("Footer.contact_info")}</span>
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button asChild className="w-full text-lg h-12" size="lg">
              <Link href="/packages">
                <RefreshCw className="ml-2 h-5 w-5" />
                {t("try_again")}
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

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
