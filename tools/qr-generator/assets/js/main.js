// ===== QR GENERATOR SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the QR code generator
    initQRGenerator();

    // Initialize QR code scanner
    initQRScanner();

    // Initialize QR code history
    initQRHistory();

    // Initialize tab navigation
    initTabs();

    // Initialize settings
    initSettings();
});

/**
 * Initialize tab navigation
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.id;
            const contentId = tabId + '-content';
            document.getElementById(contentId).classList.add('active');
        });
    });
}

/**
 * Show notification - Apple-like style
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Get notification element
    const notification = document.getElementById('notification');

    if (!notification) return;

    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }

    // Set icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = 'check_circle';
            break;
        case 'warning':
            icon = 'warning';
            break;
        case 'error':
            icon = 'error';
            break;
        default:
            icon = 'info';
    }

    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <i class="material-icons">${icon}</i>
            <span id="notification-message">${message}</span>
        </div>
    `;

    // Set notification type
    notification.className = `notification ${type}`;

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 3 seconds
    window.notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the QR code generator
 */
function initQRGenerator() {
    // Get DOM elements
    const contentTypeSelect = document.getElementById('content-type');
    const contentInputs = document.querySelectorAll('.content-input');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const logoUpload = document.getElementById('logo-upload');
    const qrSizeSlider = document.getElementById('qr-size');
    const qrSizeValue = document.getElementById('qr-size-value');
    const shareBtn = document.getElementById('share-btn');
    const showPasswordCheckbox = document.getElementById('show-password');

    // Generate initial QR code
    generateQRCode();

    // Content type change event
    if (contentTypeSelect) {
        contentTypeSelect.addEventListener('change', () => {
            // Hide all content inputs
            contentInputs.forEach(input => {
                input.style.display = 'none';
            });

            // Show selected content input
            const selectedType = contentTypeSelect.value;
            const selectedInput = document.getElementById(`${selectedType}-input`);
            if (selectedInput) {
                selectedInput.style.display = 'block';
            }
        });
    }

    // Handle logo upload
    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Auto-generate QR code if one already exists
                if (qrCodeContainer.querySelector('canvas')) {
                    generateQRCode();
                }
            }
        });
    }

    // Handle QR size slider
    if (qrSizeSlider && qrSizeValue) {
        qrSizeSlider.addEventListener('input', () => {
            qrSizeValue.textContent = `${qrSizeSlider.value} x ${qrSizeSlider.value}`;

            // Auto-generate QR code if one already exists
            if (qrCodeContainer.querySelector('canvas')) {
                generateQRCode();
            }
        });
    }

    // Handle show password checkbox
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', () => {
            const passwordInput = document.getElementById('wifi-password');
            if (passwordInput) {
                passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
            }
        });
    }

    // Generate button click event
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateQRCode();
        });
    }

    // Reset form
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Clear form inputs based on content type
            const contentType = contentTypeSelect.value;

            switch (contentType) {
                case 'url':
                    document.getElementById('url').value = '';
                    break;

                case 'text':
                    document.getElementById('text').value = '';
                    break;

                case 'vcard':
                    document.getElementById('vcard-name').value = '';
                    document.getElementById('vcard-email').value = '';
                    document.getElementById('vcard-phone').value = '';
                    document.getElementById('vcard-company').value = '';
                    document.getElementById('vcard-website').value = '';
                    break;

                case 'email':
                    document.getElementById('email-address').value = '';
                    document.getElementById('email-subject').value = '';
                    document.getElementById('email-body').value = '';
                    break;

                case 'sms':
                    document.getElementById('sms-number').value = '';
                    document.getElementById('sms-message').value = '';
                    break;

                case 'wifi':
                    document.getElementById('wifi-ssid').value = '';
                    document.getElementById('wifi-password').value = '';
                    document.getElementById('wifi-encryption').value = 'WPA';
                    document.getElementById('wifi-hidden').checked = false;
                    break;
            }

            // Reset color pickers
            document.getElementById('foreground-color').value = '#000000';
            document.getElementById('background-color').value = '#FFFFFF';

            // Reset error correction
            document.getElementById('error-correction').value = 'M';

            // Reset QR style
            if (document.getElementById('qr-style')) {
                document.getElementById('qr-style').value = 'square';
            }

            // Reset QR size
            if (qrSizeSlider && qrSizeValue) {
                qrSizeSlider.value = 256;
                qrSizeValue.textContent = '256 x 256';
            }

            // Reset logo
            if (logoUpload) {
                logoUpload.value = '';
            }

            // Clear QR code
            qrCodeContainer.innerHTML = '';

            showNotification('Form reset', 'info');
        });
    }

    // Download buttons click events
    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadQRCode('png');
        });
    }

    if (downloadSvgBtn) {
        downloadSvgBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadQRCode('svg');
        });
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadQRCode('pdf');
        });
    }

    // Share button
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const canvas = document.querySelector('#qr-code canvas');
            if (!canvas) {
                showNotification('No QR code to share', 'error');
                return;
            }

            // Check if Web Share API is supported
            if (navigator.share) {
                canvas.toBlob(blob => {
                    const file = new File([blob], 'qrcode.png', { type: 'image/png' });

                    navigator.share({
                        title: 'QR Code',
                        text: 'Check out this QR code I generated!',
                        files: [file]
                    })
                    .then(() => {
                        showNotification('QR code shared successfully', 'success');
                    })
                    .catch(error => {
                        console.error('Error sharing:', error);
                        showNotification('Failed to share QR code', 'error');
                    });
                });
            } else {
                showNotification('Web Share API not supported in your browser', 'warning');
            }
        });
    }
}

/**
 * Get QR code content based on selected type
 * @returns {string} - QR code content
 */
function getQRContent() {
    const contentType = document.getElementById('content-type').value;

    switch (contentType) {
        case 'url':
            return document.getElementById('url').value || 'https://latestonlinetools.com';

        case 'text':
            return document.getElementById('text').value || 'Sample QR Code';

        case 'vcard':
            const name = document.getElementById('vcard-name').value || '';
            const email = document.getElementById('vcard-email').value || '';
            const phone = document.getElementById('vcard-phone').value || '';
            const company = document.getElementById('vcard-company').value || '';
            const website = document.getElementById('vcard-website').value || '';

            if (!name) return '';

            // Create vCard format
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vcard += `FN:${name}\n`;
            if (email) vcard += `EMAIL:${email}\n`;
            if (phone) vcard += `TEL:${phone}\n`;
            if (company) vcard += `ORG:${company}\n`;
            if (website) vcard += `URL:${website}\n`;
            vcard += 'END:VCARD';

            return vcard;

        case 'email':
            const emailAddress = document.getElementById('email-address').value || '';
            const emailSubject = document.getElementById('email-subject').value || '';
            const emailBody = document.getElementById('email-body').value || '';

            if (!emailAddress) return '';

            let emailUrl = `mailto:${emailAddress}`;
            const params = [];

            if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
            if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);

            if (params.length > 0) {
                emailUrl += '?' + params.join('&');
            }

            return emailUrl;

        case 'sms':
            const smsNumber = document.getElementById('sms-number').value || '';
            const smsMessage = document.getElementById('sms-message').value || '';

            if (!smsNumber) return '';

            let smsUrl = `sms:${smsNumber}`;
            if (smsMessage) {
                smsUrl += `?body=${encodeURIComponent(smsMessage)}`;
            }

            return smsUrl;

        case 'wifi':
            const wifiSsid = document.getElementById('wifi-ssid').value || '';
            const wifiPassword = document.getElementById('wifi-password').value || '';
            const wifiEncryption = document.getElementById('wifi-encryption').value;
            const wifiHidden = document.getElementById('wifi-hidden').checked;

            if (!wifiSsid) return '';

            let wifiString = 'WIFI:';
            wifiString += `S:${wifiSsid};`;

            if (wifiEncryption !== 'nopass') {
                wifiString += `T:${wifiEncryption};`;
                if (wifiPassword) {
                    wifiString += `P:${wifiPassword};`;
                }
            } else {
                wifiString += 'T:nopass;';
            }

            if (wifiHidden) {
                wifiString += 'H:true;';
            }

            wifiString += ';';

            return wifiString;
    }

    return '';
}

/**
 * Generate QR code based on form inputs
 */
function generateQRCode() {
    // Get form values
    const contentType = document.getElementById('content-type').value;
    const qrStyle = document.getElementById('qr-style')?.value || 'square';
    const qrSize = document.getElementById('qr-size')?.value || 256;
    const foregroundColor = document.getElementById('foreground-color').value;
    const backgroundColor = document.getElementById('background-color').value;
    const errorCorrection = document.getElementById('error-correction').value;
    const logoUpload = document.getElementById('logo-upload').files[0];

    // Get content based on selected type
    const content = getQRContent();
    if (!content) {
        showNotification('Please enter content for the QR code', 'error');
        return;
    }

    // QR code options
    const options = {
        errorCorrectionLevel: errorCorrection,
        margin: 4,
        width: parseInt(qrSize),
        height: parseInt(qrSize),
        color: {
            dark: foregroundColor,
            light: backgroundColor
        }
    };

    // Add style options
    if (qrStyle === 'rounded') {
        options.cornerRadius = 10;
    } else if (qrStyle === 'dots') {
        options.cornerRadius = 50;
    }

    // Generate QR code
    const qrCodeContainer = document.getElementById('qr-code');
    qrCodeContainer.innerHTML = '';

    // Track analytics
    trackAnalytics('qr.generated', { type: contentType });

    // Generate QR code with logo if provided
    if (logoUpload) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logo = new Image();
            logo.src = e.target.result;
            logo.onload = function() {
                generateQRWithLogo(content, options, logo);
                showNotification('QR code generated successfully!', 'success');
            };
        };
        reader.readAsDataURL(logoUpload);
    } else {
        // Generate QR code without logo
        try {
            const canvas = document.createElement('canvas');
            QRCode.toCanvas(canvas, content, options, function(error) {
                if (error) {
                    console.error(error);
                    showNotification('Error generating QR code', 'error');
                    return;
                }

                qrCodeContainer.appendChild(canvas);
                showNotification('QR code generated successfully!', 'success');
            });
        } catch (error) {
            console.error(error);
            showNotification('Error generating QR code', 'error');
        }
    }
}

/**
 * Generate QR code with logo
 * @param {string} content - The content to encode
 * @param {object} options - QR code options
 * @param {Image} logo - The logo image
 */
function generateQRWithLogo(content, options, logo) {
    const qrCodeContainer = document.getElementById('qr-code');

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Generate QR code on canvas
    QRCode.toCanvas(canvas, content, options, function(error) {
        if (error) {
            console.error(error);
            showNotification('Error generating QR code', 'error');
            return;
        }

        // Calculate logo size (25% of QR code)
        const logoSize = canvas.width * 0.25;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        // Draw logo on QR code
        ctx.fillStyle = 'white';
        ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        // Add canvas to container
        qrCodeContainer.appendChild(canvas);
    });
}

/**
 * Download QR code
 * @param {string} format - The format to download (png, svg, pdf)
 */
function downloadQRCode(format) {
    const canvas = document.querySelector('#qr-code canvas');

    if (!canvas) {
        showNotification('No QR code to download', 'error');
        return;
    }

    const contentType = document.getElementById('content-type').value;
    let fileName = `qrcode_${new Date().getTime()}`;

    switch (format) {
        case 'png':
            // Download as PNG
            const pngUrl = canvas.toDataURL('image/png');
            const pngLink = document.createElement('a');
            pngLink.href = pngUrl;
            pngLink.download = `${fileName}.png`;
            pngLink.click();
            break;

        case 'svg':
            // Convert canvas to SVG
            const svgData = canvasToSVG(canvas);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const svgLink = document.createElement('a');
            svgLink.href = svgUrl;
            svgLink.download = `${fileName}.svg`;
            svgLink.click();
            URL.revokeObjectURL(svgUrl);
            break;

        case 'pdf':
            // Create PDF (simplified version)
            const pdfData = canvasToPDF(canvas);
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const pdfLink = document.createElement('a');
            pdfLink.href = pdfUrl;
            pdfLink.download = `${fileName}.pdf`;
            pdfLink.click();
            URL.revokeObjectURL(pdfUrl);
            break;
    }

    // Track download
    trackAnalytics('qr.downloaded', { format });
}

/**
 * Convert canvas to SVG
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {string} - SVG data
 */
function canvasToSVG(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Add background
    svg += `<rect width="${width}" height="${height}" fill="${document.getElementById('background-color').value}"/>`;

    // Add QR code pixels
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            // Only add dark pixels (QR code)
            if (r < 128 && g < 128 && b < 128 && a > 0) {
                svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${document.getElementById('foreground-color').value}"/>`;
            }
        }
    }

    svg += '</svg>';
    return svg;
}

/**
 * Convert canvas to PDF using jsPDF
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {Blob} - PDF data as Blob
 */
function canvasToPDF(canvas) {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Get canvas data as image
    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions to fit on A4 page with margins
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // 20mm margin
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calculate image dimensions to maintain aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Calculate position to center the image
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    // Add QR code image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

    // Add metadata
    const contentType = document.getElementById('content-type').value;
    const content = getQRContent();

    // Add title and content info at the bottom
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`QR Code - ${contentType.toUpperCase()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Convert to blob
    return pdf.output('blob');
}

/**
 * Initialize QR code scanner
 */
function initQRScanner() {
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    const uploadQrBtn = document.getElementById('upload-qr');
    const qrImageUpload = document.getElementById('qr-image-upload');
    const scannerVideo = document.getElementById('scanner-video');
    const scannerCanvas = document.getElementById('scanner-canvas');
    const scannerPlaceholder = document.getElementById('scanner-placeholder');
    const scannerOverlay = document.querySelector('.scanner-overlay');
    const scanResult = document.getElementById('scan-result');
    const resultActions = document.querySelector('.result-actions');
    const copyResultBtn = document.getElementById('copy-result');
    const openResultBtn = document.getElementById('open-result');

    let scanner = null;

    // Start scanner
    startScannerBtn.addEventListener('click', () => {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showNotification('Your browser does not support camera access', 'error');
            return;
        }

        // Request camera access
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                // Show video and overlay
                scannerVideo.style.display = 'block';
                scannerOverlay.style.display = 'block';
                scannerPlaceholder.style.display = 'none';

                // Set video source
                scannerVideo.srcObject = stream;

                // Firefox compatibility fix - ensure video plays inline
                scannerVideo.setAttribute('playsinline', 'true');
                scannerVideo.setAttribute('webkit-playsinline', 'true');

                // Ensure video is playing
                scannerVideo.play().catch(err => {
                    console.error('Error playing video:', err);
                    showNotification('Could not start video stream. Please try again.', 'error');
                });

                // Create QR code scanner
                scanner = new jsQR(scannerCanvas.getContext('2d'), scannerVideo.videoWidth, scannerVideo.videoHeight);

                // Start scanning
                scanFrame();

                // Update button states
                startScannerBtn.disabled = true;
                stopScannerBtn.disabled = false;

                showNotification('Scanner started. Point your camera at a QR code', 'info');
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                showNotification('Could not access camera. Please check permissions', 'error');
            });
    });

    // Stop scanner
    stopScannerBtn.addEventListener('click', () => {
        stopScanner();
    });

    // Upload QR image
    uploadQrBtn.addEventListener('click', () => {
        qrImageUpload.click();
    });

    // Handle file upload
    qrImageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        // Read file
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Draw image on canvas
                scannerCanvas.width = img.width;
                scannerCanvas.height = img.height;
                const ctx = scannerCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Get image data
                const imageData = ctx.getImageData(0, 0, img.width, img.height);

                // Scan QR code
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // Display result
                    displayScanResult(code.data);
                    showNotification('QR code detected!', 'success');
                } else {
                    showNotification('No QR code found in the image', 'error');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Copy result
    copyResultBtn.addEventListener('click', () => {
        const resultText = scanResult.textContent;
        if (!resultText || resultText.includes('Scan a QR code')) {
            showNotification('No result to copy', 'warning');
            return;
        }

        copyToClipboard(resultText);
    });

    // Open result
    openResultBtn.addEventListener('click', () => {
        const resultText = scanResult.textContent;
        if (!resultText || resultText.includes('Scan a QR code')) {
            showNotification('No result to open', 'warning');
            return;
        }

        // Check if result is a URL
        if (isValidURL(resultText)) {
            window.open(resultText, '_blank');
        } else {
            showNotification('Result is not a valid URL', 'warning');
        }
    });

    /**
     * Scan video frame for QR code
     */
    function scanFrame() {
        if (!scanner || !scannerVideo.srcObject) return;

        // Check if video is playing
        if (scannerVideo.readyState === scannerVideo.HAVE_ENOUGH_DATA) {
            // Draw video frame on canvas
            scannerCanvas.width = scannerVideo.videoWidth;
            scannerCanvas.height = scannerVideo.videoHeight;
            const ctx = scannerCanvas.getContext('2d');
            ctx.drawImage(scannerVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);

            // Get image data
            const imageData = ctx.getImageData(0, 0, scannerCanvas.width, scannerCanvas.height);

            // Scan QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                // Display result
                displayScanResult(code.data);

                // Stop scanner
                stopScanner();

                showNotification('QR code detected!', 'success');
            }
        }

        // Continue scanning
        requestAnimationFrame(scanFrame);
    }

    /**
     * Stop scanner
     */
    function stopScanner() {
        // Stop video stream
        if (scannerVideo.srcObject) {
            const tracks = scannerVideo.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            scannerVideo.srcObject = null;
        }

        // Hide video and overlay
        scannerVideo.style.display = 'none';
        scannerOverlay.style.display = 'none';
        scannerPlaceholder.style.display = 'flex';

        // Update button states
        startScannerBtn.disabled = false;
        stopScannerBtn.disabled = true;
    }

    /**
     * Display scan result
     * @param {string} result - Scan result
     */
    function displayScanResult(result) {
        // Display result
        scanResult.innerHTML = '';
        scanResult.textContent = result;

        // Show result actions
        resultActions.style.display = 'flex';
    }

    /**
     * Check if string is a valid URL
     * @param {string} str - String to check
     * @returns {boolean} - True if valid URL
     */
    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}

/**
 * Initialize QR code history
 */
function initQRHistory() {
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const saveBtn = document.getElementById('save-btn');

    // Load history on init
    loadHistory();

    // Save QR code
    saveBtn.addEventListener('click', () => {
        const qrCode = document.querySelector('#qr-code canvas');
        if (!qrCode) {
            showNotification('No QR code to save', 'error');
            return;
        }

        // Get QR code data
        const contentType = document.getElementById('content-type').value;
        const content = getQRContent();
        const dataURL = qrCode.toDataURL('image/png');

        // Create history item
        const historyItem = {
            id: Date.now(),
            contentType,
            content,
            dataURL,
            date: new Date().toISOString()
        };

        // Save to history
        saveToHistory(historyItem);

        showNotification('QR code saved to history', 'success');
    });

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved QR codes?')) {
            localStorage.removeItem('qrHistory');
            loadHistory();
            showNotification('History cleared', 'info');
        }
    });

    /**
     * Load history from localStorage
     */
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');

        // Clear history list
        historyList.innerHTML = '';

        if (history.length === 0) {
            // Show empty message
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'No saved QR codes yet. Generate and save a QR code to see it here.';
            historyList.appendChild(emptyMessage);
            return;
        }

        // Add history items
        history.forEach(item => {
            const historyItem = createHistoryItem(item);
            historyList.appendChild(historyItem);
        });
    }

    /**
     * Save item to history
     * @param {object} item - History item
     */
    function saveToHistory(item) {
        // Get current history
        const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');

        // Add new item
        history.unshift(item);

        // Limit history to 20 items
        if (history.length > 20) {
            history.pop();
        }

        // Save to localStorage
        localStorage.setItem('qrHistory', JSON.stringify(history));

        // Reload history
        loadHistory();
    }

    /**
     * Create history item element
     * @param {object} item - History item
     * @returns {HTMLElement} - History item element
     */
    function createHistoryItem(item) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        // Format date
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        // Get title based on content type
        let title = '';
        switch (item.contentType) {
            case 'url':
                title = new URL(item.content).hostname;
                break;
            case 'text':
                title = item.content.substring(0, 20) + (item.content.length > 20 ? '...' : '');
                break;
            case 'vcard':
                title = 'Contact: ' + (item.content.match(/FN:(.*?)(?:\r\n|\r|\n)/)?.[1] || 'Unknown');
                break;
            case 'email':
                title = 'Email: ' + (item.content.match(/:(.*?)(?:\?|$)/)?.[1] || 'Unknown');
                break;
            case 'sms':
                title = 'SMS: ' + (item.content.match(/:(.*?)(?:\?|$)/)?.[1] || 'Unknown');
                break;
            case 'wifi':
                title = 'WiFi: ' + (item.content.match(/S:(.*?)(?:;|$)/)?.[1] || 'Unknown');
                break;
            default:
                title = item.contentType.toUpperCase();
        }

        historyItem.innerHTML = `
            <div class="history-qr">
                <img src="${item.dataURL}" alt="QR Code">
            </div>
            <div class="history-info">
                <div class="history-title" title="${title}">${title}</div>
                <div class="history-date">${formattedDate}</div>
                <div class="history-actions">
                    <button type="button" class="btn btn-sm btn-secondary history-download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary history-copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger history-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        historyItem.querySelector('.history-download').addEventListener('click', () => {
            // Create a temporary link
            const link = document.createElement('a');
            link.href = item.dataURL;
            link.download = `qrcode_${item.id}.png`;
            link.click();
        });

        historyItem.querySelector('.history-copy').addEventListener('click', () => {
            copyToClipboard(item.content);
        });

        historyItem.querySelector('.history-delete').addEventListener('click', () => {
            // Get current history
            const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');

            // Remove item
            const newHistory = history.filter(historyItem => historyItem.id !== item.id);

            // Save to localStorage
            localStorage.setItem('qrHistory', JSON.stringify(newHistory));

            // Reload history
            loadHistory();

            showNotification('QR code removed from history', 'info');
        });

        return historyItem;
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    // Use the modern clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback to the older method
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback method to copy text to clipboard
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy text', 'error');
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy text', 'error');
    }

    document.body.removeChild(textarea);
}

/**
 * Track analytics
 * @param {string} event - The event to track
 * @param {object} properties - Event properties
 */
function trackAnalytics(event, properties = {}) {
    // In a real implementation, you would use an analytics service
    console.log(`Analytics: ${event}`, properties);

    // Example implementation with Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', event, properties);
    }
}
