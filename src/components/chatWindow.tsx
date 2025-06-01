// import { useEffect, useRef } from "react";
// import { MessageList } from "./MessageList";
// import { MessageInput } from "./MessageInput";

// export function ChatWindow(){
//     const bottomRef = useRef<HTMLDivElement | null>(null)

//     useEffect(() =>{
//         bottomRef.current?.scrollIntoView({behavior: 'smooth'})
//     }, [])

//     return(
//         <div className="flex flex-col h-[80] border rounded shadow p-4 overflow-hidden">
//             <div className="flex-1 overflow-y-auto mb-2">
//                 <MessageList />
//                 <div ref={bottomRef} />
//             </div>
//             <div className="border-t px-4 py-3 bg-zinc-100">
//             <MessageInput />
//             </div>
//         </div>
//     )
// }

import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

export function ChatWindow() {
  return (
    <>
      <MessageList />
      <MessageInput />
    </>
  )
}
