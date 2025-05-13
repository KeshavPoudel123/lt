// StrawPoll Tool JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Poll Creation
    const pollCreation = document.getElementById('poll-creation');
    const pollQuestion = document.getElementById('poll-question');
    const pollOptions = document.getElementById('poll-options');
    const addOptionBtn = document.getElementById('add-option-btn');
    const multipleChoice = document.getElementById('multiple-choice');
    const requireNames = document.getElementById('require-names');
    const hideResults = document.getElementById('hide-results');
    const endDate = document.getElementById('end-date');
    const createPollBtn = document.getElementById('create-poll-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');
    
    // DOM Elements - Poll Voting
    const pollVoting = document.getElementById('poll-voting');
    const votingQuestion = document.getElementById('voting-question');
    const pollIdDisplay = document.getElementById('poll-id-display');
    const pollEndTime = document.getElementById('poll-end-time');
    const nameInputContainer = document.getElementById('name-input-container');
    const voterName = document.getElementById('voter-name');
    const votingOptions = document.getElementById('voting-options');
    const submitVoteBtn = document.getElementById('submit-vote-btn');
    const viewResultsBtn = document.getElementById('view-results-btn');
    const backToCreateBtn = document.getElementById('back-to-create-btn');
    
    // DOM Elements - Poll Results
    const pollResults = document.getElementById('poll-results');
    const resultsQuestion = document.getElementById('results-question');
    const resultsPollId = document.getElementById('results-poll-id');
    const resultsEndTime = document.getElementById('results-end-time');
    const totalVotes = document.getElementById('total-votes');
    const pollStatus = document.getElementById('poll-status');
    const resultsChart = document.getElementById('results-chart');
    const votersListContainer = document.getElementById('voters-list-container');
    const votersList = document.getElementById('voters-list');
    const shareLink = document.getElementById('share-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareTwitter = document.getElementById('share-twitter');
    const shareFacebook = document.getElementById('share-facebook');
    const shareEmail = document.getElementById('share-email');
    const backToVoteBtn = document.getElementById('back-to-vote-btn');
    const createNewPollBtn = document.getElementById('create-new-poll-btn');
    
    // DOM Elements - My Polls
    const myPollsSection = document.getElementById('my-polls-section');
    const myPollsList = document.getElementById('my-polls-list');
    const emptyPollsMessage = document.getElementById('empty-polls-message');
    
    // Settings
    const savePollsLocally = document.getElementById('save-polls-locally');
    const showVotersNames = document.getElementById('show-voters-names');
    
    // Chart instance
    let resultsChartInstance = null;
    
    // Current poll data
    let currentPoll = null;
    
    // Initialize
    loadMyPolls();
    checkUrlForPollId();
    
    // Event Listeners - Poll Creation
    addOptionBtn.addEventListener('click', addOption);
    createPollBtn.addEventListener('click', createPoll);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Add event delegation for remove option buttons
    pollOptions.addEventListener('click', function(e) {
        if (e.target.closest('.remove-option')) {
            removeOption(e.target.closest('.option-input'));
        }
    });
    
    // Event Listeners - Poll Voting
    submitVoteBtn.addEventListener('click', submitVote);
    viewResultsBtn.addEventListener('click', viewResults);
    backToCreateBtn.addEventListener('click', backToCreate);
    
    // Event Listeners - Poll Results
    copyLinkBtn.addEventListener('click', copyPollLink);
    shareTwitter.addEventListener('click', shareOnTwitter);
    shareFacebook.addEventListener('click', shareOnFacebook);
    shareEmail.addEventListener('click', shareViaEmail);
    backToVoteBtn.addEventListener('click', backToVote);
    createNewPollBtn.addEventListener('click', backToCreate);
    
    // Settings event listeners
    savePollsLocally.addEventListener('change', updateSettings);
    showVotersNames.addEventListener('change', updateSettings);
    
    // Functions - Poll Creation
    function addOption() {
        const optionCount = pollOptions.children.length + 1;
        const optionInput = document.createElement('div');
        optionInput.className = 'option-input';
        optionInput.innerHTML = `
            <input type="text" class="form-control option-field" placeholder="Option ${optionCount}">
            <button type="button" class="btn btn-icon remove-option" title="Remove Option">
                <i class="fas fa-times"></i>
            </button>
        `;
        pollOptions.appendChild(optionInput);
        
        // Enable all remove buttons if we have more than 2 options
        if (pollOptions.children.length > 2) {
            enableRemoveButtons();
        }
        
        // Focus the new input
        optionInput.querySelector('input').focus();
    }
    
    function removeOption(optionElement) {
        pollOptions.removeChild(optionElement);
        
        // Update placeholders
        const optionInputs = pollOptions.querySelectorAll('.option-input');
        optionInputs.forEach((input, index) => {
            input.querySelector('input').placeholder = `Option ${index + 1}`;
        });
        
        // Disable remove buttons if we have only 2 options
        if (pollOptions.children.length <= 2) {
            disableRemoveButtons();
        }
    }
    
    function enableRemoveButtons() {
        const removeButtons = pollOptions.querySelectorAll('.remove-option');
        removeButtons.forEach(button => {
            button.disabled = false;
        });
    }
    
    function disableRemoveButtons() {
        const removeButtons = pollOptions.querySelectorAll('.remove-option');
        removeButtons.forEach(button => {
            button.disabled = true;
        });
    }
    
    function createPoll() {
        // Validate inputs
        if (!pollQuestion.value.trim()) {
            showNotification('Please enter a question', 'warning');
            pollQuestion.focus();
            return;
        }
        
        // Get options
        const optionInputs = pollOptions.querySelectorAll('.option-field');
        const options = Array.from(optionInputs).map(input => input.value.trim());
        
        // Validate options
        if (options.some(option => !option)) {
            showNotification('Please fill in all options', 'warning');
            return;
        }
        
        if (new Set(options).size !== options.length) {
            showNotification('Options must be unique', 'warning');
            return;
        }
        
        // Create poll object
        const pollId = generatePollId();
        const poll = {
            id: pollId,
            question: pollQuestion.value.trim(),
            options: options,
            settings: {
                multipleChoice: multipleChoice.checked,
                requireNames: requireNames.checked,
                hideResults: hideResults.checked,
                endDate: endDate.value ? new Date(endDate.value).toISOString() : null
            },
            votes: [],
            created: new Date().toISOString()
        };
        
        // Save poll
        savePoll(poll);
        
        // Set current poll
        currentPoll = poll;
        
        // Show voting section
        showVotingSection(poll);
        
        // Update URL with poll ID
        updateUrlWithPollId(pollId);
        
        showNotification('Poll created successfully!', 'success');
    }
    
    function resetForm() {
        pollQuestion.value = '';
        
        // Reset options to default (2 empty options)
        pollOptions.innerHTML = `
            <div class="option-input">
                <input type="text" class="form-control option-field" placeholder="Option 1">
                <button type="button" class="btn btn-icon remove-option" title="Remove Option" disabled>
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="option-input">
                <input type="text" class="form-control option-field" placeholder="Option 2">
                <button type="button" class="btn btn-icon remove-option" title="Remove Option" disabled>
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Reset settings
        multipleChoice.checked = false;
        requireNames.checked = false;
        hideResults.checked = false;
        endDate.value = '';
        
        // Focus question input
        pollQuestion.focus();
    }
    
    // Functions - Poll Voting
    function showVotingSection(poll) {
        // Hide other sections
        pollCreation.classList.add('hidden');
        pollResults.classList.add('hidden');
        myPollsSection.classList.add('hidden');
        
        // Update voting section with poll data
        votingQuestion.textContent = poll.question;
        pollIdDisplay.textContent = `Poll ID: ${poll.id}`;
        
        if (poll.settings.endDate) {
            const endDateTime = new Date(poll.settings.endDate);
            pollEndTime.textContent = `Ends: ${formatDate(endDateTime)}`;
        } else {
            pollEndTime.textContent = '';
        }
        
        // Show/hide name input based on settings
        if (poll.settings.requireNames) {
            nameInputContainer.classList.remove('hidden');
        } else {
            nameInputContainer.classList.add('hidden');
        }
        
        // Create voting options
        votingOptions.innerHTML = '';
        poll.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'voting-option';
            
            const inputType = poll.settings.multipleChoice ? 'checkbox' : 'radio';
            const inputName = poll.settings.multipleChoice ? `option-${index}` : 'poll-option';
            
            optionElement.innerHTML = `
                <input type="${inputType}" id="option-${index}" name="${inputName}" value="${index}">
                <label for="option-${index}">${option}</label>
            `;
            
            votingOptions.appendChild(optionElement);
        });
        
        // Show voting section
        pollVoting.classList.remove('hidden');
        
        // Check if poll has ended
        if (isPollEnded(poll)) {
            submitVoteBtn.disabled = true;
            showNotification('This poll has ended', 'info');
        } else {
            submitVoteBtn.disabled = false;
        }
    }
    
    function submitVote() {
        if (!currentPoll) return;
        
        // Check if poll has ended
        if (isPollEnded(currentPoll)) {
            showNotification('This poll has ended', 'warning');
            submitVoteBtn.disabled = true;
            return;
        }
        
        // Validate name if required
        if (currentPoll.settings.requireNames && !voterName.value.trim()) {
            showNotification('Please enter your name', 'warning');
            voterName.focus();
            return;
        }
        
        // Get selected options
        let selectedOptions = [];
        if (currentPoll.settings.multipleChoice) {
            // For checkboxes
            const checkboxes = votingOptions.querySelectorAll('input[type="checkbox"]:checked');
            selectedOptions = Array.from(checkboxes).map(cb => parseInt(cb.value));
        } else {
            // For radio buttons
            const selectedRadio = votingOptions.querySelector('input[type="radio"]:checked');
            if (selectedRadio) {
                selectedOptions = [parseInt(selectedRadio.value)];
            }
        }
        
        // Validate selection
        if (selectedOptions.length === 0) {
            showNotification('Please select at least one option', 'warning');
            return;
        }
        
        // Create vote object
        const vote = {
            options: selectedOptions,
            name: currentPoll.settings.requireNames ? voterName.value.trim() : 'Anonymous',
            timestamp: new Date().toISOString()
        };
        
        // Add vote to poll
        currentPoll.votes.push(vote);
        
        // Save updated poll
        savePoll(currentPoll);
        
        // Show results if not hidden
        if (!currentPoll.settings.hideResults) {
            viewResults();
        } else {
            showNotification('Vote submitted successfully! Results are hidden until the poll ends.', 'success');
        }
    }
    
    function viewResults() {
        if (!currentPoll) return;
        
        // Check if results should be hidden
        if (currentPoll.settings.hideResults && !isPollEnded(currentPoll)) {
            showNotification('Results are hidden until the poll ends', 'info');
            return;
        }
        
        // Hide other sections
        pollCreation.classList.add('hidden');
        pollVoting.classList.add('hidden');
        myPollsSection.classList.add('hidden');
        
        // Update results section with poll data
        resultsQuestion.textContent = currentPoll.question;
        resultsPollId.textContent = `Poll ID: ${currentPoll.id}`;
        
        if (currentPoll.settings.endDate) {
            const endDateTime = new Date(currentPoll.settings.endDate);
            resultsEndTime.textContent = `Ends: ${formatDate(endDateTime)}`;
        } else {
            resultsEndTime.textContent = '';
        }
        
        // Update total votes
        totalVotes.textContent = currentPoll.votes.length;
        
        // Update poll status
        if (isPollEnded(currentPoll)) {
            pollStatus.textContent = 'Ended';
            pollStatus.style.color = 'var(--medium-text)';
        } else {
            pollStatus.textContent = 'Active';
            pollStatus.style.color = 'var(--success-color)';
        }
        
        // Create results chart
        createResultsChart();
        
        // Show/hide voters list based on settings
        if (showVotersNames.checked && currentPoll.settings.requireNames) {
            votersListContainer.classList.remove('hidden');
            populateVotersList();
        } else {
            votersListContainer.classList.add('hidden');
        }
        
        // Update share link
        const pollUrl = window.location.origin + window.location.pathname + '?poll=' + currentPoll.id;
        shareLink.value = pollUrl;
        
        // Show results section
        pollResults.classList.remove('hidden');
    }
    
    function createResultsChart() {
        // Calculate vote counts for each option
        const voteCounts = currentPoll.options.map(() => 0);
        
        currentPoll.votes.forEach(vote => {
            vote.options.forEach(optionIndex => {
                voteCounts[optionIndex]++;
            });
        });
        
        // Destroy previous chart if it exists
        if (resultsChartInstance) {
            resultsChartInstance.destroy();
        }
        
        // Create canvas element
        resultsChart.innerHTML = '<canvas id="results-canvas"></canvas>';
        const canvas = document.getElementById('results-canvas');
        
        // Create chart
        resultsChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: currentPoll.options,
                datasets: [{
                    label: 'Votes',
                    data: voteCounts,
                    backgroundColor: 'rgba(91, 76, 196, 0.7)',
                    borderColor: 'rgba(91, 76, 196, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    function populateVotersList() {
        votersList.innerHTML = '';
        
        if (currentPoll.votes.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.innerHTML = '<p>No votes yet</p>';
            votersList.appendChild(emptyMessage);
            return;
        }
        
        // Sort votes by timestamp (newest first)
        const sortedVotes = [...currentPoll.votes].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        sortedVotes.forEach(vote => {
            const voterItem = document.createElement('div');
            voterItem.className = 'voter-item';
            
            // Get selected options text
            const selectedOptions = vote.options.map(index => currentPoll.options[index]).join(', ');
            
            voterItem.innerHTML = `
                <div class="voter-name">${vote.name}</div>
                <div class="voter-choice">${selectedOptions}</div>
            `;
            
            votersList.appendChild(voterItem);
        });
    }
    
    function backToVote() {
        if (!currentPoll) return;
        
        // Hide results section
        pollResults.classList.add('hidden');
        
        // Show voting section
        showVotingSection(currentPoll);
    }
    
    function backToCreate() {
        // Reset current poll
        currentPoll = null;
        
        // Hide other sections
        pollVoting.classList.add('hidden');
        pollResults.classList.add('hidden');
        myPollsSection.classList.add('hidden');
        
        // Show creation section
        pollCreation.classList.remove('hidden');
        
        // Reset URL
        window.history.pushState({}, document.title, window.location.pathname);
    }
    
    // Functions - Poll Sharing
    function copyPollLink() {
        navigator.clipboard.writeText(shareLink.value)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy link', 'error');
                console.error('Could not copy text: ', err);
            });
    }
    
    function shareOnTwitter() {
        const text = encodeURIComponent(`Vote in my poll: ${currentPoll.question}`);
        const url = encodeURIComponent(shareLink.value);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
    
    function shareOnFacebook() {
        const url = encodeURIComponent(shareLink.value);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
    
    function shareViaEmail() {
        const subject = encodeURIComponent(`Vote in my poll: ${currentPoll.question}`);
        const body = encodeURIComponent(`I created a poll and would like your opinion!\n\n${currentPoll.question}\n\nVote here: ${shareLink.value}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
    
    // Functions - My Polls
    function loadMyPolls() {
        // Get all polls from localStorage
        const allPolls = getAllPolls();
        
        // Sort polls by creation date (newest first)
        const sortedPolls = allPolls.sort((a, b) => 
            new Date(b.created) - new Date(a.created)
        );
        
        // Update UI
        if (sortedPolls.length > 0) {
            emptyPollsMessage.classList.add('hidden');
            myPollsList.innerHTML = '';
            
            sortedPolls.forEach(poll => {
                const pollCard = createPollCard(poll);
                myPollsList.appendChild(pollCard);
            });
        } else {
            emptyPollsMessage.classList.remove('hidden');
            myPollsList.innerHTML = '';
        }
    }
    
    function createPollCard(poll) {
        const isEnded = isPollEnded(poll);
        const totalVotes = poll.votes.length;
        const createdDate = new Date(poll.created);
        
        const pollCard = document.createElement('div');
        pollCard.className = 'poll-card';
        pollCard.setAttribute('data-id', poll.id);
        
        pollCard.innerHTML = `
            <div class="poll-card-header">
                <h3 class="poll-card-title">${poll.question}</h3>
                <span class="poll-card-status ${isEnded ? 'ended' : ''}">${isEnded ? 'Ended' : 'Active'}</span>
            </div>
            <div class="poll-card-info">
                <span>Created: ${formatDate(createdDate)}</span>
                <span>Votes: ${totalVotes}</span>
                <span>Options: ${poll.options.length}</span>
            </div>
            <div class="poll-card-actions">
                <button type="button" class="btn btn-sm btn-primary view-poll-btn">View</button>
                <button type="button" class="btn btn-sm btn-secondary delete-poll-btn">Delete</button>
            </div>
        `;
        
        // Add event listeners
        const viewBtn = pollCard.querySelector('.view-poll-btn');
        const deleteBtn = pollCard.querySelector('.delete-poll-btn');
        
        viewBtn.addEventListener('click', () => {
            loadPoll(poll.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            deletePoll(poll.id);
        });
        
        return pollCard;
    }
    
    // Helper Functions
    function generatePollId() {
        // Generate a random 8-character ID
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    
    function savePoll(poll) {
        if (!savePollsLocally.checked) return;
        
        // Save to localStorage
        localStorage.setItem(`poll_${poll.id}`, JSON.stringify(poll));
        
        // Update my polls list
        loadMyPolls();
    }
    
    function loadPoll(pollId) {
        // Get poll from localStorage
        const pollData = localStorage.getItem(`poll_${pollId}`);
        
        if (pollData) {
            currentPoll = JSON.parse(pollData);
            showVotingSection(currentPoll);
            
            // Update URL with poll ID
            updateUrlWithPollId(pollId);
        } else {
            showNotification('Poll not found', 'error');
        }
    }
    
    function deletePoll(pollId) {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this poll?')) {
            return;
        }
        
        // Remove from localStorage
        localStorage.removeItem(`poll_${pollId}`);
        
        // Update my polls list
        loadMyPolls();
        
        // If current poll is deleted, go back to creation
        if (currentPoll && currentPoll.id === pollId) {
            backToCreate();
        }
        
        showNotification('Poll deleted successfully', 'success');
    }
    
    function getAllPolls() {
        const polls = [];
        
        // Iterate through localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Check if key starts with "poll_"
            if (key.startsWith('poll_')) {
                try {
                    const pollData = JSON.parse(localStorage.getItem(key));
                    polls.push(pollData);
                } catch (e) {
                    console.error('Error parsing poll data:', e);
                }
            }
        }
        
        return polls;
    }
    
    function isPollEnded(poll) {
        if (!poll.settings.endDate) return false;
        
        const endDate = new Date(poll.settings.endDate);
        const now = new Date();
        
        return now > endDate;
    }
    
    function formatDate(date) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function updateUrlWithPollId(pollId) {
        const url = new URL(window.location);
        url.searchParams.set('poll', pollId);
        window.history.pushState({}, '', url);
    }
    
    function checkUrlForPollId() {
        const urlParams = new URLSearchParams(window.location.search);
        const pollId = urlParams.get('poll');
        
        if (pollId) {
            loadPoll(pollId);
        }
    }
    
    function updateSettings() {
        localStorage.setItem('pollSettings', JSON.stringify({
            savePollsLocally: savePollsLocally.checked,
            showVotersNames: showVotersNames.checked
        }));
        
        // Update UI if needed
        if (currentPoll && pollResults.classList.contains('hidden') === false) {
            if (showVotersNames.checked && currentPoll.settings.requireNames) {
                votersListContainer.classList.remove('hidden');
                populateVotersList();
            } else {
                votersListContainer.classList.add('hidden');
            }
        }
    }
    
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pollSettings') || '{}');
        
        if (settings.savePollsLocally !== undefined) {
            savePollsLocally.checked = settings.savePollsLocally;
        }
        
        if (settings.showVotersNames !== undefined) {
            showVotersNames.checked = settings.showVotersNames;
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and type
        notification.innerHTML = `
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        notification.style.backgroundColor = getNotificationColor(type);
        
        // Show notification
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    function getNotificationColor(type) {
        switch (type) {
            case 'success': return 'var(--success-color)';
            case 'error': return 'var(--error-color)';
            case 'warning': return 'var(--warning-color)';
            default: return 'var(--info-color)';
        }
    }
    
    // Load settings on init
    loadSettings();
});
