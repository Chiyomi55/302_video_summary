import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { AlertCircle } from "lucide-react"

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  const { t } = useClientTranslation()
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">{t('extras:chatbox.error_prefix')}</strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <AlertCircle className="fill-current h-6 w-6 text-red-500" />
      </span>
    </div>
  )
}
