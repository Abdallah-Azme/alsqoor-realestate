import Image from "next/image";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Tag,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Company } from "../types/partner.types";

type CompanyDetailViewProps = {
  company: Company;
  locale: string;
  labels: {
    about: string;
    contact: string;
    address: string;
    email: string;
    phone: string;
    memberSince: string;
    call: string;
    sendEmail: string;
    chatWhatsapp: string;
    whatsappMessage: string;
  };
};

function formatDate(dateString: string, locale: string) {
  try {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );
  } catch {
    return dateString;
  }
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function buildWhatsappHref(number: string | null | undefined, message: string) {
  const digits = digitsOnly(number ?? "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function CompanyDetailView({
  company,
  locale,
  labels,
}: CompanyDetailViewProps) {
  const whatsappContact = company.whatsappNumber || company.phone;
  const whatsappHref = buildWhatsappHref(
    whatsappContact,
    labels.whatsappMessage,
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-main-green/5 via-white to-emerald-50 p-8 shadow-lg shadow-main-green/5 lg:sticky lg:top-24">
          <div className="pointer-events-none absolute -end-8 -top-8 h-40 w-40 rounded-full bg-main-green/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -start-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl" />

          <div className="relative mx-auto flex aspect-square max-w-[280px] items-center justify-center rounded-2xl bg-white p-8 shadow-inner ring-1 ring-gray-100">
            <Image
              src={company.logoUrl}
              alt={company.name}
              width={200}
              height={200}
              className="h-auto max-h-48 w-full object-contain"
              priority
            />
          </div>

          <div className="relative mt-8 space-y-4 text-center">
            <h1 className="text-2xl font-bold leading-tight text-main-navy md:text-3xl">
              {company.name}
            </h1>
            {company.type && (
              <div className="inline-flex items-center gap-2 rounded-full bg-main-green/10 px-4 py-1.5">
                <Tag className="h-4 w-4 text-main-green" />
                <span className="text-sm font-medium text-main-green">
                  {company.type}
                </span>
              </div>
            )}
            {company.address && (
              <div className="flex items-start justify-center gap-2 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-main-green" />
                <p className="text-sm leading-relaxed">{company.address}</p>
              </div>
            )}

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40"
                aria-label={labels.chatWhatsapp}
              >
                <FaWhatsapp className="h-5 w-5 shrink-0" />
                {labels.chatWhatsapp}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8 lg:col-span-7">
        {company.description && (
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-main-green/10">
                <Building2 className="h-5 w-5 text-main-green" />
              </div>
              <h2 className="text-xl font-bold text-main-navy">{labels.about}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600 prose-headings:text-main-navy prose-a:text-main-green md:prose-base">
              <Markdown rehypePlugins={[rehypeRaw]}>
                {company.description}
              </Markdown>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-main-green/10">
              <Phone className="h-5 w-5 text-main-green" />
            </div>
            <h2 className="text-xl font-bold text-main-navy">{labels.contact}</h2>
          </div>

          <ul className="space-y-4">
            {company.email && (
              <li className="flex gap-4 rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-main-green/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Mail className="h-5 w-5 text-main-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">{labels.email}</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="break-all text-sm font-semibold text-main-navy hover:text-main-green"
                  >
                    {company.email}
                  </a>
                </div>
              </li>
            )}

            {company.phone && (
              <li className="flex gap-4 rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-main-green/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Phone className="h-5 w-5 text-main-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">{labels.phone}</p>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-sm font-semibold text-main-navy hover:text-main-green"
                    dir="ltr"
                  >
                    {company.phone}
                  </a>
                </div>
              </li>
            )}

            {company.address && (
              <li className="flex gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <MapPin className="h-5 w-5 text-main-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">{labels.address}</p>
                  <p className="text-sm font-semibold text-main-navy">
                    {company.address}
                  </p>
                </div>
              </li>
            )}

            {company.created_at && (
              <li className="flex gap-4 rounded-2xl border border-dashed border-gray-200 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">
                    {labels.memberSince}
                  </p>
                  <p className="text-sm font-semibold text-main-navy">
                    {formatDate(company.created_at, locale)}
                  </p>
                </div>
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-main-green px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-main-green/25 transition-all hover:bg-main-green/90"
              >
                <Phone className="h-4 w-4" />
                {labels.call}
              </a>
            )}
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-main-green/20 bg-white px-5 py-3.5 text-sm font-bold text-main-green transition-all hover:border-main-green hover:bg-main-green/5"
              >
                <Mail className="h-4 w-4" />
                {labels.sendEmail}
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600"
              >
                <FaWhatsapp className="h-5 w-5 shrink-0" />
                {labels.chatWhatsapp}
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
