/**
 * Text Difference Highlighter Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Text Diff
    const originalText = document.getElementById('original-text');
    const modifiedText = document.getElementById('modified-text');
    const compareBtn = document.getElementById('compare-btn');
    const swapBtn = document.getElementById('swap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const diffOutput = document.getElementById('diff-output');
    const clearOriginalBtn = document.getElementById('clear-original');
    const clearModifiedBtn = document.getElementById('clear-modified');
    const sampleOriginalBtn = document.getElementById('sample-original');
    const sampleModifiedBtn = document.getElementById('sample-modified');
    const copyOriginalBtn = document.getElementById('copy-original');
    const copyModifiedBtn = document.getElementById('copy-modified');
    const copyNotification = document.getElementById('copy-notification');
    const diffStats = document.getElementById('diff-stats');
    const downloadTextBtn = document.getElementById('download-text');
    const downloadPdfBtn = document.getElementById('download-pdf');

    // DOM Elements - Statistics
    const totalWordsElement = document.getElementById('total-words');
    const addedWordsElement = document.getElementById('added-words');
    const removedWordsElement = document.getElementById('removed-words');
    const unchangedWordsElement = document.getElementById('unchanged-words');

    // DOM Elements - Text Diff Options
    const viewModeRadios = document.querySelectorAll('input[name="view-mode"]');

    // Initialize the application
    function init() {
        setupEventListeners();
        loadSampleTexts();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Text diff actions
        compareBtn.addEventListener('click', compareTexts);
        swapBtn.addEventListener('click', swapTexts);
        resetBtn.addEventListener('click', resetTexts);
        clearOriginalBtn.addEventListener('click', () => originalText.value = '');
        clearModifiedBtn.addEventListener('click', () => modifiedText.value = '');
        sampleOriginalBtn.addEventListener('click', loadSampleOriginal);
        sampleModifiedBtn.addEventListener('click', loadSampleModified);

        // Copy buttons for textareas
        copyOriginalBtn.addEventListener('click', () => copyToClipboard(originalText.value, 'Original text'));
        copyModifiedBtn.addEventListener('click', () => copyToClipboard(modifiedText.value, 'Modified text'));

        // Download buttons
        downloadTextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadDiffAsText();
        });

        downloadPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadDiffAsPdf();
        });

        // View mode change
        viewModeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (diffOutput.innerHTML !== '' && !diffOutput.querySelector('.empty-state')) {
                    compareTexts();
                }
            });
        });
    }

    // Copy to clipboard with notification
    function copyToClipboard(text, source) {
        if (!text || text.trim() === '') {
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showCopyNotification();
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    // Show copy notification
    function showCopyNotification() {
        copyNotification.classList.add('show');

        setTimeout(() => {
            copyNotification.classList.remove('show');
        }, 2000);
    }

    // Load sample texts
    function loadSampleTexts() {
        // Sample texts are loaded when the sample buttons are clicked
    }

    // Load sample original text
    function loadSampleOriginal() {
        originalText.value = `Etymology
Main article: Name of Nepal
Before the unification of Nepal, the Kathmandu Valley was known as Nepal.[c] The precise origin of the term Nepāl is uncertain. Nepal appears in ancient Indian literary texts dated as far back as the fourth century AD.[16] An absolute chronology can not be established, as even the oldest texts may contain anonymous contributions dating as late as the early modern period. Academic attempts to provide a plausible theory are hindered by the lack of a complete picture of history and insufficient understanding of linguistics or relevant Indo-European and Tibeto-Burman languages.[17]
According to Hindu mythology, Nepal derives its name from an ancient Hindu sage called Ne, referred to variously as Ne Muni or Nemi. According to Pashupati Purāna, as a place protected by Ne, the country in the heart of the Himalayas came to be known as Nepāl.[18][19][d]`;
    }

    // Load sample modified text
    function loadSampleModified() {
        modifiedText.value = `Etymolpal
Before the unification of Nepal, the Kathmandu Valley was known as Nepal.[c] The precise origin of the term Nepāl is uncertain. Nepal appears in ancient Indian literary texts dated as far back as the fourth century AD.[16] An absolute chronology can not be established, as even the oldest texts may contain anonymous contributions dating as late as the early modern period. Academic attempts to provide a plausible theory are hindered by the lack of a complete picture of histo
According to Hindu mythology, Nepal derives its name from an ancient Hindu sage called Ne, referred to variously as Ne Muni or Nemi. According to Pashupati Purāna, as a place protected by Ne, the country in the heart of the Himalayas came to be known as Nepāl.[18][19][d]`;
    }

    // Compare texts
    function compareTexts() {
        const original = originalText.value;
        const modified = modifiedText.value;

        if (!original && !modified) {
            alert('Please enter text in both fields');
            return;
        }

        // Get selected options
        const viewMode = document.querySelector('input[name="view-mode"]:checked').value;

        // Generate diff
        const diff = diffWords(original, modified);

        // Calculate statistics
        calculateAndDisplayStats(diff, original, modified);

        // Display diff based on view mode
        if (viewMode === 'side-by-side') {
            displaySideBySideDiff(diff);
        } else {
            displayInlineDiff(diff);
        }

        // Scroll to the differences section
        scrollToDifferences();
    }

    // Scroll to differences section
    function scrollToDifferences() {
        // Get the statistics element
        const diffStats = document.getElementById('diff-stats');

        // Calculate position to scroll to (just above the statistics section)
        const offset = 20; // Offset in pixels to ensure visibility
        const statsPosition = diffStats.getBoundingClientRect().top + window.pageYOffset - offset;

        // Scroll to the position with smooth behavior
        window.scrollTo({
            top: statsPosition,
            behavior: 'smooth'
        });
    }

    // Calculate and display statistics
    function calculateAndDisplayStats(diff, original, modified) {
        // Count actual words (not spaces or punctuation)
        const wordRegex = /\b\w+\b/g;
        const originalWords = original.match(wordRegex) || [];
        const modifiedWords = modified.match(wordRegex) || [];

        // Count removed, added, and unchanged words
        const removedWords = diff.oldResult.filter(item =>
            item.type === 'removed' && item.word.match(/\b\w+\b/)
        ).length;

        const addedWords = diff.newResult.filter(item =>
            item.type === 'added' && item.word.match(/\b\w+\b/)
        ).length;

        const unchangedWords = originalWords.length - removedWords;

        // Update statistics display
        totalWordsElement.textContent = originalWords.length;
        addedWordsElement.textContent = addedWords;
        removedWordsElement.textContent = removedWords;
        unchangedWordsElement.textContent = unchangedWords;

        // Show statistics
        diffStats.classList.remove('hidden');
    }

    // Diff words function
    function diffWords(oldText, newText) {
        const oldWords = oldText.split(/(\s+)/).filter(token => token.length > 0);
        const newWords = newText.split(/(\s+)/).filter(token => token.length > 0);
        const m = oldWords.length, n = newWords.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = m - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                if (oldWords[i] === newWords[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
                else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }

        let i = 0, j = 0;
        const oldResult = [];
        const newResult = [];

        while (i < m && j < n) {
            if (oldWords[i] === newWords[j]) {
                oldResult.push({ word: oldWords[i], type: 'common' });
                newResult.push({ word: newWords[j], type: 'common' });
                i++; j++;
            } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                oldResult.push({ word: oldWords[i], type: 'removed' });
                i++;
            } else {
                newResult.push({ word: newWords[j], type: 'added' });
                j++;
            }
        }

        while (i < m) oldResult.push({ word: oldWords[i++], type: 'removed' });
        while (j < n) newResult.push({ word: newWords[j++], type: 'added' });

        return { oldResult, newResult };
    }

    // Display side by side diff
    function displaySideBySideDiff(diff) {
        // Create side by side container
        const container = document.createElement('div');
        container.className = 'diff-side-by-side';

        // Create columns
        const leftColumn = document.createElement('div');
        leftColumn.className = 'diff-column';

        const rightColumn = document.createElement('div');
        rightColumn.className = 'diff-column';

        // Render the diffs
        renderDiff(diff.oldResult, leftColumn, 'removed');
        renderDiff(diff.newResult, rightColumn, 'added');

        // Add columns to container
        container.appendChild(leftColumn);
        container.appendChild(rightColumn);

        // Clear output and add container
        diffOutput.innerHTML = '';
        diffOutput.appendChild(container);
    }

    // Display inline diff
    function displayInlineDiff(diff) {
        // Create container
        const container = document.createElement('div');
        container.className = 'diff-inline';

        // Combine results for inline view
        const combinedHtml = [];
        let oldIndex = 0;
        let newIndex = 0;

        while (oldIndex < diff.oldResult.length || newIndex < diff.newResult.length) {
            // Add removed content first
            while (oldIndex < diff.oldResult.length && diff.oldResult[oldIndex].type === 'removed') {
                combinedHtml.push(`<span class="diff-removed">${diff.oldResult[oldIndex].word}</span>`);
                oldIndex++;
            }

            // Add added content
            while (newIndex < diff.newResult.length && diff.newResult[newIndex].type === 'added') {
                combinedHtml.push(`<span class="diff-added">${diff.newResult[newIndex].word}</span>`);
                newIndex++;
            }

            // Add common content
            if (oldIndex < diff.oldResult.length && newIndex < diff.newResult.length &&
                diff.oldResult[oldIndex].type === 'common' && diff.newResult[newIndex].type === 'common') {
                combinedHtml.push(diff.oldResult[oldIndex].word);
                oldIndex++;
                newIndex++;
            }
        }

        // Set the HTML
        container.innerHTML = combinedHtml.join('');

        // Clear output and add container
        diffOutput.innerHTML = '';
        diffOutput.appendChild(container);
    }

    // Render diff
    function renderDiff(diffArray, container, highlightType) {
        let html = '';

        diffArray.forEach(item => {
            if (item.type === highlightType) {
                html += `<span class="diff-${highlightType}">${item.word}</span>`;
            } else if (item.type === 'common') {
                html += item.word;
            }
        });

        container.innerHTML = html;
    }

    // Swap texts
    function swapTexts() {
        const temp = originalText.value;
        originalText.value = modifiedText.value;
        modifiedText.value = temp;
    }

    // Reset texts
    function resetTexts() {
        originalText.value = '';
        modifiedText.value = '';
        diffOutput.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exchange-alt"></i>
                <p>Click "Compare" to see the differences</p>
            </div>
        `;

        // Hide statistics
        diffStats.classList.add('hidden');

        // Reset statistics values
        totalWordsElement.textContent = '0';
        addedWordsElement.textContent = '0';
        removedWordsElement.textContent = '0';
        unchangedWordsElement.textContent = '0';
    }



    // Download diff as text
    function downloadDiffAsText() {
        if (diffOutput.querySelector('.empty-state')) {
            alert('Please compare texts first');
            return;
        }

        // Get the current diff data
        const currentDiff = getCurrentDiffData();

        // Create formatted text content
        const textContent = formatDiffForDownload(currentDiff);

        // Create and download the file
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text-differences.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Download diff as PDF
    function downloadDiffAsPdf() {
        if (diffOutput.querySelector('.empty-state')) {
            alert('Please compare texts first');
            return;
        }

        // Get the current diff data
        const currentDiff = getCurrentDiffData();

        // Create formatted text content
        const textContent = formatDiffForDownload(currentDiff);

        // Create PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text('Text Difference Report', 20, 20);

        // Add statistics
        doc.setFontSize(12);
        doc.text(`Total Words: ${totalWordsElement.textContent}`, 20, 30);
        doc.text(`Words Added: ${addedWordsElement.textContent}`, 20, 40);
        doc.text(`Words Removed: ${removedWordsElement.textContent}`, 20, 50);
        doc.text(`Unchanged Words: ${unchangedWordsElement.textContent}`, 20, 60);

        // Add diff content
        doc.setFontSize(10);
        const lines = textContent.split('\n');
        let y = 80;

        lines.forEach(line => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(line, 20, y);
            y += 7;
        });

        // Save the PDF
        doc.save('text-differences.pdf');
    }

    // Get current diff data
    function getCurrentDiffData() {
        // This function extracts the current diff data from the UI
        // The implementation depends on how the diff is stored in your application
        return {
            original: originalText.value,
            modified: modifiedText.value,
            diff: diffWords(originalText.value, modifiedText.value)
        };
    }

    // Format diff for download
    function formatDiffForDownload(diffData) {
        let content = "TEXT DIFFERENCE REPORT\n";
        content += "======================\n\n";

        // Add statistics
        content += `Total Words: ${totalWordsElement.textContent}\n`;
        content += `Words Added: ${addedWordsElement.textContent}\n`;
        content += `Words Removed: ${removedWordsElement.textContent}\n`;
        content += `Unchanged Words: ${unchangedWordsElement.textContent}\n\n`;

        // Add original text section
        content += "ORIGINAL TEXT:\n";
        content += "-------------\n";
        content += diffData.original + "\n\n";

        // Add modified text section
        content += "MODIFIED TEXT:\n";
        content += "-------------\n";
        content += diffData.modified + "\n\n";

        // Add differences section
        content += "DIFFERENCES:\n";
        content += "-----------\n";

        // Add removed words
        content += "Removed Words: ";
        diffData.diff.oldResult.forEach(item => {
            if (item.type === 'removed') {
                content += `"${item.word}" `;
            }
        });
        content += "\n\n";

        // Add added words
        content += "Added Words: ";
        diffData.diff.newResult.forEach(item => {
            if (item.type === 'added') {
                content += `"${item.word}" `;
            }
        });
        content += "\n";

        return content;
    }

    // Initialize the application
    init();
});
