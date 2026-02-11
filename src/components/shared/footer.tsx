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
            className="flex-shrink-0"
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
            className="flex-shrink-0"
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
                { href: "/estats", label: "estates" },
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
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container py-6 flex items-center justify-between max-md:flex-col max-md:gap-4"
      >
        {/* terms */}
        <div className="flex items-center gap-2">
          <Link
            href={"/user-manual"}
            className="hover:text-main-green transition-all duration-300"
          >
            {t("user_manual")}
          </Link>
          <div className="w-[1px] h-4 bg-gray-400"></div>
          <Link
            href={"/user-manual"}
            className="hover:text-main-green transition-all duration-300"
          >
            {t("privacy_policy")}
          </Link>
        </div>
        {/* copy */}
        <p className="">
          {t("all_rights_reserved")}
          <a href="#" className="font-bold text-main-green ">
            {t("company_short_name")}
          </a>
          2025{" "}
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
