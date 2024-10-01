import axios from 'axios'
import { storage } from './gsc.config'
import https from 'https'
import { checkIfFileExists } from './checkIfFileExist';
import PdfParse from 'pdf-parse'

interface PdfLink {
  url: string;
  date: string;
}
const agent = new https.Agent({
  rejectUnauthorized: false
})

export async function uploadPdf(pdfLink: PdfLink) {
  const urlParts = pdfLink.url.split('/')
  const documentId = urlParts[urlParts.length - 2]
  const fileName = `${pdfLink.date.replace(/-/g, '')}_${documentId}.pdf`

  const bucketName = process.env.GCS_BUCKET_NAME

  if (bucketName && await checkIfFileExists(bucketName, fileName)) {
    console.log(`A fájl már létezik: ${fileName}, nem töltjük fel újra.`)
    return
  }

  try {

    // const pdfResponse = await axios.get(pdfLink.url, { responseType: 'arraybuffer' })
    const pdfResponse = await axios.get(pdfLink.url, { responseType: 'arraybuffer', httpsAgent: agent })

    if (pdfResponse.data) {
      // const pdfData = await PdfParse(pdfResponse.data)
      if (bucketName) {
        const file = storage.bucket(bucketName).file(fileName);
        console.log(fileName);
        await file.save(pdfResponse.data, {
          metadata: {
            contentType: 'application/pdf',
          },
        });
      }
    }
  } catch (error) {
    console.error('Hiba a PDF letöltése vagy feltöltése során:', error);
  }
}

