import { continueConversation } from '@/app/actions/summary'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { save } from '@/lib/db'
import { logger } from '@/lib/logger'
import { readStreamableValue } from 'ai/rsc'
import { env } from 'next-runtime-env'
import { isFunction } from 'radash'
import { createContext, useCallback, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ChatContextType, Message } from './types'
// Context
export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useClientTranslation()
  const apiKey = env('NEXT_PUBLIC_API_KEY')
  const modelName = env('NEXT_PUBLIC_MODEL_NAME')
  const { title, detailedSummary, chatMessages, updateVideoInfo } =
    useVideoInfoStore((state) => ({
      title: state.title,
      detailedSummary: state.detail,
      chatMessages: state.chatMessages,
      updateVideoInfo: state.updateAll,
    }))
  const initialMessages = useMemo<Message[]>(() => {
    return [
      {
        id: uuidv4(),
        sender: 'assistant' as const,
        content: t('extras:chatbox.welcome_message'),
        timestamp: new Date().toISOString(),
      },
    ]
  }, [t])

  const messages = useMemo<Message[]>(() => {
    return chatMessages?.length ? chatMessages : initialMessages
  }, [chatMessages, initialMessages])

  const setMessages = useCallback(
    (updateMessages: ((oldMessages: Message[]) => Message[]) | Message[]) => {
      updateVideoInfo({
        chatMessages: isFunction(updateMessages)
          ? updateMessages(useVideoInfoStore.getState().chatMessages ?? [])
          : updateMessages,
      })
      save(useVideoInfoStore.getState())
    },
    [updateVideoInfo]
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoInfo = useMemo<string>(
    () =>
      `
<VideoInfo>
<Title>${title}</Title>
<DetailedSummary>${detailedSummary}</DetailedSummary>
</VideoInfo>`,
    [detailedSummary, title]
  )

  const addMessage = useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>) => {
      const newMessage: Message = {
        ...message,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
    },
    [setMessages]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (content.trim() === '') return

      addMessage({ sender: 'user', content })
      setIsLoading(true)
      setError(null)

      try {
        const { output } = await continueConversation(
          [
            ...messages,
            {
              sender: 'user',
              content,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
            },
          ],
          videoInfo,
          apiKey ?? '',
          modelName ?? ''
        )
        let aiResponse = ''
        for await (const text of readStreamableValue(output)) {
          aiResponse += text
        }
        addMessage({ sender: 'assistant', content: aiResponse })
      } catch (err) {
        setError(t('extras:chatbox.error_getting_response'))
        setMessages((prevMessages) => prevMessages.slice(0, -1))
        logger.error('Error getting AI response: %o', err)
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, t, messages, videoInfo, apiKey, modelName, setMessages]
  )

  const clearMessages = useCallback(() => {
    setMessages(initialMessages)
  }, [initialMessages, setMessages])

  const resetMessages = useCallback(() => {
    updateVideoInfo({ chatMessages: initialMessages })
  }, [initialMessages, updateVideoInfo])

  const value = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    resetMessages,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}