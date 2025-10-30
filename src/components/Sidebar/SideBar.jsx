import React, { useState } from 'react'
import { URL } from '../../constants'

const Sidebar = () => {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState([])
  const [isFixed, setIsFixed] = useState(false) // fixed open by click
  const [isHover, setIsHover] = useState(false) // hover effect

  const payload = {
    "contents": [
      { "parts": [{ "text": question }] }
    ]
  }

  const formatText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    formatted = formatted.replace(/\n/g, '<br/>')
    return formatted
  }

  const askQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question!")
      return
    }
    setLoading(true)
    setError("")
    setResult(undefined)

    let response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    response = await response.json()
    const text = response.candidates[0].content.parts[0].text

    if (text) {
      setResult(formatText(text))
      setHistory((prev) => [question, ...prev])
      setQuestion("")
    } else {
      setError("No valid response received.")
    }

    setLoading(false)
  }

  // sidebar width logic
  const sidebarWidth = (isFixed || isHover) ? 'w-[220px]' : 'w-[100px]'

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>

      {/* left collapsible Sidebar */}
      <div
        onMouseEnter={() => !isFixed && setIsHover(true)}
        onMouseLeave={() => !isFixed && setIsHover(false)}
        className={`relative bg-blue-900 text-white ${sidebarWidth} transition-all duration-300 overflow-hidden flex flex-col py-4`}
      >
        {/* hamburger Icon */}
        <div className='flex flex-col items-center gap-4 mt-4'>
          <span
            onClick={() => setIsFixed(!isFixed)}
            className='text-xl cursor-pointer'
          >
            ☰
          </span>
        </div>

        {/* title */}
        <p className={`text-2xl font-semibold mb-4 text-center transition-opacity duration-500 ${isFixed || isHover ? 'opacity-100' : 'opacity-0'}`}>
          Recent Searches
        </p>

        {/* history list */}
        <div className='flex-1 overflow-y-auto px-2'>
          {history.length === 0 ? (
            <p className={`text-gray-200 text-sm text-center transition-opacity duration-500 ${isFixed || isHover ? 'opacity-100' : 'opacity-0'}`}>
              No searches yet
            </p>
          ) : (
            <ul className='space-y-2'>
              {history.map((item, index) => (
                <li
                  key={index}
                  className='bg-gray-600 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-500 text-sm truncate'
                  onClick={() => setQuestion(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* bottom icons */}
        <div className='flex flex-col items-center gap-4 mt-4'>
          <span className='text-xl hover:animate-spin transition-transform duration-500 cursor-pointer'>⚙️</span>
          <span className='text-xl cursor-pointer'>📜</span>
          <span className='text-xl cursor-pointer'>🔍</span>
        </div>
      </div>




      {/* main content area */}
      <div className="flex-1 flex flex-col justify-between items-center text-white text-4xl bg-gray-900">
        <div className="flex flex-col items-center justify-start w-full px-8 mt-10 text-center overflow-y-auto max-h-[80vh]">
          <p className=" relative mb-10 font-bold bg-gradient-to-r from-green-400 via-pink-500 to-orange-600 bg-clip-text text-transparent animate-gradient-move">Hello Coder, How Can I Help You?</p>

          <p className='text-lg font-semibold bg-gradient-to-t from-green-500 via-red-500 to-blue-500 text-transparent bg-clip-text absolute left-60  top-13 '>Gemini 2.5</p>

          {/*image icon */}
          <img className='absolute right-20 rounded-full h-[80px] w-20' src="https://w0.peakpx.com/wallpaper/317/115/HD-wallpaper-tony-stark-iron-man-iron-man-ironman-marvel-rdj-vectorart.jpg" alt="" />


          <div className="text-left text-xl whitespace-pre-wrap leading-relaxed text-gray-200 w-full">
            {loading && <p className='text-blue-400 text-xl'>Thinking...</p>}
            {error && <p className='text-red-500 text-xl'>{error}</p>}
            {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
          </div>
        </div>

        {/* input box */}
        <div className="w-full flex justify-center py-4 bg-cyan-600 border-t border-gray-700">
          <div className=" relative w-2/4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write something"
              className="w-full text-white border border-white bg-gray-800 rounded-full p-6 pr-20 text-xl outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && askQuestion()}   //ye dekho enter marne se automatic click hojaga button pe
            />
            <button
              onClick={askQuestion}
              disabled={loading}
              className="-mt-5 absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg disabled:opacity-50"
            >
              Ask
            </button>
            <div className='text-sm ml-15 mt-4'>
              Gemini may display inaccurate info, so double-check its responses. Your privacy & Gemini Apps
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
