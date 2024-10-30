import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { Loader2Icon } from "lucide-react"

export const LoadingIndicator: React.FC = () => {
  const { t } = useClientTranslation()
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2Icon className="w-6 h-6 animate-spin text-primary" />
      <span className="ml-2 text-primary">{t('extras:chatbox.loading_indicator')}</span>
    </div>
  )
}
