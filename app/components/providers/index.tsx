'use client'

import { ChatProvider } from '../chatbox/provider'
import { ThemeProvider } from './theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  )
}
