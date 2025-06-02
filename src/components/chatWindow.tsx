// import { useEffect, useRef } from "react";
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

export function ChatWindow() {
  // const bottomRef = useRef<HTMLDivElement | null>(null)
  //     useEffect(() =>{
  //       bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  //   }, [MessageInput])
  return (
    <>
      <MessageList />
      <MessageInput />
    </>
  )
}
