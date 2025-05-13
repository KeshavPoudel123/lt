/**
 * Image Resizer - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Tabs
    const resizeTab = document.getElementById('resize-tab');
    const cropTab = document.getElementById('crop-tab');
    const compressTab = document.getElementById('compress-tab');
    const convertTab = document.getElementById('convert-tab');

    // DOM Elements - Options
    const resizeOptions = document.getElementById('resize-options');
    const cropOptions = document.getElementById('crop-options');
    const compressOptions = document.getElementById('compress-options');
    const convertOptions = document.getElementById('convert-options');

    // DOM Elements - Upload
    const uploadContainer = document.getElementById('upload-container');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const originalImage = document.getElementById('original-image');
    const changeImageBtn = document.getElementById('change-image-btn');

    // DOM Elements - Image Info
    const fileName = document.getElementById('file-name');
    const imageDimensions = document.getElementById('image-dimensions');
    const fileSize = document.getElementById('file-size');
    const fileType = document.getElementById('file-type');

    // DOM Elements - Resize Options
    const resizeWidth = document.getElementById('resize-width');
    const resizeHeight = document.getElementById('resize-height');
    const maintainAspectRatio = document.getElementById('maintain-aspect-ratio');
    const resizeMethod = document.getElementById('resize-method');
    const percentageContainer = document.getElementById('percentage-container');
    const resizePercentage = document.getElementById('resize-percentage');
    const presetContainer = document.getElementById('preset-container');
    const resizePreset = document.getElementById('resize-preset');

    // DOM Elements - Crop Options
    const cropAspectRatio = document.getElementById('crop-aspect-ratio');
    const showGrid = document.getElementById('show-grid');
    const cropPreview = document.getElementById('crop-preview');
    const cropImage = document.getElementById('crop-image');

    // DOM Elements - Compress Options
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const resizeBeforeCompress = document.getElementById('resize-before-compress');
    const compressResizeContainer = document.getElementById('compress-resize-container');
    const maxWidth = document.getElementById('max-width');

    // DOM Elements - Convert Options
    const outputFormat = document.getElementById('output-format');
    const jpegQualityContainer = document.getElementById('jpeg-quality-container');
    const jpegQuality = document.getElementById('jpeg-quality');
    const jpegQualityValue = document.getElementById('jpeg-quality-value');
    const pngOptionsContainer = document.getElementById('png-options-container');
    const pngTransparency = document.getElementById('png-transparency');

    // DOM Elements - Action Buttons
    const processBtn = document.getElementById('process-btn');
    const resetBtn = document.getElementById('reset-btn');

    // DOM Elements - Result
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const resultDimensions = document.getElementById('result-dimensions');
    const resultSize = document.getElementById('result-size');
    const sizeReduction = document.getElementById('size-reduction');
    const downloadBtn = document.getElementById('download-btn');

    // DOM Elements - Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const autoProcess = document.getElementById('auto-process');
    const highQuality = document.getElementById('high-quality');

    // Variables
    let currentTab = 'resize';
    let originalFile = null;
    let originalImageObj = new Image();
    let cropper = null;
    let processedBlob = null;
    let processedFileName = '';

    // Initialize the application
    function init() {
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Tab switching
        resizeTab.addEventListener('click', () => switchTab('resize'));
        cropTab.addEventListener('click', () => switchTab('crop'));
        compressTab.addEventListener('click', () => switchTab('compress'));
        convertTab.addEventListener('click', () => switchTab('convert'));

        // Upload events
        uploadContainer.addEventListener('click', () => imageUpload.click());
        uploadContainer.addEventListener('dragover', handleDragOver);
        uploadContainer.addEventListener('drop', handleDrop);
        imageUpload.addEventListener('change', handleImageUpload);
        changeImageBtn.addEventListener('click', () => imageUpload.click());

        // Resize events
        resizeWidth.addEventListener('input', handleResizeInput);
        resizeHeight.addEventListener('input', handleResizeInput);
        maintainAspectRatio.addEventListener('change', handleResizeInput);
        resizeMethod.addEventListener('change', handleResizeMethodChange);
        resizePercentage.addEventListener('input', handlePercentageInput);
        resizePreset.addEventListener('change', handlePresetChange);

        // Crop events
        cropAspectRatio.addEventListener('change', updateCropAspectRatio);
        showGrid.addEventListener('change', updateCropGrid);

        // Compress events
        qualitySlider.addEventListener('input', updateQualityValue);
        resizeBeforeCompress.addEventListener('change', toggleCompressResize);

        // Convert events
        outputFormat.addEventListener('change', handleFormatChange);
        jpegQuality.addEventListener('input', updateJpegQualityValue);

        // Action events
        processBtn.addEventListener('click', processImage);
        resetBtn.addEventListener('click', resetOptions);
        downloadBtn.addEventListener('click', downloadImage);

        // Settings events
        settingsBtn.addEventListener('click', openSettingsModal);
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        darkModeToggle.addEventListener('change', toggleDarkMode);

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModals();
            }
        });
    }

    // Switch between tabs
    function switchTab(tab) {
        // Update active tab
        currentTab = tab;

        // Update tab buttons
        resizeTab.classList.toggle('active', tab === 'resize');
        cropTab.classList.toggle('active', tab === 'crop');
        compressTab.classList.toggle('active', tab === 'compress');
        convertTab.classList.toggle('active', tab === 'convert');

        // Update option sections
        resizeOptions.classList.toggle('active', tab === 'resize');
        cropOptions.classList.toggle('active', tab === 'crop');
        compressOptions.classList.toggle('active', tab === 'compress');
        convertOptions.classList.toggle('active', tab === 'convert');

        // Initialize cropper if switching to crop tab
        if (tab === 'crop' && originalImage.src && !cropper) {
            initCropper();
        }

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Handle drag over
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadContainer.style.borderColor = 'var(--primary-color)';
    }

    // Handle drop
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadContainer.style.borderColor = '';

        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    }

    // Handle image upload
    function handleImageUpload(e) {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    }

    // Handle files
    function handleFiles(files) {
        const file = files[0];

        if (!file.type.match('image.*')) {
            showNotification('Please select an image file.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showNotification('File size exceeds 10MB limit.', 'error');
            return;
        }

        originalFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            cropImage.src = e.target.result;

            originalImageObj.onload = function() {
                updateImageInfo();

                // Show image preview and hide upload container
                uploadContainer.style.display = 'none';
                imagePreviewContainer.style.display = 'block';

                // Enable buttons
                processBtn.disabled = false;
                resetBtn.disabled = false;

                // Set initial resize dimensions
                resizeWidth.value = originalImageObj.width;
                resizeHeight.value = originalImageObj.height;

                // Initialize cropper if on crop tab
                if (currentTab === 'crop') {
                    initCropper();
                }

                // Auto-process if enabled
                if (autoProcess.checked) {
                    processImage();
                }
            };

            originalImageObj.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    // Update image info
    function updateImageInfo() {
        fileName.textContent = originalFile.name;
        imageDimensions.textContent = `${originalImageObj.width} × ${originalImageObj.height}`;
        fileSize.textContent = formatBytes(originalFile.size);
        fileType.textContent = originalFile.type;
    }

    // Format bytes to human-readable format
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Handle resize input
    function handleResizeInput() {
        if (maintainAspectRatio.checked && originalImageObj.src) {
            const aspectRatio = originalImageObj.width / originalImageObj.height;

            if (this === resizeWidth) {
                resizeHeight.value = Math.round(resizeWidth.value / aspectRatio);
            } else if (this === resizeHeight) {
                resizeWidth.value = Math.round(resizeHeight.value * aspectRatio);
            }
        }

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Handle resize method change
    function handleResizeMethodChange() {
        const method = resizeMethod.value;

        percentageContainer.style.display = method === 'percentage' ? 'block' : 'none';
        presetContainer.style.display = method === 'preset' ? 'block' : 'none';

        if (method === 'percentage') {
            handlePercentageInput();
        } else if (method === 'preset') {
            handlePresetChange();
        }
    }

    // Handle percentage input
    function handlePercentageInput() {
        if (!originalImageObj.src) return;

        const percentage = parseInt(resizePercentage.value) / 100;

        resizeWidth.value = Math.round(originalImageObj.width * percentage);
        resizeHeight.value = Math.round(originalImageObj.height * percentage);

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Handle preset change
    function handlePresetChange() {
        if (!originalImageObj.src) return;

        const preset = resizePreset.value;
        const dimensions = preset.split('x');

        if (dimensions.length === 2) {
            const presetWidth = parseInt(dimensions[0]);
            const presetHeight = parseInt(dimensions[1]);

            if (maintainAspectRatio.checked) {
                const aspectRatio = originalImageObj.width / originalImageObj.height;
                const presetRatio = presetWidth / presetHeight;

                if (aspectRatio > presetRatio) {
                    // Width constrained
                    resizeWidth.value = presetWidth;
                    resizeHeight.value = Math.round(presetWidth / aspectRatio);
                } else {
                    // Height constrained
                    resizeHeight.value = presetHeight;
                    resizeWidth.value = Math.round(presetHeight * aspectRatio);
                }
            } else {
                resizeWidth.value = presetWidth;
                resizeHeight.value = presetHeight;
            }
        }

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Initialize cropper
    function initCropper() {
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(cropImage, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: getCropAspectRatio(),
            guides: showGrid.checked,
            center: showGrid.checked,
            background: false,
            autoCropArea: 0.8,
            responsive: true
        });
    }

    // Get crop aspect ratio
    function getCropAspectRatio() {
        const ratio = cropAspectRatio.value;

        if (ratio === 'free') {
            return NaN;
        }

        const parts = ratio.split(':');
        return parseInt(parts[0]) / parseInt(parts[1]);
    }

    // Update crop aspect ratio
    function updateCropAspectRatio() {
        if (cropper) {
            cropper.setAspectRatio(getCropAspectRatio());
        }
    }

    // Update crop grid
    function updateCropGrid() {
        if (cropper) {
            cropper.destroy();
            initCropper();
        }
    }

    // Update quality value
    function updateQualityValue() {
        qualityValue.textContent = `${qualitySlider.value}%`;

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Toggle compress resize
    function toggleCompressResize() {
        compressResizeContainer.style.display = resizeBeforeCompress.checked ? 'block' : 'none';

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Handle format change
    function handleFormatChange() {
        const format = outputFormat.value;

        jpegQualityContainer.style.display = (format === 'jpeg' || format === 'webp') ? 'block' : 'none';
        pngOptionsContainer.style.display = format === 'png' ? 'block' : 'none';

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Update JPEG quality value
    function updateJpegQualityValue() {
        jpegQualityValue.textContent = `${jpegQuality.value}%`;

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Process image
    function processImage() {
        if (!originalImage.src) {
            showNotification('Please upload an image first.', 'warning');
            return;
        }

        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Process based on current tab
        switch(currentTab) {
            case 'resize':
                processResize(canvas, ctx);
                break;
            case 'crop':
                processCrop(canvas, ctx);
                break;
            case 'compress':
                processCompress(canvas, ctx);
                break;
            case 'convert':
                processConvert(canvas, ctx);
                break;
        }
    }

    // Process resize
    function processResize(canvas, ctx) {
        const width = parseInt(resizeWidth.value);
        const height = parseInt(resizeHeight.value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            showNotification('Please enter valid dimensions.', 'error');
            return;
        }

        canvas.width = width;
        canvas.height = height;

        // Use high quality resizing if enabled
        if (highQuality.checked) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }

        ctx.drawImage(originalImageObj, 0, 0, width, height);

        // Get output format
        const format = originalFile.type;

        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            displayResult(blob, width, height);
        }, format, 1.0);
    }

    // Process crop
    function processCrop(canvas, ctx) {
        if (!cropper) {
            showNotification('Please initialize the cropper first.', 'error');
            return;
        }

        // Get cropped canvas
        const croppedCanvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: highQuality.checked,
            imageSmoothingQuality: highQuality.checked ? 'high' : 'medium'
        });

        if (!croppedCanvas) {
            showNotification('Failed to crop image.', 'error');
            return;
        }

        // Get output format
        const format = originalFile.type;

        // Convert canvas to blob
        croppedCanvas.toBlob(function(blob) {
            displayResult(blob, croppedCanvas.width, croppedCanvas.height);
        }, format, 1.0);
    }

    // Process compress
    function processCompress(canvas, ctx) {
        let width = originalImageObj.width;
        let height = originalImageObj.height;

        // Resize before compression if enabled
        if (resizeBeforeCompress.checked) {
            const maxWidthValue = parseInt(maxWidth.value);

            if (!isNaN(maxWidthValue) && maxWidthValue > 0 && width > maxWidthValue) {
                const ratio = height / width;
                width = maxWidthValue;
                height = Math.round(width * ratio);
            }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(originalImageObj, 0, 0, width, height);

        // Get quality
        const quality = parseInt(qualitySlider.value) / 100;

        // Get output format
        const format = originalFile.type;

        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            displayResult(blob, width, height);
        }, format, quality);
    }

    // Process convert
    function processConvert(canvas, ctx) {
        canvas.width = originalImageObj.width;
        canvas.height = originalImageObj.height;

        ctx.drawImage(originalImageObj, 0, 0);

        // Get output format
        let format = 'image/jpeg';
        let quality = 0.9;

        switch(outputFormat.value) {
            case 'jpeg':
                format = 'image/jpeg';
                quality = parseInt(jpegQuality.value) / 100;
                break;
            case 'png':
                format = 'image/png';
                // PNG doesn't use quality parameter
                quality = undefined;
                break;
            case 'webp':
                format = 'image/webp';
                quality = parseInt(jpegQuality.value) / 100;
                break;
            case 'gif':
                format = 'image/gif';
                // GIF doesn't use quality parameter
                quality = undefined;
                break;
            case 'bmp':
                format = 'image/bmp';
                // BMP doesn't use quality parameter
                quality = undefined;
                break;
        }

        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            displayResult(blob, canvas.width, canvas.height);
        }, format, quality);
    }

    // Display result
    function displayResult(blob, width, height) {
        processedBlob = blob;

        // Create object URL
        const url = URL.createObjectURL(blob);

        // Update result image
        resultImage.src = url;

        // Update result info
        resultDimensions.textContent = `${width} × ${height}`;
        resultSize.textContent = formatBytes(blob.size);

        // Calculate size reduction
        const reduction = ((originalFile.size - blob.size) / originalFile.size) * 100;
        sizeReduction.textContent = `${reduction.toFixed(2)}%`;

        // Generate file name
        const extension = blob.type.split('/')[1];
        processedFileName = `${originalFile.name.split('.')[0]}_${currentTab}.${extension}`;

        // Show result container
        resultContainer.style.display = 'block';

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });

        // Show notification based on the current tab
        let notificationMessage = '';
        switch(currentTab) {
            case 'resize':
                notificationMessage = `Image resized to ${width} × ${height} successfully!`;
                break;
            case 'crop':
                notificationMessage = 'Image cropped successfully!';
                break;
            case 'compress':
                notificationMessage = `Image compressed by ${reduction.toFixed(2)}% successfully!`;
                break;
            case 'convert':
                notificationMessage = `Image converted to ${extension.toUpperCase()} successfully!`;
                break;
        }
        showNotification(notificationMessage, 'success');
    }

    // Download image
    function downloadImage() {
        if (!processedBlob) {
            showNotification('No processed image to download.', 'error');
            return;
        }

        const url = URL.createObjectURL(processedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = processedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success notification
        showNotification(`Image downloaded as ${processedFileName}`, 'success');
    }

    // Reset options
    function resetOptions() {
        // Reset based on current tab
        switch(currentTab) {
            case 'resize':
                resizeWidth.value = originalImageObj.width;
                resizeHeight.value = originalImageObj.height;
                maintainAspectRatio.checked = true;
                resizeMethod.value = 'dimensions';
                handleResizeMethodChange();
                break;
            case 'crop':
                if (cropper) {
                    cropper.reset();
                }
                cropAspectRatio.value = 'free';
                showGrid.checked = true;
                updateCropGrid();
                break;
            case 'compress':
                qualitySlider.value = 80;
                qualityValue.textContent = '80%';
                resizeBeforeCompress.checked = false;
                maxWidth.value = 1920;
                toggleCompressResize();
                break;
            case 'convert':
                outputFormat.value = 'jpeg';
                jpegQuality.value = 90;
                jpegQualityValue.textContent = '90%';
                pngTransparency.checked = true;
                handleFormatChange();
                break;
        }

        // Hide result container
        resultContainer.style.display = 'none';

        // Auto-process if enabled
        if (autoProcess.checked && originalImage.src) {
            processImage();
        }
    }

    // Open settings modal
    function openSettingsModal() {
        settingsModal.style.display = 'block';
    }

    // Close all modals
    function closeModals() {
        settingsModal.style.display = 'none';
    }


    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const notificationIcon = document.querySelector('.notification-icon');

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

    // Initialize the application
    init();
});
