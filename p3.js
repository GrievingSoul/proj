// --- PDF Handling (Conceptual Module 3: PDFParser) ---
const PDFParser = (function() {
  function loadPdfWorker() {
    if (typeof pdfjsLib === 'undefined') {
      console.error('PDF.js library not loaded.');
      // UIManager.showMessage might not be fully available if UIManager is split.
      // Alert is a fallback or ensure UIManager.showMessage is globally accessible.
      alert('PDF library not loaded. Please check your internet connection.');
      return false;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
    return true;
  }

  async function extractTextFromPdf(file) {
    if (!loadPdfWorker()) {
      // Fallback or ensure UIManager is accessible
      if (typeof UIManager !== 'undefined' && UIManager.showMessage) {
        UIManager.showMessage('PDF library not loaded. Please check your internet connection.', true);
      } else {
        alert('PDF library not loaded.');
      }
      return '';
    }


    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
          let textPromises = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            textPromises.push(pdf.getPage(i).then(page => page.getTextContent().then(tc => tc.items.map(item => item.str).join(' '))));
          }
          Promise.all(textPromises).then(texts => {
            resolve(texts.join('\n\n'));
          }).catch(err => {
            console.error("Error getting text content:", err);
            reject("Could not read text from PDF. It might be image-based or corrupted.");
          });
        }).catch(error => {
          console.error("Error parsing PDF:", error);
          reject("Error opening PDF file.");
        });
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject("Error reading file.");
      };
      reader.readAsArrayBuffer(file);
    });
  }

  return {
    extractTextFromPdf
  };
})();


