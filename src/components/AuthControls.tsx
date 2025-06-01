import {useAuth, supabase } from '../context/AuthProvider'

export function AuthControls(){
    const { user } = useAuth()

    const login = async () =>{
        await supabase.auth.signInWithOtp({email: "admin@email"})
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return user ? (
        <button onClick={logout}>Log out ({user.email})</button>
    ) : (
        <button onClick={login}>Log in</button>
    )
}