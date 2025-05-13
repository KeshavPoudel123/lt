/**
 * PDF Converter - Document Conversion Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const fromFormatSelect = document.getElementById('fromFormat');
    const toFormatSelect = document.getElementById('toFormat');
    const convertButton = document.getElementById('convertButton');
    const statusDiv = document.getElementById('status');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    let selectedFile = null;

    // Defines possible conversions from a source format
    const conversionMap = {
        txt: ['pdf'],
        docx: ['pdf', 'txt'],
        image: ['pdf'],
        pdf: ['txt'],
        html_file: ['pdf']
    };

    // Event listener for file selection
    fileInput.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        downloadLinkContainer.innerHTML = ''; // Clear previous download link

        if (selectedFile) {
            statusDiv.textContent = `Selected file: ${selectedFile.name}`;
            autoDetectFromFormat(selectedFile.name);
            updateToFormatOptions(); // Update "to" options based on (potentially auto-detected) "from" format
            showNotification(`Selected file: ${selectedFile.name}`, 'info');
        } else {
            statusDiv.textContent = 'Please select a file and conversion formats to begin.';
            fromFormatSelect.value = ''; // Reset from format
            updateToFormatOptions(); // This will clear "to" options
        }
        updateConvertButtonState();
    });

    // Event listener for "Convert from" format change
    fromFormatSelect.addEventListener('change', () => {
        updateToFormatOptions();
        updateConvertButtonState();
    });

    // Event listener for "Convert to" format change
    toFormatSelect.addEventListener('change', () => {
        updateConvertButtonState();
    });

    /**
     * Attempts to auto-detect the input file format based on its extension.
     * @param {string} fileName - The name of the selected file.
     */
    function autoDetectFromFormat(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        let detectedFormat = "";
        switch (extension) {
            case 'txt': detectedFormat = 'txt'; break;
            case 'docx': detectedFormat = 'docx'; break;
            case 'jpg': case 'jpeg': case 'png': detectedFormat = 'image'; break;
            case 'pdf': detectedFormat = 'pdf'; break;
            case 'html': case 'htm': detectedFormat = 'html_file'; break;
        }
        if (detectedFormat && fromFormatSelect.querySelector(`option[value="${detectedFormat}"]`)) {
             fromFormatSelect.value = detectedFormat;
        } else {
             fromFormatSelect.value = ""; // Reset if not found or unknown
             statusDiv.textContent = `Selected file: ${fileName}. Could not auto-detect format. Please select "Convert from".`;
        }
    }

    /**
     * Updates the "Convert to" dropdown options based on the selected "Convert from" format.
     */
    function updateToFormatOptions() {
        const selectedFrom = fromFormatSelect.value;
        toFormatSelect.innerHTML = '<option value="">--Select output format--</option>'; // Reset

        if (selectedFrom && conversionMap[selectedFrom]) {
            conversionMap[selectedFrom].forEach(format => {
                const option = document.createElement('option');
                option.value = format;
                // Friendly names for formats
                let formatText = format.toUpperCase();
                if (format === 'txt') formatText = 'Text (.txt)';
                if (format === 'pdf') formatText = 'PDF (.pdf)';
                option.textContent = formatText;
                toFormatSelect.appendChild(option);
            });
        }
    }

    /**
     * Enables or disables the convert button based on whether a file and formats are selected.
     */
    function updateConvertButtonState() {
        convertButton.disabled = !(selectedFile && fromFormatSelect.value && toFormatSelect.value);
    }

    // Event listener for the convert button click
    convertButton.addEventListener('click', async () => {
        if (!selectedFile || !fromFormatSelect.value || !toFormatSelect.value) {
            showNotification('Error: Please select a file and both conversion formats.', 'error');
            statusDiv.textContent = 'Error: Please select a file and both conversion formats.';
            return;
        }

        convertButton.disabled = true;
        statusDiv.textContent = 'Processing... Please wait. This may take a moment for larger files.';
        downloadLinkContainer.innerHTML = ''; // Clear previous download links
        showNotification('Processing... Please wait.', 'info');

        const from = fromFormatSelect.value;
        const to = toFormatSelect.value;

        try {
            const reader = new FileReader();

            reader.onload = async (event) => {
                const fileContent = event.target.result; // This will be ArrayBuffer, DataURL, or Text
                let outputBlob;
                let outputFileName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name; // Name without extension

                // --- Conversion Logic ---
                if (from === 'txt' && to === 'pdf') {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    const textLines = doc.splitTextToSize(fileContent, doc.internal.pageSize.getWidth() - 20); // 20 for margins
                    doc.text(textLines, 10, 10);
                    outputBlob = doc.output('blob');
                    outputFileName += ".pdf";
                }
                else if (from === 'image' && to === 'pdf') {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    const img = new Image();
                    
                    // Wait for image to load to get its dimensions
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = fileContent; // fileContent is a DataURL from readAsDataURL
                    });

                    const imgProps = doc.getImageProperties(img);
                    const pdfWidth = doc.internal.pageSize.getWidth();
                    const pdfHeight = doc.internal.pageSize.getHeight();
                    
                    // Calculate aspect ratio
                    const imgWidth = imgProps.width;
                    const imgHeight = imgProps.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

                    const effectiveWidth = imgWidth * ratio * 0.95; // Use 95% of width/height to add some margin
                    const effectiveHeight = imgHeight * ratio * 0.95;
                    
                    const x = (pdfWidth - effectiveWidth) / 2;
                    const y = (pdfHeight - effectiveHeight) / 2;

                    doc.addImage(img, imgProps.fileType, x, y, effectiveWidth, effectiveHeight);
                    outputBlob = doc.output('blob');
                    outputFileName += ".pdf";
                }
                else if (from === 'pdf' && to === 'txt') {
                    // fileContent is an ArrayBuffer from readAsArrayBuffer
                    const loadingTask = pdfjsLib.getDocument({ data: fileContent });
                    const pdf = await loadingTask.promise;
                    let fullTextContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullTextContent += textContent.items.map(s => s.str).join(' ') + (pdf.numPages > 1 ? '\n\n--- Page ' + i + ' ---\n\n' : '');
                    }
                    outputBlob = new Blob([fullTextContent], { type: 'text/plain;charset=utf-8' });
                    outputFileName += ".txt";
                }
                else if (from === 'docx' && to === 'txt') {
                    // fileContent is an ArrayBuffer
                    const result = await mammoth.extractRawText({ arrayBuffer: fileContent });
                    outputBlob = new Blob([result.value], { type: 'text/plain;charset=utf-8' });
                    outputFileName += ".txt";
                }
                else if (from === 'docx' && to === 'pdf') {
                    // fileContent is an ArrayBuffer
                    const result = await mammoth.convertToHtml({ arrayBuffer: fileContent });
                    const htmlFromDocx = result.value;
                    
                    // Create a temporary div to hold the HTML for html2pdf
                    const element = document.createElement('div');
                    element.innerHTML = htmlFromDocx;
                    // Basic styling for the container to improve PDF layout
                    element.style.padding = "20px";
                    element.style.fontFamily = "Arial, sans-serif"; // A common font
                    element.style.lineHeight = "1.5";
                    element.style.wordWrap = "break-word"; // Prevent overflow
                    element.style.maxWidth = "210mm"; // A4 width approx in mm
                    
                    // html2pdf options
                    const opt = {
                        margin:       [15, 15, 15, 15], // margins in mm [top, left, bottom, right]
                        filename:     outputFileName + ".pdf",
                        image:        { type: 'jpeg', quality: 0.95 }, // Image settings
                        html2canvas:  { scale: 2, logging: false, useCORS: true, letterRendering: true, width: element.scrollWidth, height: element.scrollHeight, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight }, // html2canvas options
                        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }, // jsPDF options
                        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // Page break handling
                    };

                    outputBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
                    // outputFileName is already set in opt.filename
                }
                else if (from === 'html_file' && to === 'pdf') {
                    // fileContent is text (HTML string) from readAsText
                    const htmlString = fileContent;
                    const element = document.createElement('div');
                    element.innerHTML = htmlString;
                    
                    // Apply some default styling if the HTML is very basic,
                    // assuming the HTML file itself might not have comprehensive styles for print.
                    if (!element.querySelector('style') && !element.hasAttribute('style')) {
                         element.style.padding = "15mm";
                         element.style.fontFamily = "Arial, sans-serif";
                         element.style.lineHeight = "1.6";
                         element.style.fontSize = "12pt";
                    }

                    const opt = {
                        margin:       [10, 10, 10, 10], // mm
                        filename:     outputFileName + ".pdf",
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2, logging: false, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0, windowWidth: document.documentElement.scrollWidth, windowHeight: document.documentElement.scrollHeight},
                        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
                    };
                    outputBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
                    // outputFileName is already set in opt.filename
                }
                // --- End Conversion Logic ---

                if (outputBlob) {
                    const url = URL.createObjectURL(outputBlob);
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.href = url;
                    downloadAnchor.download = outputFileName; // Use the name from opt if html2pdf was used
                    downloadAnchor.textContent = `Download ${outputFileName}`;
                    downloadLinkContainer.appendChild(downloadAnchor);
                    statusDiv.textContent = 'Conversion successful! Click the link below to download.';
                    showNotification('Conversion successful! Click the link below to download.', 'success');
                    // Revoke object URL after a delay to ensure download can start
                    setTimeout(() => URL.revokeObjectURL(url), 60000); 
                } else {
                    statusDiv.textContent = 'Error: Conversion failed or this path is not fully implemented.';
                    showNotification('Error: Conversion failed or this path is not fully implemented.', 'error');
                }
            };

            reader.onerror = () => {
                statusDiv.textContent = 'Error: Could not read the selected file.';
                showNotification('Error: Could not read the selected file.', 'error');
                convertButton.disabled = false; // Re-enable button on error
            };

            // Read the file based on its expected type for the conversion
            if (from === 'image') {
                reader.readAsDataURL(selectedFile); // For images (input to <img> src)
            } else if (from === 'pdf' || from === 'docx') {
                reader.readAsArrayBuffer(selectedFile); // For PDF.js (PDF) and Mammoth.js (DOCX)
            } else { // txt, html_file
                reader.readAsText(selectedFile); // For text-based files
            }

        } catch (error) {
            console.error('Conversion Process Error:', error);
            statusDiv.textContent = `An unexpected error occurred: ${error.message}. Check console for details.`;
            showNotification(`An unexpected error occurred: ${error.message}`, 'error');
        } finally {
            // Re-enable button after processing, regardless of success or failure
            // But only if a valid selection is still present
            updateConvertButtonState();
            if (convertButton.disabled && selectedFile && fromFormatSelect.value && toFormatSelect.value) {
                 // If it should be enabled but isn't (e.g. error before this point)
                 convertButton.disabled = false;
            }
        }
    });

    /**
     * Shows a notification message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - The type of notification ('success', 'error', 'warning', 'info').
     */
    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;

        // Set icon and class based on type
        notification.className = 'notification ' + type;

        switch(type) {
            case 'success':
                notificationIcon.className = 'notification-icon fas fa-check-circle';
                break;
            case 'error':
                notificationIcon.className = 'notification-icon fas fa-times-circle';
                break;
            case 'warning':
                notificationIcon.className = 'notification-icon fas fa-exclamation-triangle';
                break;
            default:
                notificationIcon.className = 'notification-icon fas fa-info-circle';
                notification.className = 'notification info';
        }

        // Show notification
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Initial call to set up dropdowns and button state correctly
    updateToFormatOptions();
    updateConvertButtonState();
});
