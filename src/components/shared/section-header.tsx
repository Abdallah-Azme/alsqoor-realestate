import React from 'react'

const SectionHeader = ({ children }) => {
  return (
    <h3 className='font-medium text-sm text-main-green bg-main-lighter-gray py-3 px-6 w-fit rounded-3xl rounded-br-none'>
      {children}
    </h3>
  )
}

export default SectionHeader
