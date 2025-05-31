import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

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
    <>
    <h1 className='text-center  min-h-screen'>Hello Chat!</h1>
      
    </>
  )
}

export default App
