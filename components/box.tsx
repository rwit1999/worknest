'use client'
import React from 'react'

interface BoxProps{
    children:React.ReactNode
}

const Box = ({children}:BoxProps) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default Box