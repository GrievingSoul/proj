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

// --- Extending UIManager for File Handling specific UI ---
(function(UIManager) {
  // Assume UIManager core (showMessage, showLoginScreen, showAppScreen) is defined by M1
  // Add/extend functions for loading and results display specific to file operations
  const loadingDiv = document.getElementById('loading'); // M3 defines this, M2 uses
  const resultsPre = document.getElementById('results'); // M3 defines this, M2 uses
  const nextPageBtn = document.getElementById('next-page-btn'); // M3 defines this

  UIManager.showLoading = UIManager.showLoading || function(text = "Processing...") {
    if (loadingDiv) {
        const spinner = loadingDiv.querySelector('.spinner') || document.createElement('div');
        if (!spinner.classList.contains('spinner')) spinner.className = 'spinner'; // ensure spinner class
        loadingDiv.innerHTML = ''; // Clear previous content
        loadingDiv.appendChild(spinner);
        loadingDiv.appendChild(document.createTextNode(` ${text}`)); // Add text node for proper spacing
        loadingDiv.style.display = 'flex';
    }
    if (resultsPre) resultsPre.style.display = 'none';
    if (nextPageBtn) nextPageBtn.style.display = 'none';
  };

  UIManager.hideLoading = UIManager.hideLoading || function() {
    if (loadingDiv) loadingDiv.style.display = 'none';
  };

  UIManager.displayResults = UIManager.displayResults || function(text, downloadLink = null) {
    if (resultsPre) {
      resultsPre.innerHTML = ''; // Clear previous content
      resultsPre.textContent = text; // Set text content first
      if (downloadLink) {
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = downloadLink;
        downloadAnchor.textContent = 'Download Converted PDF';
        downloadAnchor.className = 'download-link'; // Ensure this class is styled (M3)
        downloadAnchor.download = 'converted_document.pdf';
        resultsPre.appendChild(document.createElement('br'));
        resultsPre.appendChild(downloadAnchor);
      }
      resultsPre.style.display = 'block';
    }
  };

  // Add clearing of converter file inputs to showAppScreen and showMainAppContent (if defined by M1/M3)
   const originalShowAppScreen = UIManager.showAppScreen;
    UIManager.showAppScreen = function() {
        if (originalShowAppScreen) originalShowAppScreen.apply(this, arguments);
        const pdfUploadInput = document.getElementById('pdf-upload-input');
        if (pdfUploadInput) pdfUploadInput.value = '';
        const docToPdfInput = document.getElementById('doc-to-pdf-upload-input');
        if (docToPdfInput) docToPdfInput.value = '';
        const imgToPdfInput = document.getElementById('img-to-pdf-upload-input');
        if (imgToPdfInput) imgToPdfInput.value = '';
        const htmlToPdfInput = document.getElementById('html-to-pdf-upload-input');
        if (htmlToPdfInput) htmlToPdfInput.value = '';
    };


})(UIManager || (UIManager = {})); // Ensure UIManager exists

// --- Main Application Logic (Event Listeners for File Inputs) ---
const pdfUploadInput = document.getElementById('pdf-upload-input');
const docToPdfUploadInput = document.getElementById('doc-to-pdf-upload-input');
const imgToPdfUploadInput = document.getElementById('img-to-pdf-upload-input');
const htmlToPdfUploadInput = document.getElementById('html-to-pdf-upload-input');
const resumeTextArea = document.getElementById('resume-text'); // Defined by M3, used by M2

if (pdfUploadInput) {
  pdfUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      UIManager.showMessage('Please upload a valid PDF file.', true); // UIManager from M1
      e.target.value = '';
      if (resumeTextArea) resumeTextArea.value = '';
      return;
    }


