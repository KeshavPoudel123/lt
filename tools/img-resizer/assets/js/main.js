/**
 * Image Resizer - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const preview = document.getElementById('preview');
    const imageInfo = document.getElementById('imageInfo');
    const resizeOptions = document.getElementById('resizeOptions');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainRatio = document.getElementById('maintainRatio');
    const formatSelect = document.getElementById('formatSelect');
    const qualityInput = document.getElementById('qualityInput');
    const qualityValue = document.getElementById('qualityValue');
    const resizeBtn = document.getElementById('resizeBtn');
    const resizedImageContainer = document.getElementById('resizedImageContainer');
    const resizedImage = document.getElementById('resizedImage');
    const resizedImageInfo = document.getElementById('resizedImageInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');
    const qualityGroup = document.getElementById('qualityGroup');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Variables
    let originalImage = null;
    let imageAspectRatio = 1;
    let fileName = '';
    let fileExtension = '';

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

    widthInput.addEventListener('input', () => {
        if (maintainRatio.checked && widthInput.value) {
            heightInput.value = Math.round(widthInput.value / imageAspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainRatio.checked && heightInput.value) {
            widthInput.value = Math.round(heightInput.value * imageAspectRatio);
        }
    });

    formatSelect.addEventListener('change', () => {
        // Show quality slider only for formats that support quality setting
        if (formatSelect.value === 'png') {
            qualityGroup.style.display = 'none';
        } else {
            qualityGroup.style.display = 'block';
        }
    });

    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = qualityInput.value;
    });

    resizeBtn.addEventListener('click', resizeImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file.', 'error');
            return;
        }

        hideError();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            originalImage = new Image();
            originalImage.onload = () => {
                imageAspectRatio = originalImage.width / originalImage.height;
                
                // Show image info
                imageInfo.innerHTML = `
                    <p>Original Size: ${originalImage.width} × ${originalImage.height} px</p>
                    <p>File Type: ${file.type}</p>
                    <p>File Size: ${formatFileSize(file.size)}</p>
                `;
                
                // Set default resize values
                widthInput.value = originalImage.width;
                heightInput.value = originalImage.height;
                
                // Show UI elements
                imagePreview.classList.remove('hidden');
                resizeOptions.classList.remove('hidden');
                resizedImageContainer.classList.add('hidden');
                downloadBtn.style.display = 'none';
            };
            originalImage.src = e.target.result;
            
            // Get file name and extension for download
            fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
        };
        reader.readAsDataURL(file);
    }

    function resizeImage() {
        if (!originalImage) {
            showNotification('Please upload an image first.', 'error');
            return;
        }

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (!width || !height || width <= 0 || height <= 0) {
            showNotification('Please enter valid dimensions.', 'error');
            return;
        }

        hideError();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image on canvas
        ctx.drawImage(originalImage, 0, 0, width, height);
        
        // Get image as data URL with selected format and quality
        const format = formatSelect.value;
        let quality = parseInt(qualityInput.value) / 100;
        
        // PNG doesn't use quality parameter
        if (format === 'png') quality = undefined;
        
        const resizedDataUrl = canvas.toDataURL(`image/${format}`, quality);
        
        // Show resized image
        resizedImage.src = resizedDataUrl;
        
        // Estimate file size (rough approximation)
        const estimatedSize = Math.round((resizedDataUrl.length * 3) / 4) - 
                             (resizedDataUrl.endsWith('==') ? 2 : 
                              resizedDataUrl.endsWith('=') ? 1 : 0);
        
        // Show resized image info
        resizedImageInfo.innerHTML = `
            <p>Resized: ${width} × ${height} px</p>
            <p>Format: ${format.toUpperCase()}</p>
            <p>Estimated Size: ${formatFileSize(estimatedSize)}</p>
        `;
        
        resizedImageContainer.classList.remove('hidden');
        downloadBtn.style.display = 'block';
        
        // Show success notification
        showNotification(`Image resized to ${width} × ${height} successfully!`, 'success');
        
        // Scroll to resized image
        resizedImageContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function downloadImage() {
        if (!resizedImage.src) {
            showNotification('Please resize an image first.', 'error');
            return;
        }

        const format = formatSelect.value;
        const link = document.createElement('a');
        
        // Set download name with original filename and new extension
        link.download = `${fileName}-resized.${format}`;
        link.href = resizedImage.src;
        link.click();
        
        // Show success notification
        showNotification('Image downloaded successfully!', 'success');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
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
