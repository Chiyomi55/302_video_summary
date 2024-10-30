'use client'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { languages } from '@/app/i18n/settings'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import ISO639 from 'iso-639-1'
import { LanguagesIcon } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'

export interface LanguageSwitchProps {
  className?: string
}
export function LanguageSwitcher({ className }: LanguageSwitchProps) {
  const { locale } = useParams()
  const pathname = usePathname()
  const { t } = useClientTranslation()
  const router = useRouter()
  const langs = languages.map((language) => {
    return {
      key: language,
      label: ISO639.getNativeName(language),
    }
  })

  const handleChangeLanguage = (language: string) => {
    if (locale === language) return
    router.push(`/${language}/${pathname.slice(locale.length + 1)}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button
            aria-label={t('extras:switch_language')}
            variant='icon'
            size='roundIconSm'
            className={cn(className)}
          >
            <LanguagesIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-describedby={undefined}>
          <DropdownMenuRadioGroup
            value={locale as string}
            onValueChange={handleChangeLanguage}
          >
            {langs.map((language) => {
              return (
                <DropdownMenuRadioItem key={language.key} value={language.key}>
                  {language.label}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
