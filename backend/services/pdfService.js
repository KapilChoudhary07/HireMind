const pdfParse = require("pdf-parse");

// Buffer directly accept karta hai — disk file ki zaroorat nahi
const extractTextFromPDF = async (bufferOrPath) => {
  let dataBuffer;

  if (Buffer.isBuffer(bufferOrPath)) {
    // memoryStorage se aaya buffer
    dataBuffer = bufferOrPath;
  } else {
    // fallback: local dev mein file path se
    const fs = require("fs");
    dataBuffer = fs.readFileSync(bufferOrPath);
  }

  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
};

module.exports = {
  extractTextFromPDF,
};