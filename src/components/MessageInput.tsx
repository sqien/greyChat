import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function MessageInput(){
    const [message, setMessage] = useState('')

    const handleSend = async () => {
        const trimmed = message.trim()
        if (trimmed === '') return

        const { error } = await supabase.from('messages').insert([{ text: trimmed}])
        if (error){
            console.error('error sending message:', error)
        }else{
            setMessage('')
        }
    }

    return (
        <div className="flex gap-2 mt-4">
            <input className="flex-1 border rounded px-3 py-2"value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type your message...' />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSend}>Send</button>
        </div>
    )
}