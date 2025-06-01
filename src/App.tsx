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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="mb-4">
        <AuthControls />
      </div>
      
{user ? (
  <ChatWindow />
) : (
  <p className="text-center text-gray-500">Login...</p>
)}
    </div>
  )
}

export default App