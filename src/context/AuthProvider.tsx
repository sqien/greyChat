import { useState, useEffect, createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type ExtendedUser = {
  id: string
  email: string | null | undefined
  username: string
}

const AuthContext = createContext<{
  user: ExtendedUser | null
  session: Session | null
}>({ user: null, session: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<ExtendedUser | null>(null)

 useEffect(() => {
    const getProfile = async (session: Session | null) => {
      if (!session?.user) {
        setUser(null)
        return
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        setUser(null)
      } else {
      setUser({
        id: session.user.id,
        email: session.user.email ?? null,
        username: profile?.username || 'Anon',
      })

      }
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      getProfile(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        getProfile(newSession)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
