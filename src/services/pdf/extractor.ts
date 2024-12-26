import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { initPdfWorker } from './worker';

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const pdfjsLib = await initPdfWorker();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textPromises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      textPromises.push(getPageText(pdf.getPage(i)));
    }
    
    const pageTexts = await Promise.all(textPromises);
    return pageTexts.join('\n').trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to read PDF file. Please make sure it\'s a valid PDF document.');
  }
}

async function getPageText(pagePromise: Promise<any>): Promise<string> {
  const page = await pagePromise;
  const textContent = await page.getTextContent();
  return textContent.items
    .map((item: TextItem) => item.str)
    .join(' ');
}