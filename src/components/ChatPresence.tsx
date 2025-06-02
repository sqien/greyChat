import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

interface PresenceUser {
  username: string
  isTyping: boolean
}

export function usePresence() {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel('online-users', {
      config: {
        presence: { key: user.id },
      },
    })

    channelRef.current = channel

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          username: user.username,
          isTyping: false,
        })
      }
    })

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const users = Object.values(state).map((entries: any) => entries[0])
      setOnlineUsers(users)
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const updateTyping = (isTyping: boolean) => {
    if (!channelRef.current) return

    channelRef.current.track({
      username: 'Anon',
      isTyping,
    })
  }

  return { onlineUsers, updateTyping }
}
