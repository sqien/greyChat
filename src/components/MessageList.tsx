import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'


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
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)

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

      useEffect(() =>{
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

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

      const handleDelete = async(id: string) =>{
        const {error} = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

        if (error){
          console.error("Error: ", error)
        }else{
          setMessages((prev) => prev.filter((m) => m.id !== id))
        }
    }

  return (
    <div className="container">
    <ul className="space-y-2 mb-4 overflow-y-auto h-[calc(100vh-260px)]">
      {messages.map((msg) => (
        <li key={msg.id} className="p-2 rounded">
            <p className="font-semibold">
            Anon
            </p>

          <div className="flex min-w-full"><p>{msg.text}</p>
          {msg.user_id === user?.id && (
            <button onClick={() => handleDelete(msg.id)} className='w-full text-right mx-5 cursor-pointer text-red-500 text-sm hover:underline'>Delete</button>
          )}
          </div>
          <small className="text-xs text-gray-300">
            {new Date(msg.created_at).toLocaleTimeString()}
          </small>
        </li>
      ))}
      <div ref={scrollRef} />
    </ul>
    </div>
    
  )
}
