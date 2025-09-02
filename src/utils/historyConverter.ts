export const historyConverter = (history: ChatMessage[]) => {
    return history.map(message => {
        return {
            role: message.role,
            parts: [{ text: message.text }]
        }
    })
}