"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

export default function AnimatedDoor() {
  return (
    <Link href="/estats" dir="ltr" className="block px-2 bg-white  rounded-t-[50px] mx-auto w-[230px]">
      <div className="relative   h-[268px] flex items-center justify-center   overflow-hidden">
      {/* الباب الشمال */}
      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "-75%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute left-0 bottom-0 h-[90%] w-[48%] bg-main-light-green origin-right door-left"
      />

      {/* الباب اليمين */}
      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "75%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute right-0 bottom-0 h-[90%] w-[48%] bg-main-light-green origin-left door-right"
      />

      {/* المحتوى اللي ورا الباب */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}

        className="relative z-10 text-center">
        <p className=" font-semibold">تحميل المزيد</p>
      </motion.div>
    </div>
    </Link>
  );
}
