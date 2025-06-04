const PDFParser = (function() {

  // Helper function to display messages to the user, using UIManager if available, otherwise fallback to alert.
  function showUserMessage(message, isError = false) {
    if (typeof UIManager !== 'undefined' && UIManager.showMessage) {
      UIManager.showMessage(message, isError);
    } else {
      alert(message);
    }
  }

  // Loads and configures the PDF.js worker.
  function loadPdfWorker() {
    if (typeof pdfjsLib === 'undefined') {
      console.error('PDF.js library (pdfjsLib) is not loaded.');
      return false;
    }

    if (pdfjsLib.GlobalWorkerOptions) {
      const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
      return true;
    } else {
      console.error('PDF.js GlobalWorkerOptions not available.');
      return false;
    }
  }

  // Asynchronously extracts text from a given PDF file.
  async function extractTextFromPdf(file) {
    if (!file || !(file instanceof File)) {
      const errorMsg = "Invalid input: Expected a File object for PDF extraction.";
      console.error(errorMsg, file);
      showUserMessage(errorMsg, true);
      return Promise.reject(errorMsg);
    }

    // Read file and process PDF data
    const reader = new FileReader();
    reader.onload = async function(event) {
      const typedArray = new Uint8Array(event.target.result);
      try {
        const pdfDocument = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let extractedText = '';
        
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          extractedText += textContent.items.map(item => item.str).join(' ') + '\n';
        }

        console.log("Extracted Text:", extractedText);
        showUserMessage("PDF extraction successful!", false);
        return extractedText;
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        showUserMessage("Error extracting text from PDF.", true);
        return Promise.reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  return {
    loadPdfWorker,
    extractTextFromPdf
  };

})();

