import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { AuthControls } from './components/AuthControls'
import { useAuth } from './context/AuthProvider'
import { ChatWindow } from './components/chatWindow'

function App() {
  const { user } = useAuth()
  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .then((res) => {
        console.log('messages:', res.data)
      })
  }, [])

  return (
    <div className="background pt-5">
    <div className="blur-circle"></div>
    <div className="blur-circle-dark"></div>
    <div className="container-chat mx-auto">
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="mb-4">
        <AuthControls />
      
      
{user ? (
  <div className="mt-2">
  <ChatWindow />
  </div>
) : (
  <p className="text-center text-gray-500">Login...</p>
)}
    </div>
    </div>
    </div>
    </div>
  )
}

export default App