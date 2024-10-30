import { MessageItem } from "./message-item"
import { Message } from "./types"

export const MessageList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
