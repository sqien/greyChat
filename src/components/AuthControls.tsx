import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabaseClient'



export function AuthControls(){
    const { user } = useAuth()
    const [ email, setEmail ] = useState('')
    const [ sent, setSent ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const login = async () =>{
        setLoading(true)
        console.log('supabase.headers', supabase.auth)

        const { error } = await supabase.auth.signInWithOtp({ email })
        setLoading(false)
        if (error){
            alert('Error: ' + error.message)
        }else{
            setSent(true)
        }
    }


    const logout = async () => {
        await supabase.auth.signOut()
    }

    if(user){
        return(
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    {user.email}
                </span>
                <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                    Log Out
                </button>
            </div>
        )
    }

    return(
        <div className="flex flex-col gap-2 max-w-xs">
            {sent ? (
                <p className="text-green-600 text-sm">
                    Check your email, link for enter has been sent
                </p>
            ): (
                <>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Input your E-mail' className="border px-3 py-2 rounded" />
                <button onClick={login} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' disabled={loading}>
                    {loading ? 'Sending...' : 'Login / Registration'}
                </button>
                </>
            )}
        </div>
    )


    }