import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

export function MessageInput() {
    const [message, setMessage] = useState('')
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])
    const bannedWords = [
  'fuck', 'fucking', 'bitch', 'bastard', 'asshole', 'dick', 'cunt', 'slut', 'whore', 'sex',

  'kurwa', 'chuj', 'pierdol', 'szmata', 'suka', 'jebac', 'kurwiarz',

  'сука', 'хуй', 'блядь', 'пизда', 'ебать', 'гондон', 'мразь', 'пидор',

  'niga', 'nigga', 'nigger', 'kike', 'spic', 'chink', 'tranny', 'retard', 'fag', 'faggot',

  'kill yourself', 'kms', 'die', 'rape'
]
    const handleSend = async () => {
        setLoading(true)
        const trimmed = message.trim()
        if (trimmed === '' || !user) {
            setLoading(false)
            return
        }

        const lowerMessage = trimmed.toLowerCase()
        const containsBannedWord = bannedWords.some(word => lowerMessage.includes(word))

        if(containsBannedWord){
            alert("idk why, but it's not working)")
            setLoading(false)
            return
        }

        const { error } = await supabase.from('messages').insert([
            { text: trimmed, user_id: user.id }
        ])
        setLoading(false)


        if (error) {
            console.error('error sending message:', error)
        } else {
            setMessage('')
            inputRef.current?.focus()
        }
    }
    return (
        <div className="flex gap-2 mt-4">
            <input
                ref={inputRef}
                className="flex-1 border rounded px-3 py-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
    )
}
