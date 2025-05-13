/**
 * AI Background Remover - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    const downloadBtn = document.getElementById('download-btn');
    const originalCanvas = document.getElementById('original-canvas');
    const processedCanvas = document.getElementById('processed-canvas');
    const statusText = document.getElementById('status-text');
    const loader = document.getElementById('loader');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Contexts
    const originalCtx = originalCanvas.getContext('2d');
    const processedCtx = processedCanvas.getContext('2d');

    // Variables
    let originalImage = null;
    let processedImage = null;
    let imageFile = null;

    // Event listeners
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    processBtn.addEventListener('click', processImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFile(file) {
        // Check file type
        if (!file.type.match('image.*')) {
            showStatus('Please upload an image file', 'error');
            showNotification('Please upload an image file.', 'error');
            return;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Image size should be less than 5MB', 'error');
            showNotification('Image size should be less than 5MB.', 'error');
            return;
        }

        imageFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Draw original image
                originalImage = img;
                const [width, height] = calculateAspectRatio(img.width, img.height, 400);

                originalCanvas.width = width;
                originalCanvas.height = height;
                originalCtx.drawImage(img, 0, 0, width, height);

                // Clear processed canvas
                processedCanvas.width = width;
                processedCanvas.height = height;
                processedCtx.clearRect(0, 0, width, height);

                showStatus('Image loaded! Click "Remove Background" to process', 'success');
                showNotification('Image loaded successfully! Click "Remove Background" to process.', 'success');
                processBtn.disabled = false;
                downloadBtn.disabled = true;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function calculateAspectRatio(width, height, maxSize) {
        if (width > height) {
            if (width > maxSize) {
                return [maxSize, Math.floor(height * maxSize / width)];
            }
        } else {
            if (height > maxSize) {
                return [Math.floor(width * maxSize / height), maxSize];
            }
        }
        return [width, height];
    }

    function processImage() {
        if (!originalImage) {
            showStatus('Please upload an image first', 'error');
            showNotification('Please upload an image first.', 'error');
            return;
        }

        showLoader(true);
        showStatus('Processing image...', 'info');

        // Simulate AI processing with a timeout (in a real app, you would call an API)
        setTimeout(() => {
            removeBackground(originalImage).then(resultCanvas => {
                // Copy to processed canvas
                processedCanvas.width = resultCanvas.width;
                processedCanvas.height = resultCanvas.height;
                processedCtx.drawImage(resultCanvas, 0, 0);

                showStatus('Background removed successfully!', 'success');
                showNotification('Background removed successfully!', 'success');
                downloadBtn.disabled = false;
                showLoader(false);
            }).catch(error => {
                showStatus('Error processing image: ' + error.message, 'error');
                showNotification('Error processing image: ' + error.message, 'error');
                showLoader(false);
            });
        }, 1000);
    }

    async function removeBackground(image) {
        return new Promise((resolve) => {
            // Create temporary canvas for processing
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            // Set canvas dimensions
            tempCanvas.width = originalCanvas.width;
            tempCanvas.height = originalCanvas.height;

            // Draw the original image
            tempCtx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

            // Get image data
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            // Simple background removal algorithm (for demonstration)
            // In a real app, you would use a more sophisticated AI model
            // This is just a very basic color-based segmentation

            // 1. Detect edges
            const edgeData = detectEdges(data, tempCanvas.width, tempCanvas.height);

            // 2. Simple foreground/background segmentation
            const resultData = segmentImage(data, edgeData, tempCanvas.width, tempCanvas.height);

            // Put the processed data back
            const resultImageData = new ImageData(resultData, tempCanvas.width, tempCanvas.height);
            tempCtx.putImageData(resultImageData, 0, 0);

            resolve(tempCanvas);
        });
    }

    function detectEdges(data, width, height) {
        // Simple Sobel edge detection (simplified)
        const edgeData = new Uint8ClampedArray(width * height);
        const threshold = 30;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;

                // Get surrounding pixels
                const tl = getGrayscale(data, (y-1) * width + (x-1), width);
                const tc = getGrayscale(data, (y-1) * width + x, width);
                const tr = getGrayscale(data, (y-1) * width + (x+1), width);
                const ml = getGrayscale(data, y * width + (x-1), width);
                const mr = getGrayscale(data, y * width + (x+1), width);
                const bl = getGrayscale(data, (y+1) * width + (x-1), width);
                const bc = getGrayscale(data, (y+1) * width + x, width);
                const br = getGrayscale(data, (y+1) * width + (x+1), width);

                // Sobel kernels
                const gx = (tr + 2*mr + br) - (tl + 2*ml + bl);
                const gy = (bl + 2*bc + br) - (tl + 2*tc + tr);

                // Edge magnitude
                const magnitude = Math.sqrt(gx*gx + gy*gy);

                // Threshold
                edgeData[y * width + x] = magnitude > threshold ? 255 : 0;
            }
        }

        return edgeData;
    }

    function getGrayscale(data, index, width) {
        const idx = index * 4;
        if (idx < 0 || idx >= data.length - 3) {
            return 0;
        }
        return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    }

    function segmentImage(data, edgeData, width, height) {
        // Simple color-based segmentation with edge awareness
        const result = new Uint8ClampedArray(data.length);

        // Copy original data
        for (let i = 0; i < data.length; i++) {
            result[i] = data[i];
        }

        // Get the center of the image as probable foreground
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const centerIdx = (centerY * width + centerX) * 4;

        // Sample center color (assumed to be foreground)
        const centerR = data[centerIdx];
        const centerG = data[centerIdx + 1];
        const centerB = data[centerIdx + 2];

        // Sample edges (likely background)
        const edgePoints = [
            [0, 0],
            [width-1, 0],
            [0, height-1],
            [width-1, height-1]
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        for (const [x, y] of edgePoints) {
            const idx = (y * width + x) * 4;
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
        }

        bgR /= edgePoints.length;
        bgG /= edgePoints.length;
        bgB /= edgePoints.length;

        // Now process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const edgeIdx = y * width + x;

                // Current pixel
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Calculate distance to foreground and background colors
                const distToFg = colorDistance(r, g, b, centerR, centerG, centerB);
                const distToBg = colorDistance(r, g, b, bgR, bgG, bgB);

                // Edge awareness - edges are more likely to be foreground
                const edgeFactor = edgeData[edgeIdx] / 255;

                // Alpha calculation
                let alpha = 255;
                if (distToBg < distToFg && edgeFactor < 0.5) {
                    // Likely background
                    alpha = 0;
                } else if (distToBg < distToFg * 1.5) {
                    // Potentially background but with uncertainty
                    alpha = Math.max(0, Math.min(255, 255 * ((distToBg / distToFg) - 0.5) * 2));
                }

                // Apply alpha
                result[idx + 3] = alpha;
            }
        }

        // Post-processing: refine edges
        smoothAlpha(result, width, height);

        return result;
    }

    function colorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
        );
    }

    function smoothAlpha(data, width, height) {
        // Simple box blur for alpha channel
        const kernelSize = 3;
        const halfKernel = Math.floor(kernelSize / 2);
        const tempAlpha = new Uint8ClampedArray(width * height);

        // Extract alpha channel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                tempAlpha[y * width + x] = data[idx + 3];
            }
        }

        // Apply blur to alpha
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let count = 0;

                // Kernel
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const nx = x + kx;
                        const ny = y + ky;

                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            sum += tempAlpha[ny * width + nx];
                            count++;
                        }
                    }
                }

                // Apply smoothed alpha
                const idx = (y * width + x) * 4;
                data[idx + 3] = Math.round(sum / count);
            }
        }
    }

    function downloadImage() {
        if (!processedCanvas) {
            showStatus('No processed image available', 'error');
            showNotification('No processed image available.', 'error');
            return;
        }

        // Create a download link
        const downloadLink = document.createElement('a');

        // Get original filename and change extension to png (for transparency)
        let filename = 'removed_background.png';
        if (imageFile) {
            const originalName = imageFile.name.split('.')[0];
            filename = `${originalName}_nobg.png`;
        }

        // Convert canvas to dataURL
        const dataURL = processedCanvas.toDataURL('image/png');

        // Set download attributes
        downloadLink.href = dataURL;
        downloadLink.download = filename;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        showStatus('Image downloaded!', 'success');
        showNotification('Image downloaded successfully!', 'success');
    }

    function showStatus(message, type = 'info') {
        statusText.textContent = message;

        // Clear previous classes
        statusText.className = 'status-text';

        // Add appropriate class
        if (type === 'error') {
            statusText.style.color = '#e74c3c';
        } else if (type === 'success') {
            statusText.style.color = '#2ecc71';
        } else {
            statusText.style.color = '#a777e3';
        }

        // Auto-clear after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (statusText.textContent === message) {
                    statusText.textContent = '';
                }
            }, 5000);
        }
    }

    function showLoader(show) {
        loader.style.display = show ? 'block' : 'none';
        processBtn.disabled = show;
    }

    // Show notification
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
});
