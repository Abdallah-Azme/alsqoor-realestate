"use client"
import React from 'react'
import { TbFlag3 } from 'react-icons/tb'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '../../i18n/navigation'

const LocaleSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div
      onClick={toggleLanguage}
      className='flex items-center gap-2 bg-[#F5F5F5] p-2 rounded shadow-md cursor-pointer hover:bg-gray-200 transition-colors'
    >
      <TbFlag3 className='text-main-green' />
      <p className='uppercase'>{locale === 'en' ? 'ar' : 'en'}</p>
    </div>
  )
}

export default LocaleSwitcher