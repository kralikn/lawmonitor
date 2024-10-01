import { NextResponse } from 'next/server'
import { getPdfLinks } from '../../../lib/getPdfLinks'
import { uploadPdf } from '../../../lib/uploadPdf'
import https from 'https'


const agent = new https.Agent({
  rejectUnauthorized: false
})

export async function POST(request: Request) {

  const data = await request.json()
  const selectedDate = new Date(data.date)

  try {
    const pdfLinks = await getPdfLinks(selectedDate)
    for (const pdfLink of pdfLinks) {
      await uploadPdf(pdfLink)
    }
    return NextResponse.json({ message: "Sikeres lekérdezés", pdfLinks })

  } catch (error) {
    console.error('Hiba történt:', error)
    return NextResponse.json({ message: 'Hiba történt az adatok feldolgozása során.' }, { status: 500 })
  }
}