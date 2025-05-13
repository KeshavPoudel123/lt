/**
 * File Compressor - File Compression Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const compressionOptions = document.getElementById('compressionOptions');
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    const compressBtn = document.getElementById('compressBtn');
    const compressionLevel = document.getElementById('compressionLevel');
    const compressionLevelValue = document.getElementById('compressionLevelValue');
    const compressionFormat = document.getElementById('compressionFormat');
    const compressionProgress = document.getElementById('compressionProgress');
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    const progressPercentage = document.getElementById('progressPercentage');
    const resultContainer = document.getElementById('resultContainer');
    const resultItems = document.getElementById('resultItems');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const compressMoreBtn = document.getElementById('compressMoreBtn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // State variables
    let selectedFiles = [];
    let compressedFiles = [];
    let currentFileIndex = 0;
    let totalFilesToProcess = 0;

    // Initialize event listeners
    initEventListeners();

    function initEventListeners() {
        // File selection events
        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop events
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        // Compression events
        compressionLevel.addEventListener('input', updateCompressionLevelDisplay);
        compressBtn.addEventListener('click', startCompression);

        // Result events
        downloadAllBtn.addEventListener('click', downloadAllFiles);

        // Compress more files button - ensure it properly resets the UI
        compressMoreBtn.addEventListener('click', function() {
            resetCompressor();
            // Ensure the upload container is visible
            dropZone.style.display = 'flex';
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }

    function processFiles(fileList) {
        selectedFiles = [...fileList];

        if (selectedFiles.length > 0) {
            // Hide result container if it was previously shown
            resultContainer.style.display = 'none';

            // Display the file list
            displayFileList();

            // Show compression options
            updateCompressionUI(true);

            // Show notification
            showNotification(`${selectedFiles.length} file(s) selected`, 'info');
        }
    }

    function displayFileList() {
        fileItems.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const fileType = getFileType(file.name);
            const fileSize = formatFileSize(file.size);

            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="material-icons">${getFileIcon(fileType)}</i>
                    </div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${fileType.toUpperCase()} • ${fileSize}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file" data-index="${index}">
                        <i class="material-icons">close</i>
                    </button>
                </div>
            `;

            fileItems.appendChild(fileItem);
        });

        // Add remove event listeners
        document.querySelectorAll('.remove-file').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFile(index);
            });
        });

        fileList.style.display = 'block';
        compressBtn.disabled = selectedFiles.length === 0;
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        displayFileList();
        compressBtn.disabled = selectedFiles.length === 0;

        if (selectedFiles.length === 0) {
            resetCompressor();
        }
    }

    function updateCompressionLevelDisplay() {
        const level = compressionLevel.value;
        let description = 'Medium';

        if (level <= 3) {
            description = 'Low';
        } else if (level >= 7) {
            description = 'High';
        }

        compressionLevelValue.textContent = `${description} (${level})`;
    }

    function updateCompressionUI(show) {
        compressionOptions.style.display = show ? 'block' : 'none';
    }

    function startCompression() {
        if (selectedFiles.length === 0) return;

        // Reset states
        compressedFiles = [];
        currentFileIndex = 0;
        totalFilesToProcess = selectedFiles.length;

        // Update UI
        compressionProgress.style.display = 'block';
        compressionOptions.style.display = 'none';
        fileList.style.display = 'none';

        showNotification('Starting compression...', 'info');

        // Start compression process
        compressNextFile();
    }

    function compressNextFile() {
        if (currentFileIndex >= totalFilesToProcess) {
            // All files processed, show results
            finishCompression();
            return;
        }

        const file = selectedFiles[currentFileIndex];
        const progress = Math.round((currentFileIndex / totalFilesToProcess) * 100);

        // Update progress
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${progress}%`;
        progressStatus.textContent = `Compressing ${file.name}...`;

        // Process based on file type
        setTimeout(() => {
            compressFile(file)
                .then(compressedFile => {
                    compressedFiles.push({
                        original: file,
                        compressed: compressedFile,
                        name: file.name,
                        savings: calculateSavings(file.size, compressedFile.size)
                    });

                    currentFileIndex++;
                    compressNextFile();
                })
                .catch(error => {
                    console.error('Compression error:', error);
                    showNotification(`Error compressing ${file.name}`, 'error');
                    // Continue with next file even if there's an error
                    currentFileIndex++;
                    compressNextFile();
                });
        }, 500); // Delay to show progress
    }

    function compressFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const level = parseInt(compressionLevel.value);
            const format = compressionFormat.value;

            reader.onload = function(e) {
                const fileData = new Uint8Array(e.target.result);

                // Choose compression method based on file type
                const fileType = getFileType(file.name);

                try {
                    // Use appropriate compression method based on file type
                    if (format === 'zip') {
                        // Compress to ZIP regardless of original format
                        compressToZip(file, fileData)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // Keep original format and apply appropriate compression
                        switch (fileType) {
                            case 'image':
                                compressImage(file, fileData, level)
                                    .then(resolve)
                                    .catch(reject);
                                break;
                            case 'pdf':
                            case 'zip':
                            case 'file':
                            default:
                                // Default to generic compression for most files
                                const compressed = compressGeneric(fileData, level);
                                resolve(new File([compressed], file.name, { type: file.type }));
                                break;
                        }
                    }
                } catch (error) {
                    // If compression fails, return original file
                    console.error('Error compressing file:', error);
                    resolve(file);
                }
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function compressGeneric(fileData, level) {
        try {
            // Use pako for general purpose compression
            const compressed = pako.deflate(fileData, { level: level });
            return compressed;
        } catch (error) {
            console.error('Generic compression error:', error);
            return fileData; // Return original on error
        }
    }

    function compressImage(file, fileData, level) {
        return new Promise((resolve, reject) => {
            // For images, use canvas to resize and compress
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = function() {
                // Release object URL
                URL.revokeObjectURL(url);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                // Apply compression level (higher level = more compression)
                const qualityFactor = 1 - (level * 0.1); // Map 1-9 to 0.9-0.1

                canvas.width = width;
                canvas.height = height;

                // Draw image to canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Get image format
                let format = 'image/jpeg';
                if (file.type === 'image/png') {
                    format = 'image/png';
                } else if (file.type === 'image/webp') {
                    format = 'image/webp';
                }

                // Convert to blob with quality setting
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(new File([blob], file.name, { type: format }));
                    } else {
                        reject(new Error('Canvas to Blob conversion failed'));
                    }
                }, format, qualityFactor);
            };

            img.onerror = reject;
            img.src = url;
        });
    }

    function compressToZip(file, fileData) {
        return new Promise((resolve, reject) => {
            try {
                const zip = new JSZip();
                zip.file(file.name, fileData);

                zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: parseInt(compressionLevel.value)
                    }
                }).then(blob => {
                    const zipFileName = file.name.split('.')[0] + '.zip';
                    resolve(new File([blob], zipFileName, { type: 'application/zip' }));
                }).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    function finishCompression() {
        // Complete progress bar
        progressBar.style.width = '100%';
        progressPercentage.textContent = '100%';
        progressStatus.textContent = 'Compression completed!';

        // Display results
        displayResults();

        // Show notification
        showNotification('Compression completed successfully!', 'success');

        // Hide progress after a delay
        setTimeout(() => {
            compressionProgress.style.display = 'none';
            resultContainer.style.display = 'block';
        }, 1000);
    }

    function displayResults() {
        resultItems.innerHTML = '';

        compressedFiles.forEach((result, index) => {
            const originalSize = formatFileSize(result.original.size);
            const compressedSize = formatFileSize(result.compressed.size);
            const savings = result.savings;
            const fileType = getFileType(result.name);

            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';

            resultCard.innerHTML = `
                <div class="result-header">
                    <div class="result-title">
                        <i class="material-icons">${getFileIcon(fileType)}</i>
                        ${result.name}
                    </div>
                    <button class="btn download-file" data-index="${index}">
                        <i class="material-icons">download</i> Download
                    </button>
                </div>
                <div class="result-info">
                    <div class="info-item">
                        <div class="info-label">Original Size</div>
                        <div class="info-value">${originalSize}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Compressed Size</div>
                        <div class="info-value">${compressedSize}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Space Saved</div>
                        <div class="info-value">${savings}%</div>
                    </div>
                </div>
            `;

            resultItems.appendChild(resultCard);
        });

        // Add download event listeners
        document.querySelectorAll('.download-file').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                downloadFile(compressedFiles[index].compressed);
            });
        });
    }

    function downloadFile(file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');

        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);

        showNotification(`Downloaded ${file.name}`, 'success');
    }

    function downloadAllFiles() {
        // If there's only one file, download it directly
        if (compressedFiles.length === 1) {
            downloadFile(compressedFiles[0].compressed);
            return;
        }

        // Create a zip containing all compressed files
        const zip = new JSZip();

        compressedFiles.forEach(file => {
            zip.file(file.compressed.name, file.compressed);
        });

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = "compressed_files.zip";
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);

            showNotification('Downloaded all compressed files as ZIP', 'success');
        }).catch(error => {
            console.error('Error creating zip file:', error);
            showNotification('Failed to create ZIP archive. Please try downloading files individually.', 'error');
        });
    }

    function resetCompressor() {
        // Reset UI
        resultContainer.style.display = 'none';
        fileList.style.display = 'none';
        compressionOptions.style.display = 'none';
        compressionProgress.style.display = 'none';

        // Clear files
        selectedFiles = [];
        compressedFiles = [];
        fileItems.innerHTML = '';
        resultItems.innerHTML = '';

        // Reset file input
        fileInput.value = '';

        // Disable compress button
        compressBtn.disabled = true;

        // Reset progress
        progressBar.style.width = '0%';
        progressPercentage.textContent = '0%';
        progressStatus.textContent = 'Processing files...';

        // Reset compression level to default
        compressionLevel.value = 6;
        updateCompressionLevelDisplay();

        // Reset compression format to default
        compressionFormat.value = 'same';

        // Make sure the drop zone is visible again
        dropZone.style.display = 'flex';
        if (dropZone.classList.contains('dragover')) {
            dropZone.classList.remove('dragover');
        }

        showNotification('Ready to compress new files', 'info');
    }

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

    // Utility functions
    function getFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();

        // Image formats
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
            return 'image';
        }

        // Document formats
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) {
            return extension === 'pdf' ? 'pdf' : 'document';
        }

        // Archive formats
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
            return 'archive';
        }

        // Audio formats
        if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
            return 'audio';
        }

        // Video formats
        if (['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(extension)) {
            return 'video';
        }

        // Default
        return 'file';
    }

    function getFileIcon(fileType) {
        switch (fileType) {
            case 'image': return 'image';
            case 'document': return 'description';
            case 'pdf': return 'picture_as_pdf';
            case 'archive': return 'folder_zip';
            case 'audio': return 'audio_file';
            case 'video': return 'video_file';
            default: return 'insert_drive_file';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function calculateSavings(originalSize, compressedSize) {
        if (originalSize === 0) return 0;

        const savedPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        // Handle cases where compression increases file size
        return Math.max(0, savedPercentage);
    }

    // Initialize compression level display
    updateCompressionLevelDisplay();
});
