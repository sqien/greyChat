import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: number
  text: string
  created_at: string
  user_id: string
  profiles?: {
    username: string
  }
}

export function MessageList(){
    
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const loadMessages = async () =>{
            const { data, error } = await supabase
        .from('messages')
        .select(`
            id,
            text,
            created_at,
            user_id,
            profiles:profiles!user_id (
            username
            )
        `)
          .order('created_at', { ascending: true }) as unknown as { data: Message[]; error: any }



        if (!error && data) {
            setMessages(data)
        }else{
            console.error(error)
        }
    }
    loadMessages()
    }, [])

    useEffect(() => {
  const channel = supabase
    .channel('realtime-messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async (payload) => {
        const newMessage = payload.new as Omit<Message, 'profiles'>

        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', newMessage.user_id)
          .single()

        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            profiles: profileData
              ? { username: profileData.username }
              : undefined,
          },
        ])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

return (
  <ul className="space-y-2 mb-4">
    {messages.map((msg) => (
      <li key={msg.id} className="p-2 rounded bg-zinc-100 dark:bg-zinc-300">
        <p className="font-semibold">
          {msg.profiles?.username ?? 'John Doe'}
        </p>
        <p>{msg.text}</p>
        <small className="text-xs text-gray-500">
          {new Date(msg.created_at).toLocaleTimeString()}
        </small>
      </li>
    ))}
  </ul>
)

}