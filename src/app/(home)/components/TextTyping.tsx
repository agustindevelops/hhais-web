"use client"
import Typist from 'react-text-typist'

const TextTyping = () => {
  return (
    <Typist
      typingSpeed={1500}
      deletingSpeed={700}
      showCursor={false}
      startDelay={100}
      cursorSmooth
      pauseTime={2500}
      className="typewrite capitalize relative text-primary underline" data-period={2000} sentences={["Ai Content", "NFTs", "Ai Image Generator", "Video Creator", "Ai Business Tools"]} />
  )
}

export default TextTyping