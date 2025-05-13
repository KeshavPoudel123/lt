/**
 * Meme Generator - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const imageInput = document.getElementById('imageInput');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textColorInput = document.getElementById('textColor');
    const textColorHexInput = document.getElementById('textColorHex');
    const outlineColorInput = document.getElementById('outlineColor');
    const outlineColorHexInput = document.getElementById('outlineColorHex');
    const outlineWidthInput = document.getElementById('outlineWidth');
    const outlineWidthValue = document.getElementById('outlineWidthValue');
    const canvas = document.getElementById('memeCanvas');
    const downloadButton = document.getElementById('downloadMeme');
    const fontPreview = document.getElementById('fontPreview');
    const canvasWidthInput = document.getElementById('canvasWidth');
    const canvasHeightInput = document.getElementById('canvasHeight');
    const resizeCanvasButton = document.getElementById('resizeCanvas');
    const loadingIndicator = document.querySelector('.loading');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');
    
    const ctx = canvas.getContext('2d');
    let memeImage = null;
    
    // Set initial canvas size
    canvas.width = 600;
    canvas.height = 600;
    
    // Default settings
    let settings = {
        topText: '',
        bottomText: '',
        fontFamily: 'Impact',
        fontSize: 36,
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 4
    };
    
    // Update font preview when font changes
    fontFamilySelect.addEventListener('change', function() {
        fontPreview.style.fontFamily = this.value;
        settings.fontFamily = this.value;
        drawMeme();
    });
    
    // Initialize font preview
    fontPreview.style.fontFamily = fontFamilySelect.value;
    
    // Function to handle image upload
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file type
        if (!file.type.match('image.*')) {
            showNotification('Please upload an image file.', 'error');
            return;
        }
        
        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('Image size should be less than 10MB.', 'error');
            return;
        }
        
        loadingIndicator.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                memeImage = img;
                
                // Auto-adjust canvas to image proportions
                const aspectRatio = img.width / img.height;
                if (aspectRatio > 1) {
                    // Landscape
                    canvas.width = 600;
                    canvas.height = 600 / aspectRatio;
                } else {
                    // Portrait or square
                    canvas.height = 600;
                    canvas.width = 600 * aspectRatio;
                }
                
                // Update width/height inputs
                canvasWidthInput.value = Math.round(canvas.width);
                canvasHeightInput.value = Math.round(canvas.height);
                
                drawMeme();
                loadingIndicator.style.display = 'none';
                showNotification('Image loaded successfully!', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    
    // Resize canvas function
    resizeCanvasButton.addEventListener('click', function() {
        const newWidth = parseInt(canvasWidthInput.value);
        const newHeight = parseInt(canvasHeightInput.value);
        
        if (newWidth >= 100 && newWidth <= 2000 && 
            newHeight >= 100 && newHeight <= 2000) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            drawMeme();
            showNotification('Canvas resized successfully!', 'success');
        } else {
            showNotification('Canvas dimensions must be between 100px and 2000px', 'error');
        }
    });
    
    // Event listeners for text inputs
    topTextInput.addEventListener('input', function() {
        settings.topText = this.value;
        drawMeme();
    });
    
    bottomTextInput.addEventListener('input', function() {
        settings.bottomText = this.value;
        drawMeme();
    });
    
    // Font size slider
    fontSizeInput.addEventListener('input', function() {
        settings.fontSize = parseInt(this.value);
        fontSizeValue.textContent = settings.fontSize + 'px';
        drawMeme();
    });
    
    // Text color input
    textColorInput.addEventListener('input', function() {
        settings.textColor = this.value;
        textColorHexInput.value = this.value;
        drawMeme();
    });
    
    textColorHexInput.addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            settings.textColor = this.value;
            textColorInput.value = this.value;
            drawMeme();
        }
    });
    
    // Outline color input
    outlineColorInput.addEventListener('input', function() {
        settings.outlineColor = this.value;
        outlineColorHexInput.value = this.value;
        drawMeme();
    });
    
    outlineColorHexInput.addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            settings.outlineColor = this.value;
            outlineColorInput.value = this.value;
            drawMeme();
        }
    });
    
    // Outline width slider
    outlineWidthInput.addEventListener('input', function() {
        settings.outlineWidth = parseInt(this.value);
        outlineWidthValue.textContent = settings.outlineWidth + 'px';
        drawMeme();
    });
    
    // Function to draw text with outline
    function drawTextWithOutline(text, x, y, maxWidth) {
        ctx.font = `bold ${settings.fontSize}px ${settings.fontFamily}`;
        ctx.textAlign = 'center';
        
        // Calculate text metrics for proper positioning
        const metrics = ctx.measureText(text);
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
        // Draw outline
        ctx.strokeStyle = settings.outlineColor;
        ctx.lineWidth = settings.outlineWidth;
        ctx.strokeText(text, x, y, maxWidth);
        
        // Draw text
        ctx.fillStyle = settings.textColor;
        ctx.fillText(text, x, y, maxWidth);
        
        return textHeight;
    }
    
    // Function to draw the meme
    function drawMeme() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background (optional - removed for transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image if available
        if (memeImage) {
            ctx.drawImage(memeImage, 0, 0, canvas.width, canvas.height);
        }
        
        const maxWidth = canvas.width * 0.9;
        
        // Draw top text
        if (settings.topText) {
            const topY = settings.fontSize + 10;
            drawTextWithOutline(settings.topText, canvas.width / 2, topY, maxWidth);
        }
        
        // Draw bottom text
        if (settings.bottomText) {
            const bottomY = canvas.height - 10;
            drawTextWithOutline(settings.bottomText, canvas.width / 2, bottomY, maxWidth);
        }
    }
    
    // Download button
    downloadButton.addEventListener('click', function() {
        if (!memeImage) {
            showNotification('Please upload an image first.', 'warning');
            return;
        }
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.download = 'custom-meme.png';
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        link.href = dataURL;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Meme downloaded successfully!', 'success');
    });
    
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
    
    // Initial draw
    drawMeme();
});
