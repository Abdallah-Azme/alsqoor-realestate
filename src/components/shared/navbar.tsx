"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserContext } from "@/context/user-context";
import { Link, useRouter } from "@/i18n/navigation";
import { LogInIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useContext } from "react";
import { FiInbox, FiPhoneCall } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineHome } from "react-icons/hi2";
import { TbBookmark, TbMessage2, TbUserPentagon } from "react-icons/tb";
import LocaleSwitcher from "./locale-switcher";
import CountrySelector from "./country-selector";
import CurrencySelector from "./currency-selector";

const LocationIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_4418_3359)">
        <path
          d="M6.94003 9.42086C6.12003 10.2009 4.83003 10.1909 4.01003 9.42086C2.89003 8.35086 1.60002 6.63086 2.07002 4.60086C2.87002 1.14086 8.08003 1.14086 8.87003 4.60086C8.99003 5.09086 9.00002 5.55086 8.94002 6.00086"
          stroke="#3fb38b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.07 16.6009C15.87 13.1409 21.11 13.1409 21.91 16.6009C22.38 18.6309 21.09 20.3509 19.96 21.4209C19.14 22.2009 17.84 22.1909 17.02 21.4209C15.89 20.3509 14.6 18.6309 15.07 16.6009Z"
          stroke="#3fb38b"
          strokeWidth="1.5"
        />
        <path
          d="M12.0002 5H14.6802C16.5302 5 17.3902 7.29 16.0002 8.51L8.01019 15.5C6.62019 16.71 7.48019 19 9.32019 19H12.0002"
          stroke="#3fb38b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.0002 5H14.6802C16.5302 5 17.3902 7.29 16.0002 8.51L8.01019 15.5C6.62019 16.71 7.48019 19 9.32019 19H12.0002"
          stroke="#3fb38b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.48622 5.5H5.49777"
          stroke="#3fb38b"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.4862 17.5H18.4978"
          stroke="#3fb38b"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4418_3359">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Navbar = ({ topnavColor = "#1a1a1a", settings = null }) => {
  const { user, logout } = useContext(UserContext);
  const t = useTranslations("Navbar");
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Extract settings data with fallbacks
  const contactInfo = settings?.contactInfo || {};
  const siteInfo = settings?.siteInfo || {};

  return (
    <div className="container py-4 space-y-2 bg-white">
      {/* info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-black md:text-xs  md:flex hidden items-center gap-2"
      >
        {/* location */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 bg-[#F5F5F5] p-2 rounded shadow-md"
        >
          <LocationIcon />
          <p>{t("address")}</p>
        </motion.div>
        {/* phone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 bg-[#F5F5F5] p-2 rounded shadow-md"
        >
          <FiPhoneCall className="text-main-green" />
          <p dir="ltr">{t("phone_default")}</p>
        </motion.div>
        {/* email */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-2 bg-[#F5F5F5] p-2 rounded shadow-md"
        >
          <FiInbox className="text-main-green" />
          <p>{t("email_default")}</p>
        </motion.div>
        {/* locale swither */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <LocaleSwitcher />
        </motion.div>
      </motion.div>
      {/* nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="px-6 py-2 rounded-t-xl flex items-center justify-between"
        style={{ backgroundColor: topnavColor }}
      >
        {/* logo */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/">
            <Image
              src={siteInfo.siteLogo || "/images/logo.svg"}
              alt={siteInfo.siteName || "logo"}
              width={300}
              height={300}
              className="size-16 "
            />
          </Link>
        </motion.div>
        {/* links */}
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.6 },
            },
          }}
          className="flex items-center gap-6 text-white text-sm max-md:hidden"
        >
          {[
            {
              href: "/",
              label: "home",
              icon: <HiOutlineHome className="text-main-green text-2xl" />,
            },
            { href: "/marketplace", label: "properties" },
            { href: "/estats", label: "ads" },
            { href: "/partners", label: "partners" },
            { href: "/deals", label: "deals" },
            { href: "/requests", label: "requests" },
            { href: "/offers", label: "offers" },
          ].map((item, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link
                href={item.href}
                className="relative flex items-center gap-1"
              >
                {item.icon}
                {t(item.label)}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="max-md:hidden flex items-center gap-2"
        >
          <CountrySelector />
          <CurrencySelector />
        </motion.div>

        {/* auth fav and cart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center gap-2 max-md:hidden"
        >
          {user && (
            <>
              <Link href="/wishlist">
                <TbBookmark className="text-white text-2xl hover:text-main-green" />
              </Link>
              <Link href="/notifications">
                <TbMessage2 className="text-white text-2xl hover:text-main-green" />
              </Link>
            </>
          )}
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-white text-sm font-medium hover:text-main-green transition-colors"
              >
                {user.name}
              </Link>
              <button onClick={handleLogout} title="Logout">
                <LogInIcon className="text-white text-2xl hover:text-main-green" />
              </button>
            </>
          ) : (
            <Link href="/auth/login">
              <TbUserPentagon className="text-white text-2xl hover:text-main-green" />
            </Link>
          )}
        </motion.div>
        {/* sheet  */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <GiHamburgerMenu className="text-white text-2xl hover:text-main-green" />
          </SheetTrigger>
          <SheetContent
            side={t("home") === "الرئيسية" ? "left" : "right"}
            className={"border-none"}
            style={{ backgroundColor: topnavColor }}
          >
            <SheetHeader>
              <SheetTitle>
                {/* logo */}
                <Link href="/">
                  <Image
                    src={siteInfo.siteLogo || "/images/logo.svg"}
                    alt={siteInfo.siteName || "logo"}
                    width={300}
                    height={300}
                    className="size-40 mx-auto "
                  />
                </Link>
              </SheetTitle>
              <SheetDescription asChild>
                <div className="space-y-6">
                  {/* links */}
                  <ul className="flex flex-col items-center gap-4 text-white text-sm ">
                    <li>
                      <Link
                        href="/"
                        className="relative flex items-center gap-1 "
                      >
                        <HiOutlineHome className="text-main-green text-2xl" />
                        {t("home")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/marketplace">{t("marketplace")}</Link>
                    </li>
                    <li>
                      <Link href="/estats">{t("ads")}</Link>
                    </li>
                    <li>
                      <Link href="/partners">{t("partners")}</Link>
                    </li>
                    <li>
                      <Link href="/offers">{t("offers")}</Link>
                    </li>
                    <li>
                      <Link href="/deals">{t("deals")}</Link>
                    </li>
                    <li>
                      <Link href="/requests">{t("requests")}</Link>
                    </li>
                  </ul>
                  {/* Country Selector for Mobile */}
                  <div className="flex justify-center gap-2 mt-4">
                    <CountrySelector />
                    <CurrencySelector />
                  </div>
                  {/* auth fav and cart */}
                  <div className="flex items-center justify-center gap-4 mt-8 ">
                    {user && (
                      <>
                        <Link href="/wishlist">
                          <TbBookmark className="text-white text-2xl hover:text-main-green" />
                        </Link>
                        <Link href="/notifications">
                          <TbMessage2 className="text-white text-2xl hover:text-main-green" />
                        </Link>
                      </>
                    )}
                    {user ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          {user.name}
                        </span>
                        <button onClick={handleLogout} title="Logout">
                          <LogInIcon className="text-white text-2xl hover:text-main-green" />
                        </button>
                      </div>
                    ) : (
                      <Link href="/auth/login">
                        <TbUserPentagon className="text-white text-2xl hover:text-main-green" />
                      </Link>
                    )}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </motion.div>
    </div>
  );
};

export default Navbar;
