/**
 * Image Converter - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const controls = document.getElementById('controls');
    const outputFormat = document.getElementById('outputFormat');
    const qualityControl = document.getElementById('qualityControl');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const convertBtn = document.getElementById('convertBtn');
    const loading = document.getElementById('loading');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const convertedPreview = document.getElementById('convertedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const convertedInfo = document.getElementById('convertedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Variables
    let originalImage = null;
    let originalImageType = '';
    let originalImageName = '';
    let convertedImageUrl = '';

    // Event Listeners
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('active');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('active');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    outputFormat.addEventListener('change', () => {
        // Show quality control only for formats that support quality setting
        if (outputFormat.value === 'image/png') {
            qualityControl.style.display = 'none';
        } else {
            qualityControl.style.display = 'block';
        }
    });

    quality.addEventListener('input', () => {
        qualityValue.textContent = quality.value;
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file.', 'error');
            return;
        }

        hideError();
        
        // Store original image information
        originalImageType = file.type;
        originalImageName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Create an image element to get dimensions
            const img = new Image();
            img.onload = () => {
                // Store the original image
                originalImage = img;
                
                // Display original image info
                originalInfo.textContent = `${file.name} (${formatFileSize(file.size)}, ${img.width}×${img.height} px, ${getFormatName(file.type)})`;
                
                // Set original preview
                originalPreview.src = e.target.result;
                
                // Show controls and preview
                controls.classList.remove('hidden');
                previewContainer.classList.remove('hidden');
                
                // Set quality control visibility based on format
                qualityControl.style.display = outputFormat.value === 'image/png' ? 'none' : 'block';
                
                // Show success notification
                showNotification('Image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload an image first.', 'error');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');

        // Get selected format and quality
        const format = outputFormat.value;
        const qualityValue = format === 'image/png' ? undefined : parseInt(quality.value) / 100;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(originalImage, 0, 0);
                
                // Convert the canvas to the selected format
                canvas.toBlob(blob => {
                    // Create object URL for the blob
                    const url = URL.createObjectURL(blob);
                    
                    // Store the converted image URL for download
                    convertedImageUrl = url;
                    
                    // Set converted preview
                    convertedPreview.src = url;
                    
                    // Update converted info
                    convertedInfo.textContent = `Converted to ${getFormatName(format)} (${formatFileSize(blob.size)}, ${originalImage.width}×${originalImage.height} px)`;
                    
                    // Hide loading indicator
                    loading.classList.add('hidden');
                    
                    // Show success notification
                    showNotification(`Image converted to ${getFormatName(format)} successfully!`, 'success');
                    
                    // Scroll to preview
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }, format, qualityValue);
            } catch (error) {
                loading.classList.add('hidden');
                showNotification('Error converting image: ' + error.message, 'error');
            }
        }, 100);
    }

    function downloadImage() {
        if (!convertedImageUrl) {
            showNotification('Please convert an image first.', 'error');
            return;
        }

        // Get selected format
        const format = outputFormat.value;
        
        // Create a link element
        const link = document.createElement('a');
        
        // Set download name with original filename and new extension
        const extension = format.split('/')[1];
        const filename = originalImageName.substring(0, originalImageName.lastIndexOf('.')) + '.' + extension;
        
        link.download = filename;
        link.href = convertedImageUrl;
        link.click();
        
        // Show success notification
        showNotification('Image downloaded successfully!', 'success');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function getFormatName(mimeType) {
        switch (mimeType) {
            case 'image/jpeg':
                return 'JPEG';
            case 'image/png':
                return 'PNG';
            case 'image/webp':
                return 'WebP';
            case 'image/gif':
                return 'GIF';
            case 'image/svg+xml':
                return 'SVG';
            case 'image/bmp':
                return 'BMP';
            default:
                return mimeType.split('/')[1].toUpperCase();
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
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
