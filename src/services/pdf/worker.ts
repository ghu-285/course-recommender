import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';

// Configure the worker source
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const initPdfWorker = async () => {
  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
  return pdfjsLib;
};