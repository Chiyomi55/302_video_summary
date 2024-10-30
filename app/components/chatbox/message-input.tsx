import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon, SendIcon } from "lucide-react"

export const MessageInput: React.FC<{
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
}> = ({ value, onChange, onSend, disabled }) => {
  const { t } = useClientTranslation()
  const MAX_CHARS = 500

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="p-4 border-t">
      {/* <div className="mb-2 max-h-32 overflow-y-auto">
        <ReactMarkdown className="text-sm prose dark:prose-invert max-w-none">
          {value}
        </ReactMarkdown>
      </div> */}
      <div className="flex items-center space-x-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          onKeyPress={handleKeyPress}
          placeholder={t('extras:chatbox.message_input_placeholder')}
          className="flex-grow resize-none"
          rows={3}
          disabled={disabled}
        />
        <div className="flex flex-col items-center">
          <Button
            onClick={onSend}
            disabled={disabled || value.trim() === ''}
            className="px-3 py-2"
          >
            {disabled ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
          </Button>
          <span className="text-xs text-muted-foreground mt-2">
            {value.length}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  )
}
