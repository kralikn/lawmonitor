"use client"

import { useState, ChangeEvent } from "react"
import axios from 'axios'

interface PdfLink {
  url: string;
  date: string; // vagy Date, ha a dátum objektumot szeretnél használni
}

interface ResponseMessage {
  message: string;
  error: string;
  pdfLinks: PdfLink[];
}

export default function Home() {

  const [data, setData] = useState({
    date: '2024-06-01',
    email: '',
    keywords: ''
  })

  const [responseMessage, setResponseMessage] = useState<ResponseMessage>({
    message: '',
    error: '',
    pdfLinks: []
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {

    try {
      const response = await axios.post<ResponseMessage>('/api/download', data)
      console.log('Válasz:', response.data)
      // setResponseMessage(response.data.message)
      setResponseMessage({
        message: response.data.message,
        error: '',
        pdfLinks: response.data.pdfLinks || []
      });
      // setErrorMessage('')
      setTimeout(() => {
        setResponseMessage((prevState) => ({ ...prevState, message: '', error: '' }))
      }, 5000)
    } catch (error) {
      console.error('Hiba:', error)
      if (axios.isAxiosError(error)) {
        // setErrorMessage('Hiba történt: ' + (error.response?.data?.message || error.message));
        setResponseMessage((prevState) => ({ ...prevState, message: '', error: error.response?.data?.message || error.message }))
      } else {
        // Ha nem AxiosError, kezeljük az unknown típust
        setResponseMessage((prevState) => ({ ...prevState, message: '', error: 'Hiba történt: ' + (error as Error).message }))
        // setErrorMessage('Hiba történt: ' + (error as Error).message);
      }

      setTimeout(() => {
        setResponseMessage((prevState) => ({ ...prevState, message: '', error: '' }))
      }, 5000)
    }
  }

  return (
    <div>
      <label htmlFor="date">Mikortól:</label>
      <input type="date" name="date" id="date" min="2024-06-01" value={data.date} onChange={handleChange} placeholder=""></input>
      <label htmlFor="email">E-mail:</label>
      <input type="email" name="email" id="email" value={data.email} onChange={handleChange}></input>
      <label htmlFor="keywords">Kulcsszó:</label>
      <input type="text" name="keywords" id="keywords" value={data.keywords} onChange={handleChange}></input>
      <button onClick={submit}>Küldés</button>
      {responseMessage.message && <p className="text-green-500">{responseMessage.message}</p>}
      {responseMessage.error && <p className="text-red-500">{responseMessage.error}</p>}
      {responseMessage.pdfLinks.length > 0 && (
        <div>
          <h2 className="text-lg font-bold">PDF Linkek:</h2>
          <ul>
            {responseMessage.pdfLinks.map((link, index) => {
              return (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {link.url}
                  </a> - {link.date}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
