"use client";
import Image from "next/image";
import React from "react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { Link } from "@/i18n/navigation";
import Newsletter from "./newsletter";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const Footer = ({ settings = null }) => {
  const t = useTranslations("Footer");

  // Extract settings data with fallbacks
  const socialMedia = settings?.socialMedia || {};
  const contactInfo = settings?.contactInfo || {};
  const siteInfo = settings?.siteInfo || {};
  return (
    <footer className="mt-12">
      {/* upper footer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.6 }}
        className="bg-main-light-gray py-20"
      >
        <div className="container flex items-start lg:justify-between justify-center lg:gap-12 max-lg:flex-wrap gap-12">
          {/* info and social */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 max-lg:w-full lg:max-w-1/4"
          >
            <div className="flex items-end gap-2 w-fit max-lg:mx-auto">
              <Image
                src={siteInfo.siteLogo || "/images/footer-logo.svg"}
                alt={siteInfo.siteName || "logo"}
                width={300}
                height={300}
                className="size-12 object-contain"
              />
              <h3 className="font-bold text-2xl">{t("company_name")}</h3>
            </div>
            <p className="text-xs leading-6 max-lg:text-center">
              {t("company_description")}
            </p>
            {/* links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
              }}
              className="flex items-center gap-12 max-lg:justify-center"
            >
              {[
                { href: socialMedia.facebook || "#", Icon: FaFacebookF },
                { href: socialMedia.youtube || "#", Icon: FaYoutube },
                {
                  href: socialMedia.instagram || "#",
                  Icon: BiLogoInstagramAlt,
                  size: 28,
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className="text-main-green"
                >
                  <social.Icon
                    size={social.size || 24}
                    className="hover:scale-110 transition-all duration-300"
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          {/* important links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="shrink-0"
          >
            <h4 className="font-bold text-lg mb-6">{t("important_links")}</h4>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="space-y-6"
            >
              {[
                { href: "/about-us", label: "about_us" },
                { href: "/packages", label: "packages" },
                { href: "/complaints", label: "complaints" },
                { href: "/blogs", label: "blogs" },
                { href: "/contact-info", label: "contact_info" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className="hover:text-main-green transition-all duration-300"
                  >
                    {t(link.label)}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          {/* our services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="shrink-0"
          >
            <h4 className="font-bold text-lg mb-6">{t("our_services")}</h4>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="space-y-6"
            >
              {[
                { href: "/ads", label: "estates" },
                { href: "/partners", label: "partners" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className="hover:text-main-green transition-all duration-300"
                  >
                    {t(link.label)}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          {/* newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:w-1/3"
          >
            <Newsletter />
          </motion.div>
        </div>
      </motion.div>
      {/* lower footer */}
      <div className="container">
        <Separator className="bg-gray-200" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container py-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* terms */}
          <div className="flex items-center gap-2 flex-wrap justify-center text-gray-500">
            <Link
              href={"/terms-and-conditions"}
              className="hover:text-main-green transition-all duration-300 text-xs"
            >
              {t("terms_conditions")}
            </Link>
            <div className="w-px h-3 bg-gray-300"></div>
            <Link
              href={"/privacy-policy"}
              className="hover:text-main-green transition-all duration-300 text-xs"
            >
              {t("privacy_policy")}
            </Link>
            <div className="w-px h-3 bg-gray-300"></div>
            <Link
              href={"/ip-policy"}
              className="hover:text-main-green transition-all duration-300 text-xs"
            >
              {t("intellectual_property")}
            </Link>
            <div className="w-px h-3 bg-gray-300"></div>
            <Link
              href={"/complaints-policy"}
              className="hover:text-main-green transition-all duration-300 text-xs"
            >
              {t("complaints_policy")}
            </Link>
            <div className="w-px h-3 bg-gray-300"></div>
            <Link
              href={"/contact-info"}
              className="hover:text-main-green transition-all duration-300 text-xs"
            >
              {t("contact_info")}
            </Link>
          </div>

          {/* Certificates Display */}
          {settings?.certificates && (
            <div className="flex items-center gap-6 bg-white/50 p-3 px-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              {settings.certificates.ecommerceCertificate && (
                <div className="relative h-12 w-12 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer group">
                  <Image
                    src="/images/ecommerce-badge.png"
                    alt="E-commerce Certificate"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {t("ecommerce_cert") || "موثق"}
                  </div>
                </div>
              )}
              <div className="w-px h-8 bg-gray-200 hidden md:block" />
              <div className="flex gap-6">
                {settings.certificates.platformNameCertificate && (
                  <a
                    href={settings.certificates.platformNameCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-12 w-12 grayscale hover:grayscale-0 transition-all duration-500 group"
                  >
                    <Image
                      src="/images/trade-name-badge.png"
                      alt="Trade Name Certificate"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {t("platform_cert")}
                    </div>
                  </a>
                )}
                {settings.certificates.securityCertificateFile && (
                  <a
                    href={settings.certificates.securityCertificateFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-12 w-12 grayscale hover:grayscale-0 transition-all duration-500 group"
                  >
                    <Image
                      src="/images/security-badge.png"
                      alt="Security Certificate"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {t("security_cert")}
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* copy */}
          <p className="text-sm text-gray-500">
            {t("all_rights_reserved")}
            <a href="#" className="font-bold text-main-green mx-1">
              {t("company_short_name")}
            </a>
            2025
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
