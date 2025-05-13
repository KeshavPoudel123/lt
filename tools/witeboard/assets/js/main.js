/**
 * Witeboard - Online Collaborative Whiteboard
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Tools
    const penTool = document.getElementById('pen-tool');
    const highlighterTool = document.getElementById('highlighter-tool');
    const eraserTool = document.getElementById('eraser-tool');
    const textTool = document.getElementById('text-tool');
    const lineTool = document.getElementById('line-tool');
    const rectangleTool = document.getElementById('rectangle-tool');
    const circleTool = document.getElementById('circle-tool');
    const triangleTool = document.getElementById('triangle-tool');
    const arrowTool = document.getElementById('arrow-tool');

    // DOM Elements - Style Controls
    const colorPicker = document.getElementById('color-picker');
    const colorPresets = document.querySelectorAll('.color-preset');
    const strokeWidth = document.getElementById('stroke-width');
    const opacity = document.getElementById('opacity');

    // DOM Elements - Action Controls
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');
    const shareBtn = document.getElementById('share-btn');

    // DOM Elements - Canvas
    const canvasContainer = document.querySelector('.canvas-container');
    const canvas = document.getElementById('drawing-canvas');

    // DOM Elements - Text Input
    const textInputContainer = document.getElementById('text-input-container');
    const textInput = document.getElementById('text-input');
    const textApply = document.getElementById('text-apply');
    const textCancel = document.getElementById('text-cancel');

    // DOM Elements - Zoom Controls
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const zoomReset = document.getElementById('zoom-reset');
    const zoomLevel = document.getElementById('zoom-level');

    // DOM Elements - Status
    const statusMessage = document.getElementById('status-message');

    // DOM Elements - Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const showGridToggle = document.getElementById('show-grid');
    const canvasBackground = document.getElementById('canvas-background');

    // DOM Elements - Share Modal
    const shareModal = document.getElementById('share-modal');
    const shareLink = document.getElementById('share-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const socialButtons = document.querySelectorAll('.btn-social');

    // Fabric.js canvas
    let fabricCanvas;

    // Current tool and settings
    let currentTool = 'pen';
    let currentColor = '#000000';
    let currentWidth = 3;
    let currentOpacity = 1;
    let isDrawing = false;
    let startX, startY;
    let currentObject;

    // History for undo/redo
    let history = [];
    let historyIndex = -1;
    let canvasState = '';

    // Zoom level
    let zoom = 1;

    // Initialize the application
    function init() {
        setupCanvas();
        setupEventListeners();
        updateStatus('Ready');
    }

    // Set up the canvas
    function setupCanvas() {
        // Initialize Fabric.js canvas
        fabricCanvas = new fabric.Canvas('drawing-canvas', {
            isDrawingMode: true,
            width: canvasContainer.offsetWidth,
            height: canvasContainer.offsetHeight,
            backgroundColor: '#ffffff'
        });

        // Set up free drawing brush
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = currentColor;
        fabricCanvas.freeDrawingBrush.width = currentWidth;

        // Save initial state
        saveCanvasState();

        // Apply grid if enabled
        if (showGridToggle.checked) {
            applyGrid();
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Tool selection events
        penTool.addEventListener('click', () => setActiveTool('pen'));
        highlighterTool.addEventListener('click', () => setActiveTool('highlighter'));
        eraserTool.addEventListener('click', () => setActiveTool('eraser'));
        textTool.addEventListener('click', () => setActiveTool('text'));
        lineTool.addEventListener('click', () => setActiveTool('line'));
        rectangleTool.addEventListener('click', () => setActiveTool('rectangle'));
        circleTool.addEventListener('click', () => setActiveTool('circle'));
        triangleTool.addEventListener('click', () => setActiveTool('triangle'));
        arrowTool.addEventListener('click', () => setActiveTool('arrow'));

        // Style control events
        colorPicker.addEventListener('input', updateColor);
        colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                currentColor = preset.dataset.color;
                colorPicker.value = currentColor;
                updateBrush();
            });
        });
        strokeWidth.addEventListener('change', updateBrush);
        opacity.addEventListener('change', updateBrush);

        // Action button events
        undoBtn.addEventListener('click', undo);
        redoBtn.addEventListener('click', redo);
        clearBtn.addEventListener('click', clearCanvas);
        saveBtn.addEventListener('click', saveCanvas);
        shareBtn.addEventListener('click', shareCanvas);

        // Text input events
        textApply.addEventListener('click', applyText);
        textCancel.addEventListener('click', cancelText);

        // Zoom control events
        zoomIn.addEventListener('click', () => changeZoom(0.1));
        zoomOut.addEventListener('click', () => changeZoom(-0.1));
        zoomReset.addEventListener('click', resetZoom);

        // Canvas events
        fabricCanvas.on('mouse:down', handleMouseDown);
        fabricCanvas.on('mouse:move', handleMouseMove);
        fabricCanvas.on('mouse:up', handleMouseUp);
        fabricCanvas.on('object:added', saveCanvasState);
        fabricCanvas.on('object:modified', saveCanvasState);

        // Window resize event
        window.addEventListener('resize', resizeCanvas);

        // Settings events
        settingsBtn.addEventListener('click', openSettingsModal);
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        darkModeToggle.addEventListener('change', toggleDarkMode);
        showGridToggle.addEventListener('change', toggleGrid);
        canvasBackground.addEventListener('change', changeBackground);

        // Share modal events
        copyLinkBtn.addEventListener('click', copyShareLink);
        socialButtons.forEach(button => {
            button.addEventListener('click', handleSocialShare);
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModals();
            }
            if (e.target === shareModal) {
                closeModals();
            }
        });
    }

    // Set active tool
    function setActiveTool(tool) {
        // Remove active class from all tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected tool
        switch(tool) {
            case 'pen':
                penTool.classList.add('active');
                break;
            case 'highlighter':
                highlighterTool.classList.add('active');
                break;
            case 'eraser':
                eraserTool.classList.add('active');
                break;
            case 'text':
                textTool.classList.add('active');
                break;
            case 'line':
                lineTool.classList.add('active');
                break;
            case 'rectangle':
                rectangleTool.classList.add('active');
                break;
            case 'circle':
                circleTool.classList.add('active');
                break;
            case 'triangle':
                triangleTool.classList.add('active');
                break;
            case 'arrow':
                arrowTool.classList.add('active');
                break;
        }

        currentTool = tool;

        // Set drawing mode based on tool
        if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
            fabricCanvas.isDrawingMode = true;

            if (tool === 'highlighter') {
                fabricCanvas.freeDrawingBrush.color = currentColor;
                fabricCanvas.freeDrawingBrush.opacity = 0.5;
                fabricCanvas.freeDrawingBrush.width = parseInt(strokeWidth.value) * 2;
            } else if (tool === 'eraser') {
                // Get the current canvas background color
                const bgColor = fabricCanvas.backgroundColor || '#ffffff';
                fabricCanvas.freeDrawingBrush.color = bgColor;
                fabricCanvas.freeDrawingBrush.opacity = 1;
                fabricCanvas.freeDrawingBrush.width = parseInt(strokeWidth.value) * 3; // Make eraser larger

                // Add event listener for object selection when in eraser mode
                fabricCanvas.on('mouse:down', function(options) {
                    if (currentTool === 'eraser' && !fabricCanvas.isDrawingMode) {
                        const target = fabricCanvas.findTarget(options.e);
                        if (target) {
                            fabricCanvas.remove(target);
                            saveCanvasState();
                        }
                    }
                });
            } else {
                updateBrush();

                // Remove eraser-specific event listener when switching to other tools
                fabricCanvas.off('mouse:down');
            }
        } else {
            fabricCanvas.isDrawingMode = false;
        }

        updateStatus(`Tool: ${tool}`);
    }

    // Update color
    function updateColor() {
        currentColor = colorPicker.value;
        updateBrush();
    }

    // Update brush settings
    function updateBrush() {
        currentWidth = parseInt(strokeWidth.value);
        currentOpacity = parseFloat(opacity.value);

        if (fabricCanvas.isDrawingMode) {
            fabricCanvas.freeDrawingBrush.color = currentColor;
            fabricCanvas.freeDrawingBrush.width = currentWidth;
            fabricCanvas.freeDrawingBrush.opacity = currentOpacity;
        }
    }

    // Handle mouse down
    function handleMouseDown(options) {
        if (fabricCanvas.isDrawingMode) return;

        isDrawing = true;
        const pointer = fabricCanvas.getPointer(options.e);
        startX = pointer.x;
        startY = pointer.y;

        if (currentTool === 'text') {
            // Position text input at click position
            textInputContainer.style.display = 'block';
            textInputContainer.style.left = `${options.e.clientX}px`;
            textInputContainer.style.top = `${options.e.clientY}px`;
            textInput.focus();
        }
    }

    // Handle mouse move
    function handleMouseMove(options) {
        if (!isDrawing || fabricCanvas.isDrawingMode) return;

        // Remove previous temporary object
        if (currentObject) {
            fabricCanvas.remove(currentObject);
        }

        const pointer = fabricCanvas.getPointer(options.e);

        switch(currentTool) {
            case 'line':
                currentObject = new fabric.Line([startX, startY, pointer.x, pointer.y], {
                    stroke: currentColor,
                    strokeWidth: currentWidth,
                    opacity: currentOpacity,
                    selectable: false
                });
                break;
            case 'rectangle':
                currentObject = new fabric.Rect({
                    left: Math.min(startX, pointer.x),
                    top: Math.min(startY, pointer.y),
                    width: Math.abs(pointer.x - startX),
                    height: Math.abs(pointer.y - startY),
                    fill: 'transparent',
                    stroke: currentColor,
                    strokeWidth: currentWidth,
                    opacity: currentOpacity,
                    selectable: false
                });
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)) / 2;
                const centerX = (startX + pointer.x) / 2;
                const centerY = (startY + pointer.y) / 2;

                currentObject = new fabric.Circle({
                    left: centerX - radius,
                    top: centerY - radius,
                    radius: radius,
                    fill: 'transparent',
                    stroke: currentColor,
                    strokeWidth: currentWidth,
                    opacity: currentOpacity,
                    selectable: false
                });
                break;
            case 'triangle':
                const width = pointer.x - startX;
                const height = pointer.y - startY;

                currentObject = new fabric.Triangle({
                    left: startX,
                    top: startY,
                    width: width,
                    height: height,
                    fill: 'transparent',
                    stroke: currentColor,
                    strokeWidth: currentWidth,
                    opacity: currentOpacity,
                    selectable: false
                });
                break;
            case 'arrow':
                // Create arrow as a group of line and triangle
                const dx = pointer.x - startX;
                const dy = pointer.y - startY;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                // Calculate the length of the line
                const lineLength = Math.sqrt(dx * dx + dy * dy);

                // Calculate the position for the arrowhead
                // Move it back from the end point to avoid overlap
                const arrowHeadSize = Math.max(12, currentWidth * 4);
                const arrowHeadOffset = Math.min(arrowHeadSize, lineLength / 2);

                // Calculate the end point of the line (slightly before the actual end)
                const endX = startX + dx * (1 - arrowHeadOffset / lineLength);
                const endY = startY + dy * (1 - arrowHeadOffset / lineLength);

                // Create the line
                const line = new fabric.Line([startX, startY, endX, endY], {
                    stroke: currentColor,
                    strokeWidth: currentWidth,
                    opacity: currentOpacity
                });

                // Create the arrowhead
                const arrowHead = new fabric.Triangle({
                    width: arrowHeadSize,
                    height: arrowHeadSize,
                    fill: currentColor,
                    left: pointer.x,
                    top: pointer.y,
                    angle: angle + 90,
                    opacity: currentOpacity,
                    originX: 'center',
                    originY: 'center'
                });

                // Position the arrowhead at the end of the line
                arrowHead.set({
                    left: pointer.x,
                    top: pointer.y
                });

                // Group the line and arrowhead
                currentObject = new fabric.Group([line, arrowHead], {
                    selectable: false
                });
                break;
        }

        if (currentObject) {
            fabricCanvas.add(currentObject);
            fabricCanvas.renderAll();
        }
    }

    // Handle mouse up
    function handleMouseUp() {
        isDrawing = false;

        if (currentObject && currentTool !== 'text') {
            currentObject.selectable = true;
            fabricCanvas.setActiveObject(currentObject);
            currentObject = null;
            saveCanvasState();
        }
    }

    // Apply text
    function applyText() {
        const text = textInput.value.trim();

        if (text) {
            const textObj = new fabric.IText(text, {
                left: startX,
                top: startY,
                fontFamily: 'Arial',
                fontSize: currentWidth * 5,
                fill: currentColor,
                opacity: currentOpacity,
                selectable: true
            });

            fabricCanvas.add(textObj);
            fabricCanvas.setActiveObject(textObj);
            saveCanvasState();
        }

        textInputContainer.style.display = 'none';
        textInput.value = '';
    }

    // Cancel text
    function cancelText() {
        textInputContainer.style.display = 'none';
        textInput.value = '';
    }

    // Save canvas state for undo/redo
    function saveCanvasState() {
        // If we're not at the end of the history, remove everything after current index
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }

        // Save current state
        const json = JSON.stringify(fabricCanvas.toJSON());

        // Only save if state has changed
        if (json !== canvasState) {
            history.push(json);
            historyIndex = history.length - 1;
            canvasState = json;

            // Enable/disable undo/redo buttons
            undoBtn.disabled = historyIndex <= 0;
            redoBtn.disabled = historyIndex >= history.length - 1;
        }
    }

    // Undo
    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            loadCanvasState();
        }
    }

    // Redo
    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            loadCanvasState();
        }
    }

    // Load canvas state
    function loadCanvasState() {
        if (history[historyIndex]) {
            fabricCanvas.loadFromJSON(history[historyIndex], function() {
                fabricCanvas.renderAll();
                canvasState = history[historyIndex];

                // Enable/disable undo/redo buttons
                undoBtn.disabled = historyIndex <= 0;
                redoBtn.disabled = historyIndex >= history.length - 1;
            });
        }
    }

    // Clear canvas
    function clearCanvas() {
        // Show confirmation notification with action buttons
        showConfirmationNotification(
            'Clear canvas?',
            'This action cannot be undone.',
            () => {
                fabricCanvas.clear();
                fabricCanvas.backgroundColor = '#ffffff';
                fabricCanvas.renderAll();
                saveCanvasState();
                updateStatus('Canvas cleared');
                showNotification('Canvas cleared', 'success');
            }
        );
    }

    // Save canvas as PNG
    function saveCanvas() {
        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `witeboard-${Date.now()}.png`;
        link.click();

        updateStatus('Canvas saved as PNG');
    }

    // Share canvas
    function shareCanvas() {
        // Generate a fake share link for demo purposes
        shareLink.value = `https://latestonlinetools.com/share/witeboard-${Date.now()}`;

        shareModal.style.display = 'block';
    }

    // Copy share link
    function copyShareLink() {
        shareLink.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    }

    // Handle social share
    function handleSocialShare(e) {
        // This would normally open a share dialog for the respective platform
        showNotification('Sharing functionality would be implemented here', 'info');
    }

    // Change zoom
    function changeZoom(delta) {
        zoom = Math.max(0.1, Math.min(3, zoom + delta));
        applyZoom();
    }

    // Reset zoom
    function resetZoom() {
        zoom = 1;
        applyZoom();
    }

    // Apply zoom
    function applyZoom() {
        fabricCanvas.setZoom(zoom);
        zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
        updateStatus(`Zoom: ${Math.round(zoom * 100)}%`);
    }

    // Resize canvas
    function resizeCanvas() {
        const width = canvasContainer.offsetWidth;
        const height = canvasContainer.offsetHeight;

        fabricCanvas.setDimensions({
            width: width,
            height: height
        });

        fabricCanvas.renderAll();
    }

    // Update status message
    function updateStatus(message) {
        statusMessage.textContent = message;
    }

    // Open settings modal
    function openSettingsModal() {
        settingsModal.style.display = 'block';
    }

    // Close all modals
    function closeModals() {
        settingsModal.style.display = 'none';
        shareModal.style.display = 'none';
    }

    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    }

    // Toggle grid
    function toggleGrid() {
        if (showGridToggle.checked) {
            applyGrid();
        } else {
            removeGrid();
        }
    }

    // Apply grid
    function applyGrid() {
        const isDarkBackground = canvasBackground.value === 'dark-gray' || canvasBackground.value === 'black';
        canvasContainer.classList.add(isDarkBackground ? 'canvas-grid-dark' : 'canvas-grid');
    }

    // Remove grid
    function removeGrid() {
        canvasContainer.classList.remove('canvas-grid', 'canvas-grid-dark');
    }

    // Change background
    function changeBackground() {
        const bg = canvasBackground.value;

        // Remove all background classes
        canvasContainer.classList.remove('canvas-white', 'canvas-light-gray', 'canvas-dark-gray', 'canvas-black');

        // Add selected background class
        canvasContainer.classList.add(`canvas-${bg}`);

        // Update grid if enabled
        if (showGridToggle.checked) {
            removeGrid();
            applyGrid();
        }

        // Update canvas background
        let bgColor;
        switch(bg) {
            case 'white':
                bgColor = '#ffffff';
                break;
            case 'light-gray':
                bgColor = '#f0f0f0';
                break;
            case 'dark-gray':
                bgColor = '#333333';
                break;
            case 'black':
                bgColor = '#000000';
                break;
        }

        fabricCanvas.backgroundColor = bgColor;
        fabricCanvas.renderAll();
    }

    // Show notification (Apple-style)
    function showNotification(message, type = 'success') {
        // Remove existing notification of the same type
        const existingNotification = document.querySelector(`.notification.${type}`);
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

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

        notification.innerHTML = `
            <div class="notification-content">
                <i class="material-icons">${icon}</i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Show confirmation notification with action buttons (Apple-style)
    function showConfirmationNotification(title, message, confirmCallback) {
        // Remove any existing confirmation notifications
        const existingConfirmation = document.querySelector('.confirmation-notification');
        if (existingConfirmation) {
            existingConfirmation.remove();
        }

        // Create confirmation notification
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation-notification';

        confirmation.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <i class="material-icons">help</i>
                    <h3>${title}</h3>
                </div>
                <p>${message}</p>
                <div class="confirmation-actions">
                    <button class="cancel-btn">Cancel</button>
                    <button class="confirm-btn">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmation);

        // Show confirmation with animation
        requestAnimationFrame(() => {
            confirmation.classList.add('show');
        });

        // Add event listeners to buttons
        const cancelBtn = confirmation.querySelector('.cancel-btn');
        const confirmBtn = confirmation.querySelector('.confirm-btn');

        cancelBtn.addEventListener('click', () => {
            confirmation.classList.remove('show');
            confirmation.classList.add('hide');
            setTimeout(() => {
                confirmation.remove();
            }, 500);
        });

        confirmBtn.addEventListener('click', () => {
            confirmation.classList.remove('show');
            confirmation.classList.add('hide');
            setTimeout(() => {
                confirmation.remove();
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
            }, 500);
        });
    }

    // Initialize the application
    init();
});
