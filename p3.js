// --- PDF Handling (Conceptual Module 3: PDFParser) ---
const PDFParser = (function() {

  // Helper function to display messages to the user, using UIManager if available, otherwise fallback to alert.
  function showUserMessage(message, isError = false) {
    if (typeof UIManager !== 'undefined' && UIManager.showMessage) {
      UIManager.showMessage(message, isError);
    } else {
      // Fallback if UIManager is not available or showMessage is not a function.
      alert(message);
    }
  }

  // Loads and configures the PDF.js worker.
  function loadPdfWorker() {
    if (typeof pdfjsLib === 'undefined') {
      console.error('PDF.js library (pdfjsLib) is not loaded.');
      // User message will be handled by the calling function (extractTextFromPdf)
      return false;
    }

    // Ensure GlobalWorkerOptions is available before trying to set workerSrc.
    if (pdfjsLib.GlobalWorkerOptions) {
      // Consider making this URL configurable if you host PDF.js yourself or need version flexibility.
      const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
      return true;
    } else {
      console.error('PDF.js GlobalWorkerOptions not available. Cannot set worker source.');
      return false;
    }
  }

  // Asynchronously extracts text from a given PDF file.
  async function extractTextFromPdf(file) {
    // Validate the input file
    if (!file) {
      const noFileMsg = "No file provided for PDF extraction.";
      console.error(noFileMsg);
      showUserMessage(noFileMsg, true);
      return Promise.reject(noFileMsg); // Return a rejected promise
    }
    if (!(file instanceof File)) {
      const invalidFileMsg = "Invalid input: Expected a File object for PDF extraction.";
      console.error(invalidFileMsg, file);
      showUserMessage(invalidFileMsg, true);
      return Promise.reject(invalidFileMsg);
    }

    // Attempt to load/configure the PDF.js worker.
    if (!loadPdfWorker()) {
      const libErrorMsg = 'PDF library worker could not be configured. Please ensure PDF.js is loaded and check your internet connection if using a CDN worker.';
      console.error(libErrorMsg); // Log for developers
      showUserMessage(libErrorMsg, true); // Show message to user
      return Promise.reject(libErrorMsg); // Return a rejected promise
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async function() { // Using async function for await keyword
        const typedarray = new Uint8Array(this.result);
        let pdfDocument = null; // To hold the PDF document object for cleanup

        try {
          // Load the PDF document using the typed array.
          // The {data: typedarray} object is a more robust way to pass the PDF data.
          pdfDocument = await pdfjsLib.getDocument({ data: typedarray }).promise;
          
          const numPages = pdfDocument.numPages;
          if (numPages === 0) {
            resolve(''); // No pages mean no text, resolve with empty string.
            if (pdfDocument) await pdfDocument.destroy(); // Still destroy if document was loaded
            return;
          }

          // Create an array of promises, one for each page's text content.
          const pageTextPromises = [];
          for (let i = 1; i <= numPages; i++) {
            pageTextPromises.push(
              pdfDocument.getPage(i).then(page => {
                return page.getTextContent().then(textContent => {
                  return textContent.items.map(item => item.str).join(' ');
                });
              })
            );
          }
          
          // Wait for all page text promises to resolve.
          const texts = await Promise.all(pageTextPromises);
          resolve(texts.join('\n\n')); // Join text from all pages with double newline.

        } catch (error) {
          console.error("Error processing PDF:", error);
          let userMessage = "Could not read text from PDF. The file might be corrupted, or an unknown error occurred.";
          
          // Provide more specific error messages based on the type of error.
          if (error.name === 'PasswordException' || (error.message && error.message.toLowerCase().includes('password'))) {
            userMessage = "The PDF file is encrypted and requires a password. Password-protected PDFs cannot be processed.";
          } else if (error.name === 'InvalidPDFException' || (error.message && error.message.toLowerCase().includes('invalid pdf'))) {
            userMessage = "The file is not a valid PDF or it is corrupted.";
          } else if (error.name === 'MissingPDFException' || (error.message && error.message.toLowerCase().includes('missing pdf'))) {
             userMessage = "The PDF file could not be found or is unreadable.";
          } else if (pdfDocument && pdfDocument.numPages > 0 && !error.name) {
             // If some pages were processed but an error occurred later, or if it's a generic error during text extraction
             userMessage = "Could not fully extract text from the PDF. It might contain non-standard fonts, be partially corrupted, or be image-based.";
          }
          
          showUserMessage(userMessage, true);
          reject(userMessage); // Reject the promise with the user-friendly message

        } finally {
          // Ensure PDF document resources are cleaned up to free memory.
          if (pdfDocument && typeof pdfDocument.destroy === 'function') {
            try {
              await pdfDocument.destroy();
            } catch (destroyError) {
              console.error("Error destroying PDF document:", destroyError);
              // This error typically wouldn't be shown to the user unless it's critical.
            }
          }
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        const fileReadErrorMsg = "Error reading the file. Please ensure the file is selected correctly and not damaged.";
        showUserMessage(fileReadErrorMsg, true);
        reject(fileReadErrorMsg);
      };

      // Start reading the file as an ArrayBuffer.
      reader.readAsArrayBuffer(file);
    });
  }

  // Expose public methods for the module.
  return {
    extractTextFromPdf: extractTextFromPdf,
    // You could also expose loadPdfWorker if it needs to be called during an application initialization phase:
    // initializePdfWorker: loadPdfWorker 
  };
})();
