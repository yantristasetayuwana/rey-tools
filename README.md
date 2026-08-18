# REY TOOLS — Production Architecture

30 categories × 10 tools = 300 tools.

## Privacy model
The site has no account system, no database, no localStorage, no IndexedDB, and no application memory. Supported file tools process files in the browser. External CDN libraries are loaded only for processing libraries.

## Working engines in this build
- PDF Merge — real client-side PDF merge using pdf-lib.
- PDF Split — real client-side page-range extraction using pdf-lib.
- PDF to Excel — real client-side extraction of selectable PDF text into XLSX using PDF.js + SheetJS. It is intentionally not marketed as OCR/table-perfect for scanned/image PDFs.
- Image Resizer / Compressor — browser Canvas processing.
- QR Code Generator — browser QR generation.
- JSON Formatter / Minifier.
- Password Generator using Web Crypto.
- Several text/encoding utilities through native browser APIs.

## Important
The remaining catalog entries are routed to a safe generic workspace instead of pretending to have a specialized engine. This is deliberate: unsupported OCR, AI, codec, translation, financial data, and advanced document operations should not fabricate results.

For production, each specialized engine should be implemented and tested before being labeled fully functional.
