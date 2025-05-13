/**
 * Image Compressor - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const settings = document.getElementById('settings');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalFileSize = document.getElementById('originalFileSize');
    const compressedFileSize = document.getElementById('compressedFileSize');
    const compressBtn = document.getElementById('compressBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const compressionStats = document.getElementById('compressionStats');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const sizeReduction = document.getElementById('sizeReduction');
    const dimensions = document.getElementById('dimensions');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Settings elements
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const widthSlider = document.getElementById('widthSlider');
    const widthValue = document.getElementById('widthValue');
    const formatSelect = document.getElementById('formatSelect');
    const preserveRatio = document.getElementById('preserveRatio');
    const autoCompress = document.getElementById('autoCompress');

    // Variables
    let originalImage = null;
    let compressedImageBlob = null;
    let originalImageType = '';
    let originalImageName = '';

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

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${Math.round(qualitySlider.value * 100)}%`;
    });

    widthSlider.addEventListener('input', () => {
        widthValue.textContent = `${widthSlider.value}px`;
    });

    compressBtn.addEventListener('click', compressImage);
    downloadBtn.addEventListener('click', downloadImage);
    resetBtn.addEventListener('click', resetTool);

    // Functions
    function handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }
        
        originalImageType = file.type;
        originalImageName = file.name;
        
        // Update UI
        uploadContainer.classList.add('has-image');
        showLoading();
        hideError();
        
        // Load the image
        const reader = new FileReader();
        reader.onload = function(event) {
            // Create an image element
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                
                // Display original preview
                originalPreview.src = event.target.result;
                
                // Set original file size
                const originalSizeFormatted = formatFileSize(file.size);
                originalFileSize.textContent = originalSizeFormatted;
                originalSize.textContent = originalSizeFormatted;
                
                // Show settings
                settings.classList.remove('hidden');
                
                // Auto compress if checked
                if (autoCompress.checked) {
                    compressImage();
                } else {
                    hideLoading();
                    previewContainer.classList.remove('hidden');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function compressImage() {
        if (!originalImage) {
            showNotification('Please upload an image first.', 'error');
            return;
        }
        
        showLoading();
        hideError();
        
        setTimeout(() => {
            try {
                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Get settings
                const quality = parseFloat(qualitySlider.value);
                const maxWidth = parseInt(widthSlider.value);
                const outputFormat = formatSelect.value;
                const keepAspectRatio = preserveRatio.checked;
                
                // Calculate dimensions
                let width = originalImage.width;
                let height = originalImage.height;
                
                if (width > maxWidth) {
                    const ratio = keepAspectRatio ? maxWidth / width : 1;
                    width = maxWidth;
                    height = keepAspectRatio ? Math.round(originalImage.height * ratio) : originalImage.height;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                ctx.drawImage(originalImage, 0, 0, width, height);
                
                // Convert to desired format
                const mimeType = `image/${outputFormat}`;
                canvas.toBlob((blob) => {
                    // Create URL for preview
                    const compressedImageURL = URL.createObjectURL(blob);
                    compressedPreview.src = compressedImageURL;
                    
                    // Store the blob for download
                    compressedImageBlob = blob;
                    
                    // Update UI with size information
                    const compressedSizeFormatted = formatFileSize(blob.size);
                    compressedFileSize.textContent = compressedSizeFormatted;
                    compressedSize.textContent = compressedSizeFormatted;
                    
                    // Calculate size reduction percentage
                    const originalFile = fileInput.files[0];
                    const reduction = Math.round((1 - (blob.size / originalFile.size)) * 100);
                    sizeReduction.textContent = `${reduction}%`;
                    
                    // Update dimensions stat
                    dimensions.textContent = `${width} × ${height}`;
                    
                    // Display UI
                    hideLoading();
                    previewContainer.classList.remove('hidden');
                    compressionStats.classList.remove('hidden');
                    
                    // Show success message
                    showNotification(
                        `Image compressed successfully! Size reduced by ${reduction}%.`, 
                        'success'
                    );
                    
                    // Scroll to preview
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }, mimeType, quality);
            } catch (error) {
                hideLoading();
                showNotification('An error occurred during compression. Please try again.', 'error');
                console.error(error);
            }
        }, 100); // Small delay to allow UI to update
    }

    function downloadImage() {
        if (!compressedImageBlob) {
            showNotification('No compressed image available to download.', 'error');
            return;
        }
        
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedImageBlob);
        
        // Set download filename
        const fileExtension = formatSelect.value;
        let fileName = originalImageName.substring(0, originalImageName.lastIndexOf('.')) || originalImageName;
        downloadLink.download = `${fileName}-compressed.${fileExtension}`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Show success notification
        showNotification('Image downloaded successfully!', 'success');
    }

    function resetTool() {
        // Clear image
        originalImage = null;
        compressedImageBlob = null;
        originalPreview.src = '';
        compressedPreview.src = '';
        fileInput.value = '';
        
        // Reset UI
        uploadContainer.classList.remove('has-image');
        settings.classList.add('hidden');
        previewContainer.classList.add('hidden');
        compressionStats.classList.add('hidden');
        hideError();
        
        // Reset file size displays
        originalFileSize.textContent = '0 KB';
        compressedFileSize.textContent = '0 KB';
        
        // Show success notification
        showNotification('Tool reset successfully!', 'info');
    }

    // Helper functions
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
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
