import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'

const BASE_URL = process.env.BASE_URL
const agent = new https.Agent({
  rejectUnauthorized: false
})

interface PdfLink {
  url: string;
  date: string;
}

export async function getPdfLinks(selectedDate: Date): Promise<PdfLink[]> {
  let currentPage = 1;
  const pdfLinks: PdfLink[] = [];
  let stopScraping = false;

  while (!stopScraping) {
    const response = await axios.get(`${BASE_URL}?page=${currentPage}`, { httpsAgent: agent });
    // const response = await axios.get(`${BASE_URL}?page=${currentPage}`);
    const $ = cheerio.load(response.data);

    $('div[role="group"].btn-block.btn-group-vertical').each((index, element) => {
      const link = $(element).find('a').attr('href');
      const date = $(element).closest('div.row').find('meta[itemprop="datePublished"]').attr('content');

      if (date && link) {
        const scrapedDate = new Date(date);
        if (scrapedDate >= selectedDate && link.includes("magyarkozlony.hu/hivatalos-lapok") && link.includes("letoltes")) {
          pdfLinks.push({ url: link, date });
        } else if (scrapedDate < selectedDate) {
          stopScraping = true;
        }
      }
    });
    currentPage++;
  }
  return pdfLinks;
}