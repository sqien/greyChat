import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

export function MessageInput() {
  const [message, setMessage] = useState('')
  const { user } = useAuth()

const handleSend = async () => {
  const trimmed = message.trim()
  if (trimmed === '' || !user) return

  const { error } = await supabase.from('messages').insert([
    { text: trimmed, user_id: user.id }
  ])

  if (error) {
    console.error('error sending message:', error)
  } else {
    setMessage('')
  }
}

  return (
    <div className="flex gap-2 mt-4">
      <input
        className="flex-1 border rounded px-3 py-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  )
}
