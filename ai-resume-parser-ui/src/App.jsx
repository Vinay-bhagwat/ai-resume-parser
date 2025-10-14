import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResumeUploadForm from './ResumeUploadForm.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <ResumeUploadForm />
    </>
  )
}

export default App
