import { getPdfLinks } from '@/lib/getPdfLinks'
import { uploadPdf } from '@/lib/uploadPdf';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const today = new Date()
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  try {
    const pdfLinks = await getPdfLinks(lastMonth)

    if (pdfLinks.length > 0) {
      for (const pdfLink of pdfLinks) {
        await uploadPdf(pdfLink)
      }
    }
    return NextResponse.json({ pdfLinks, num: pdfLinks.length })

  } catch (error) {
    throw new Error(`Error in GET: ${error}`)
  }

}