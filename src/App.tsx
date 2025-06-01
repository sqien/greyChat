import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { MessageInput } from './components/MessageInput'
import { MessageList } from './components/MessageList'

function App() {
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
      <MessageList />
      <MessageInput />
    </div>
  )
}

export default App