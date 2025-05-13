/**
 * Image Editor - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageContainer = document.getElementById('imageContainer');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const controlsContainer = document.getElementById('controlsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Crop elements
    const cropBtn = document.getElementById('cropBtn');
    const cropControls = document.getElementById('cropControls');
    const applyCropBtn = document.getElementById('applyCropBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    const cropRatioBtns = document.querySelectorAll('.crop-ratio-btn');

    // Resize and rotation elements
    const resizeWidthInput = document.getElementById('resizeWidth');
    const resizeHeightInput = document.getElementById('resizeHeight');
    const maintainAspectRatioCheckbox = document.getElementById('maintainAspectRatio');
    const applyResizeBtn = document.getElementById('applyResizeBtn');
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const flipHorizontalBtn = document.getElementById('flipHorizontalBtn');
    const flipVerticalBtn = document.getElementById('flipVerticalBtn');

    // Export options
    const fileFormatSelect = document.getElementById('fileFormat');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const jpegQualityContainer = document.getElementById('jpegQualityContainer');

    // Collapsible filter groups
    const filterGroups = document.querySelectorAll('.filter-group h3');

    // Image state
    let originalImage = null;
    let currentImage = null;
    let aspectRatio = 1;
    let currentRotation = 0;
    let isFlippedHorizontally = false;
    let isFlippedVertically = false;
    let activeEffect = 'none';

    // Crop state
    let isCropping = false;
    let cropContainer = null;
    let cropArea = null;
    let cropHandles = [];
    let selectedCropRatio = 'free';
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    let activeCropHandle = null;

    // Filter values
    const filters = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hueRotate: 0,
        sepia: 0,
        grayscale: 0,
        blur: 0,
        invert: 0,
        opacity: 100
    };

    // Filter sliders
    const filterSliders = document.querySelectorAll('.filter-slider');

    // Initialize
    initializeApp();

    function initializeApp() {
        // Toggle filter groups
        filterGroups.forEach(group => {
            group.addEventListener('click', () => {
                const content = group.nextElementSibling;
                const icon = group.querySelector('i');
                content.classList.toggle('hidden');
                icon.classList.toggle('open');
            });
        });

        // File input change
        fileInput.addEventListener('change', handleFileSelect);

        // Upload button click
        uploadBtn.addEventListener('click', () => fileInput.click());

        // Reset button click
        resetBtn.addEventListener('click', resetAllFilters);

        // Download button click
        downloadBtn.addEventListener('click', downloadImage);

        // Filter sliders input
        filterSliders.forEach(slider => {
            const filterId = slider.id;
            const valueDisplay = document.getElementById(`${filterId}Value`);

            slider.addEventListener('input', () => {
                filters[filterId] = parseInt(slider.value);
                valueDisplay.textContent = slider.value;
                applyFilters();
            });
        });

        // Quality slider
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value;
        });

        // File format change
        fileFormatSelect.addEventListener('change', () => {
            jpegQualityContainer.style.display =
                fileFormatSelect.value === 'image/jpeg' || fileFormatSelect.value === 'image/webp'
                    ? 'block'
                    : 'none';
        });

        // Resize input handling
        resizeWidthInput.addEventListener('input', handleResizeInput);
        resizeHeightInput.addEventListener('input', handleResizeInput);

        // Apply resize button
        applyResizeBtn.addEventListener('click', applyResize);

        // Rotation and flip buttons
        rotateLeftBtn.addEventListener('click', () => rotateImage(-90));
        rotateRightBtn.addEventListener('click', () => rotateImage(90));
        flipHorizontalBtn.addEventListener('click', () => flipImage('horizontal'));
        flipVerticalBtn.addEventListener('click', () => flipImage('vertical'));

        // Crop functionality
        cropBtn.addEventListener('click', startCropping);
        applyCropBtn.addEventListener('click', applyCrop);
        cancelCropBtn.addEventListener('click', cancelCrop);

        // Crop ratio buttons
        cropRatioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                cropRatioBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Set selected ratio
                selectedCropRatio = btn.getAttribute('data-ratio');

                // Update crop area if cropping is active
                if (isCropping && cropArea) {
                    updateCropAreaByRatio();
                }
            });
        });

        // Effect items
        const effectItems = document.querySelectorAll('.effect-item');
        effectItems.forEach(item => {
            item.addEventListener('click', () => {
                const effect = item.getAttribute('data-effect');
                applyPresetEffect(effect);

                // Update active state
                effectItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Drag and drop handling
        setupDragAndDrop();
    }

    function setupDragAndDrop() {
        // Make image container clickable to trigger file input
        imageContainer.addEventListener('click', function() {
            if (!currentImage) {
                fileInput.click();
            }
        });

        // Prevent defaults for drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageContainer.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Add drag enter counter to handle nested elements
        let dragCounter = 0;

        // Handle drag enter
        imageContainer.addEventListener('dragenter', function(e) {
            dragCounter++;
            highlight();
        });

        // Handle drag over
        imageContainer.addEventListener('dragover', function(e) {
            highlight();
        });

        // Handle drag leave
        imageContainer.addEventListener('dragleave', function(e) {
            dragCounter--;
            if (dragCounter === 0) {
                unhighlight();
            }
        });

        // Handle drop
        imageContainer.addEventListener('drop', function(e) {
            dragCounter = 0;
            unhighlight();
            handleDrop(e);
        });

        function highlight() {
            if (!currentImage) {
                imageContainer.classList.add('drag-highlight');
                imagePlaceholder.innerHTML = '<i class="material-icons">cloud_upload</i><p>Release to upload image</p>';
            }
        }

        function unhighlight() {
            imageContainer.classList.remove('drag-highlight');
            if (!currentImage) {
                imagePlaceholder.innerHTML = '<i class="material-icons">image</i><p>Drag & drop image here or click to upload</p>';
            }
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                const file = files[0];

                // Check if it's an image
                if (!file.type.match('image.*')) {
                    showNotification('Please select a valid image file', 'error');
                    return;
                }

                fileInput.files = files;
                handleFileSelect({ target: { files } });
            }
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.match('image.*')) {
            showNotification('Please select a valid image file', 'error');
            return;
        }

        const reader = new FileReader();

        showLoading();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                currentImage = img;
                resetAllFilters(true);
                enableControls();
                updateImagePreview();

                // Set resize values
                resizeWidthInput.value = img.width;
                resizeHeightInput.value = img.height;
                aspectRatio = img.width / img.height;

                // Reset rotation and flip
                currentRotation = 0;
                isFlippedHorizontally = false;
                isFlippedVertically = false;

                hideLoading();
                showNotification('Image loaded successfully!', 'success');
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    function updateImagePreview() {
        // Show image preview
        imagePreview.style.display = 'block';

        // Update canvas and image
        updateCanvasImage();

        // Apply filters
        applyFilters();

        // Update container class
        imageContainer.classList.add('has-image');
        imagePlaceholder.style.display = 'none';
    }

    function applyFilters() {
        if (!currentImage) return;

        // Create the filter string
        const filterString = `
            brightness(${100 + filters.brightness}%)
            contrast(${100 + filters.contrast}%)
            saturate(${100 + filters.saturation}%)
            hue-rotate(${filters.hueRotate}deg)
            sepia(${filters.sepia}%)
            grayscale(${filters.grayscale}%)
            blur(${filters.blur}px)
            invert(${filters.invert}%)
            opacity(${filters.opacity}%)
        `;

        // First, redraw the original image with rotation and flipping
        updateCanvasImage();

        // Then apply the filter to the image preview directly
        // This ensures the filters are visible to the user
        imagePreview.style.filter = filterString;
    }

    function updateCanvasImage() {
        // Set canvas dimensions
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply rotation and flip
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.scale(
            isFlippedHorizontally ? -1 : 1,
            isFlippedVertically ? -1 : 1
        );
        ctx.drawImage(
            currentImage,
            -currentImage.width / 2,
            -currentImage.height / 2,
            currentImage.width,
            currentImage.height
        );
        ctx.restore();

        // Update image preview with the transformed image (without filters)
        imagePreview.src = canvas.toDataURL();
    }

    function resetAllFilters(keepImage = false) {
        // Reset all filter values
        Object.keys(filters).forEach(key => {
            filters[key] = key === 'opacity' ? 100 : 0;

            const slider = document.getElementById(key);
            const valueDisplay = document.getElementById(`${key}Value`);

            if (slider && valueDisplay) {
                slider.value = filters[key];
                valueDisplay.textContent = filters[key];
            }
        });

        // Reset preset effects
        activeEffect = 'none';
        document.querySelectorAll('.effect-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('.effect-item[data-effect="none"]').classList.add('active');

        // Reset rotation and flip
        if (!keepImage) {
            currentRotation = 0;
            isFlippedHorizontally = false;
            isFlippedVertically = false;

            if (originalImage) {
                currentImage = originalImage;
                resizeWidthInput.value = originalImage.width;
                resizeHeightInput.value = originalImage.height;
            }
        }

        // Apply changes
        if (currentImage) {
            updateImagePreview();
            showNotification('All filters reset successfully!', 'success');
        }
    }

    function enableControls() {
        resetBtn.disabled = false;
        downloadBtn.disabled = false;
        applyResizeBtn.disabled = false;
        rotateLeftBtn.disabled = false;
        rotateRightBtn.disabled = false;
        flipHorizontalBtn.disabled = false;
        flipVerticalBtn.disabled = false;
        cropBtn.disabled = false;
    }

    function showLoading() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

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

    function handleResizeInput(e) {
        if (!maintainAspectRatioCheckbox.checked) return;

        const targetId = e.target.id;

        if (targetId === 'resizeWidth') {
            const newWidth = parseInt(resizeWidthInput.value) || 0;
            resizeHeightInput.value = Math.round(newWidth / aspectRatio);
        } else {
            const newHeight = parseInt(resizeHeightInput.value) || 0;
            resizeWidthInput.value = Math.round(newHeight * aspectRatio);
        }
    }

    function applyResize() {
        if (!currentImage) return;

        const newWidth = parseInt(resizeWidthInput.value) || currentImage.width;
        const newHeight = parseInt(resizeHeightInput.value) || currentImage.height;

        if (newWidth <= 0 || newHeight <= 0) {
            showNotification('Width and height must be positive values', 'error');
            return;
        }

        showLoading();

        setTimeout(() => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;

            // Draw the current image with its current state (without filters)
            tempCtx.drawImage(currentImage, 0, 0, newWidth, newHeight);

            const img = new Image();
            img.onload = function() {
                // Reset rotation and flip when resizing
                currentRotation = 0;
                isFlippedHorizontally = false;
                isFlippedVertically = false;

                // Update the current image
                currentImage = img;

                // Update aspect ratio
                aspectRatio = newWidth / newHeight;

                // Update the preview
                updateImagePreview();
                hideLoading();
                showNotification('Image resized successfully!', 'success');
            };
            img.src = tempCanvas.toDataURL();
        }, 100);
    }

    function rotateImage(degrees) {
        if (!currentImage) return;

        showLoading();

        setTimeout(() => {
            currentRotation = (currentRotation + degrees) % 360;

            // If rotation is a multiple of 180 degrees, we don't need to swap dimensions
            if (Math.abs(degrees) === 90 || Math.abs(degrees) === 270) {
                // Swap width and height in resize inputs
                const tempWidth = resizeWidthInput.value;
                resizeWidthInput.value = resizeHeightInput.value;
                resizeHeightInput.value = tempWidth;

                // Update aspect ratio
                aspectRatio = 1 / aspectRatio;
            }

            updateImagePreview();
            hideLoading();
            showNotification(`Image rotated by ${degrees}°`, 'success');
        }, 100);
    }

    function flipImage(direction) {
        if (!currentImage) return;

        showLoading();

        setTimeout(() => {
            if (direction === 'horizontal') {
                isFlippedHorizontally = !isFlippedHorizontally;
            } else {
                isFlippedVertically = !isFlippedVertically;
            }

            updateImagePreview();
            hideLoading();
            showNotification(`Image flipped ${direction}ly`, 'success');
        }, 100);
    }

    function applyPresetEffect(effect) {
        // Save current effect
        activeEffect = effect;

        // Reset filters first
        Object.keys(filters).forEach(key => {
            filters[key] = key === 'opacity' ? 100 : 0;
        });

        // Apply preset filter values
        switch (effect) {
            case 'vintage':
                filters.sepia = 50;
                filters.contrast = 10;
                filters.brightness = 10;
                filters.saturation = -20;
                break;
            case 'blackWhite':
                filters.grayscale = 100;
                filters.contrast = 20;
                break;
            case 'sepia':
                filters.sepia = 100;
                break;
            case 'cold':
                filters.saturation = 20;
                filters.hueRotate = 180;
                filters.brightness = 5;
                break;
            case 'warm':
                filters.saturation = 10;
                filters.sepia = 30;
                filters.brightness = 10;
                break;
            case 'dramatic':
                filters.contrast = 50;
                filters.brightness = -10;
                filters.saturation = 10;
                break;
            case 'fade':
                filters.brightness = 10;
                filters.saturation = -30;
                filters.contrast = -10;
                break;
            case 'sharpen':
                filters.contrast = 30;
                filters.brightness = 5;
                break;
        }

        // Update sliders
        Object.keys(filters).forEach(key => {
            const slider = document.getElementById(key);
            const valueDisplay = document.getElementById(`${key}Value`);

            if (slider && valueDisplay) {
                slider.value = filters[key];
                valueDisplay.textContent = filters[key];
            }
        });

        // Apply filters
        applyFilters();

        // Mark the active effect in the UI
        document.querySelectorAll('.effect-item').forEach(item => {
            if (item.getAttribute('data-effect') === effect) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        showNotification(`Applied "${effect}" effect`, 'success');
    }

    // Crop functionality
    function startCropping() {
        if (!currentImage) return;

        isCropping = true;

        // Show crop controls
        cropControls.style.display = 'block';

        // Create crop container if it doesn't exist
        if (!cropContainer) {
            cropContainer = document.createElement('div');
            cropContainer.className = 'crop-container';
            imageContainer.appendChild(cropContainer);

            // Create crop area
            cropArea = document.createElement('div');
            cropArea.className = 'crop-area';
            cropContainer.appendChild(cropArea);

            // Create crop handles
            const handlePositions = ['tl', 'tr', 'bl', 'br'];
            handlePositions.forEach(pos => {
                const handle = document.createElement('div');
                handle.className = `crop-handle ${pos}`;
                handle.setAttribute('data-position', pos);
                cropArea.appendChild(handle);
                cropHandles.push(handle);

                // Add event listeners for resizing
                handle.addEventListener('mousedown', startResizeCrop);
                handle.addEventListener('touchstart', startResizeCrop, { passive: false });
            });

            // Add event listeners for moving
            cropArea.addEventListener('mousedown', startMoveCrop);
            cropArea.addEventListener('touchstart', startMoveCrop, { passive: false });

            // Add document event listeners
            document.addEventListener('mousemove', moveCrop);
            document.addEventListener('touchmove', moveCrop, { passive: false });
            document.addEventListener('mouseup', endCrop);
            document.addEventListener('touchend', endCrop);
        }

        // Show crop container
        cropContainer.style.display = 'block';

        // Set initial crop area size (default to 80% of image)
        const imgRect = imagePreview.getBoundingClientRect();
        const containerRect = imageContainer.getBoundingClientRect();

        const cropWidth = imgRect.width * 0.8;
        const cropHeight = imgRect.height * 0.8;
        const cropLeft = (imgRect.width - cropWidth) / 2;
        const cropTop = (imgRect.height - cropHeight) / 2;

        cropArea.style.width = `${cropWidth}px`;
        cropArea.style.height = `${cropHeight}px`;
        cropArea.style.left = `${cropLeft}px`;
        cropArea.style.top = `${cropTop}px`;

        // Update crop area based on selected ratio
        updateCropAreaByRatio();

        // Disable other controls while cropping
        cropBtn.disabled = true;
        resetBtn.disabled = true;
        downloadBtn.disabled = true;

        showNotification('Drag to move, handles to resize', 'info');
    }

    function updateCropAreaByRatio() {
        if (!cropArea) return;

        if (selectedCropRatio === 'free') return;

        // Parse ratio
        const [widthRatio, heightRatio] = selectedCropRatio.split(':').map(Number);
        const ratio = widthRatio / heightRatio;

        // Get current dimensions
        const width = parseInt(cropArea.style.width);
        const height = parseInt(cropArea.style.height);

        // Calculate new dimensions based on ratio
        let newWidth = width;
        let newHeight = width / ratio;

        // If new height exceeds image height, adjust width instead
        const imgRect = imagePreview.getBoundingClientRect();
        if (newHeight > imgRect.height) {
            newHeight = imgRect.height * 0.9;
            newWidth = newHeight * ratio;
        }

        // Update crop area dimensions
        cropArea.style.width = `${newWidth}px`;
        cropArea.style.height = `${newHeight}px`;

        // Center crop area
        const left = parseInt(cropArea.style.left);
        const top = parseInt(cropArea.style.top);

        cropArea.style.left = `${left + (width - newWidth) / 2}px`;
        cropArea.style.top = `${top + (height - newHeight) / 2}px`;
    }

    function startResizeCrop(e) {
        e.preventDefault();
        e.stopPropagation();

        // Get event position
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        // Store initial values
        startX = clientX;
        startY = clientY;
        startWidth = parseInt(cropArea.style.width);
        startHeight = parseInt(cropArea.style.height);
        startLeft = parseInt(cropArea.style.left);
        startTop = parseInt(cropArea.style.top);

        // Store active handle
        activeCropHandle = e.target.getAttribute('data-position');
    }

    function startMoveCrop(e) {
        if (e.target !== cropArea) return;

        e.preventDefault();
        e.stopPropagation();

        // Get event position
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        // Store initial values
        startX = clientX;
        startY = clientY;
        startLeft = parseInt(cropArea.style.left);
        startTop = parseInt(cropArea.style.top);

        // Set active handle to null (moving, not resizing)
        activeCropHandle = null;
    }

    function moveCrop(e) {
        if (!isCropping) return;

        e.preventDefault();

        // Get event position
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        // Calculate delta
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // Get image boundaries
        const imgRect = imagePreview.getBoundingClientRect();

        if (activeCropHandle) {
            // Resizing
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            // Handle different resize handles
            switch (activeCropHandle) {
                case 'tl': // Top left
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight - deltaY;
                    newLeft = startLeft + deltaX;
                    newTop = startTop + deltaY;
                    break;
                case 'tr': // Top right
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight - deltaY;
                    newTop = startTop + deltaY;
                    break;
                case 'bl': // Bottom left
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight + deltaY;
                    newLeft = startLeft + deltaX;
                    break;
                case 'br': // Bottom right
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight + deltaY;
                    break;
            }

            // Enforce minimum size
            newWidth = Math.max(50, newWidth);
            newHeight = Math.max(50, newHeight);

            // Enforce aspect ratio if needed
            if (selectedCropRatio !== 'free') {
                const [widthRatio, heightRatio] = selectedCropRatio.split(':').map(Number);
                const ratio = widthRatio / heightRatio;

                // Determine which dimension to adjust based on handle
                if (['tl', 'tr'].includes(activeCropHandle)) {
                    newHeight = newWidth / ratio;
                } else {
                    newWidth = newHeight * ratio;
                }

                // Adjust position for top handles
                if (activeCropHandle === 'tl') {
                    newLeft = startLeft + (startWidth - newWidth);
                }
                if (['tl', 'tr'].includes(activeCropHandle)) {
                    newTop = startTop + (startHeight - newHeight);
                }
            }

            // Update crop area
            cropArea.style.width = `${newWidth}px`;
            cropArea.style.height = `${newHeight}px`;
            cropArea.style.left = `${newLeft}px`;
            cropArea.style.top = `${newTop}px`;
        } else {
            // Moving
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // Constrain to image boundaries
            const cropWidth = parseInt(cropArea.style.width);
            const cropHeight = parseInt(cropArea.style.height);

            newLeft = Math.max(0, Math.min(imgRect.width - cropWidth, newLeft));
            newTop = Math.max(0, Math.min(imgRect.height - cropHeight, newTop));

            // Update crop area position
            cropArea.style.left = `${newLeft}px`;
            cropArea.style.top = `${newTop}px`;
        }
    }

    function endCrop() {
        activeCropHandle = null;
    }

    function applyCrop() {
        if (!isCropping || !cropArea) return;

        // Get crop dimensions
        const cropWidth = parseInt(cropArea.style.width);
        const cropHeight = parseInt(cropArea.style.height);
        const cropLeft = parseInt(cropArea.style.left);
        const cropTop = parseInt(cropArea.style.top);

        // Get image dimensions
        const imgRect = imagePreview.getBoundingClientRect();

        // Calculate scale factors
        const scaleX = currentImage.width / imgRect.width;
        const scaleY = currentImage.height / imgRect.height;

        // Calculate actual crop dimensions in the original image
        const actualLeft = cropLeft * scaleX;
        const actualTop = cropTop * scaleY;
        const actualWidth = cropWidth * scaleX;
        const actualHeight = cropHeight * scaleY;

        // Create temporary canvas for cropping
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = actualWidth;
        tempCanvas.height = actualHeight;

        // Draw cropped portion to the temporary canvas
        tempCtx.drawImage(
            currentImage,
            actualLeft, actualTop, actualWidth, actualHeight,
            0, 0, actualWidth, actualHeight
        );

        // Create new image from the cropped canvas
        const img = new Image();
        img.onload = function() {
            // Update current image
            currentImage = img;

            // Update dimensions
            resizeWidthInput.value = actualWidth;
            resizeHeightInput.value = actualHeight;
            aspectRatio = actualWidth / actualHeight;

            // Update preview
            updateImagePreview();

            // End cropping
            cancelCrop();

            showNotification('Image cropped successfully!', 'success');
        };
        img.src = tempCanvas.toDataURL();
    }

    function cancelCrop() {
        isCropping = false;

        // Hide crop container
        if (cropContainer) {
            cropContainer.style.display = 'none';
        }

        // Hide crop controls
        cropControls.style.display = 'none';

        // Re-enable controls
        cropBtn.disabled = false;
        resetBtn.disabled = false;
        downloadBtn.disabled = false;
    }

    function downloadImage() {
        if (!currentImage) return;

        try {
            // Show loading spinner
            showLoading();

            // Get file format and quality
            const format = fileFormatSelect.value;
            const quality = parseInt(qualitySlider.value) / 100;

            // Create a temporary canvas for the final image with filters
            const finalCanvas = document.createElement('canvas');
            const finalCtx = finalCanvas.getContext('2d');

            // Set canvas dimensions
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height;

            // Get the filter string
            const filterString = `
                brightness(${100 + filters.brightness}%)
                contrast(${100 + filters.contrast}%)
                saturate(${100 + filters.saturation}%)
                hue-rotate(${filters.hueRotate}deg)
                sepia(${filters.sepia}%)
                grayscale(${filters.grayscale}%)
                blur(${filters.blur}px)
                invert(${filters.invert}%)
                opacity(${filters.opacity}%)
            `;

            // Apply the filter to the context
            finalCtx.filter = filterString;

            // Draw the image from the original canvas
            finalCtx.drawImage(canvas, 0, 0);

            // Set file extension based on format
            let extension = 'jpg';
            if (format === 'image/png') extension = 'png';
            if (format === 'image/webp') extension = 'webp';

            // Set filename
            const filename = `edited_image.${extension}`;

            // Create data URL
            const dataURL = finalCanvas.toDataURL(format, quality);

            // Check if we're on a mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent) && /CriOS|FxiOS/i.test(navigator.userAgent)) {
                // Special handling for iOS Chrome and Firefox which have issues with downloads
                // Open the image in a new tab
                const tab = window.open();
                tab.document.write(`<img src="${dataURL}" alt="Edited Image" style="max-width: 100%;">`);
                tab.document.title = filename;
                tab.document.close();
                hideLoading();
                showNotification('Image opened in new tab. Press and hold to save.', 'info');
                return;
            }

            // Create download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            hideLoading();
            showNotification('Image downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            hideLoading();
            showNotification('Error downloading image. Please try again.', 'error');
        }
    }
});
