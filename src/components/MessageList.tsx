import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: string
  text: string
  created_at: string
  user_id: string
  profiles: {
    username: string
  } | null
}

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    const loadMessages = async () => {
    const result = await supabase
    .from('messages')
    .select(`
        id,
        text,
        created_at,
        user_id,
        profiles:profiles!messages_user_id_fkey (
        username
        )
    `)
    .order('created_at', { ascending: true })


      if (result.error) {
        console.error(result.error)
        } else {
        console.log('result data:', result.data) // <- вот это
        const fixedMessages = result.data.map((msg: any) => ({
            ...msg,
            profiles: Array.isArray(msg.profiles)
            ? msg.profiles[0] ?? null
            : msg.profiles,
        })) as Message[]

        setMessages(fixedMessages)
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
                : null, 
            },
          ])
        }
      )
      .subscribe()
      console.log('messages:', messages)

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
