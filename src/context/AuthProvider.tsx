import { useState, useEffect, createContext, useContext } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Session, User } from '@supabase/supabase-js'

const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
)

const AuthContext = createContext<{
    user: User | null
    session: Session | null
}>({ user: null, session: null })

export const AuthProvider = ({ children }: {children: React.ReactNode}) =>{
    const [session, setSession] = useState<Session | null>(null)


useEffect(() =>{
    supabase.auth.getSession().then(({ data }) =>{
        setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) =>{
        setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
}, [])

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export { supabase }