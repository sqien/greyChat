import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Message{
    id: string
    text: string
    created_at: string
    username: string
}

export function MessageList(){
    
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const loadMessages = async () =>{
            const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })

        if (!error && data) {
            setMessages(data)
        }
    }
    loadMessages()
    }, [])

    useEffect(() => {
        const channel = supabase
        .channel('realtime-messages')
        .on(
            'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'messages'},
        (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
        }
        )
        .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    },[])

    return(
        <ul className="space-y-2 mb-4">
            {messages.map((msg) =>(
                <li key={msg.id} className="p-2 rounded bg-zinc-100 dark:bg-zinc-300">
                    <p className="font-semibold">{msg.username}</p>
                    <p>{msg.text}</p>
                    <small className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</small>
                </li>
            ))}
        </ul>
    )
    console.log('messages state:', messages)

}