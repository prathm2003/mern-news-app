import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function Contact(){
  const { user } = useContext(AuthContext)
  const [text, setText] = useState('')
  const sendMessage = async () => {
    try {
      await axios.post(import.meta.env.VITE_API + '/messages', { text }, {
        headers: { Authorization: 'Bearer ' + user?.token }
      })
      alert('Message sent')
    } catch (err) { alert('Login required') }
  }
  return <div><h2>Contact Admin</h2>
    <textarea className='form-control' value={text} onChange={e=>setText(e.target.value)} />
    <button className='btn btn-primary mt-2' onClick={sendMessage}>Send</button>
  </div>
}