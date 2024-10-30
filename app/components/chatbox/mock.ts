const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getAIResponse = async (userMessage: string): Promise<string> => {
  await delay(1000)
  const responses = [
    "That's an interesting question! Let me think about it...",
    "I understand your query. Here's what I found:",
    "Based on my knowledge, I can say that...",
    "That's a complex topic. Let me break it down for you:",
    "I'm not entirely sure, but here's my best attempt at an answer:",
  ]
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  return `${randomResponse}\n\nYou asked: "${userMessage}"\n\nHere's some more information in **Markdown**:\n\n- Point 1\n- Point 2\n- Point 3\n\n\`\`\`\nconst code = 'example';\nconsole.log(code);\n\`\`\``
}
