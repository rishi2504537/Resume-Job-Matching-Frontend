// Data storage (in-memory, replace with backend API later)
let jobData = [];

/**
 * Show the selected page and hide others
 * @param {string} pageName - The ID of the page to show
 */
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
}

/**
 * Switch between tabs in recruiter portal
 * @param {string} tabName - The ID of the tab to show
 * @param {event} event - The click event
 */
function switchTab(tabName, event) {
    event.preventDefault();
    const tabContents = document.querySelectorAll('.tab-content');
    const tabs = document.querySelectorAll('.recruiter-tab');
    
    tabContents.forEach(tab => tab.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'posted-jobs') {
        displayPostedJobs();
    }
}

/**
 * Update and display the file name when user selects a file
 * @param {string} inputId - The ID of the file input
 * @param {string} displayId - The ID of the element to display the file name
 */
function updateFileName(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (input.files.length > 0) {
        display.textContent = '✓ ' + input.files[0].name;
        display.style.display = 'block';
    }
}

/**
 * Handle employee form submission
 * @param {event} event - The form submit event
 */
function handleEmployeeSubmit(event) {
    event.preventDefault();
    
    const resumeFile = document.getElementById('resume').files[0];
    if (resumeFile) {
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (resumeFile.size > maxSize) {
            alert('File size exceeds 5MB limit!');
            return;
        }

        const formData = {
            resume: resumeFile.name,
            resumeSize: resumeFile.size,
            submittedAt: new Date().toLocaleString()
        };

        // Show success message
        const successMsg = document.getElementById('employeeSuccessMsg');
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 4000);

        // Reset form
        document.getElementById('employeeForm').reset();
        document.getElementById('resumeFileName').style.display = 'none';
        
        // Log data (replace with API call later)
        console.log('Employee Resume Data:', formData);
        
        // TODO: Send to backend API
        // Example: await fetch('/api/employees/upload-resume', {
        //     method: 'POST',
        //     body: formData
        // });
    }
}

/**
 * Handle recruiter form submission
 * @param {event} event - The form submit event
 */
function handleRecruiterSubmit(event) {
    event.preventDefault();
    
    const jobDescFile = document.getElementById('jobDescription').files[0];
    if (jobDescFile) {
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (jobDescFile.size > maxSize) {
            alert('File size exceeds 10MB limit!');
            return;
        }

        const formData = {
            jobDescription: jobDescFile.name,
            jobDescSize: jobDescFile.size,
            postedAt: new Date().toLocaleString(),
            id: jobData.length + 1
        };

        jobData.push(formData);
        
        // Show success message
        const successMsg = document.getElementById('recruiterSuccessMsg');
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 4000);

        // Reset form
        document.getElementById('recruiterForm').reset();
        document.getElementById('jobDescFileName').style.display = 'none';
        
        // Log data (replace with API call later)
        console.log('Job Data:', jobData);
        
        // TODO: Send to backend API
        // Example: await fetch('/api/recruiters/post-job', {
        //     method: 'POST',
        //     body: formData
        // });
    }
}

/**
 * Display all posted jobs in the "Posted Jobs" tab
 */
function displayPostedJobs() {
    const jobsList = document.getElementById('jobsList');
    
    if (jobData.length === 0) {
        jobsList.innerHTML = '<div class="no-jobs">📭 No jobs posted yet. Start by posting a job opening!</div>';
        return;
    }

    jobsList.innerHTML = jobData.map((job, index) => `
        <div class="job-card">
            <h3>Job #${job.id}</h3>
            <p><strong>File Name:</strong> ${job.jobDescription}</p>
            <p><strong>File Size:</strong> ${(job.jobDescSize / 1024).toFixed(2)} KB</p>
            <p><strong>Posted At:</strong> ${job.postedAt}</p>
        </div>
    `).join('');
}

/**
 * Initialize event listeners for drag and drop functionality
 */
function initializeDragAndDrop() {
    const resumeLabel = document.querySelector('label[for="resume"]');
    const jobDescLabel = document.querySelector('label[for="jobDescription"]');

    if (resumeLabel) {
        resumeLabel.addEventListener('dragover', (e) => handleDragOver(e));
        resumeLabel.addEventListener('dragleave', (e) => handleDragLeave(e));
        resumeLabel.addEventListener('drop', (e) => handleDrop(e, 'resume'));
    }

    if (jobDescLabel) {
        jobDescLabel.addEventListener('dragover', (e) => handleDragOver(e));
        jobDescLabel.addEventListener('dragleave', (e) => handleDragLeave(e));
        jobDescLabel.addEventListener('drop', (e) => handleDrop(e, 'jobDescription'));
    }
}

/**
 * Handle drag over event for file upload
 * @param {event} e - The dragover event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.target.style.borderColor = '#1db854';
    e.target.style.background = '#1a1a1a';
    e.target.style.color = '#1db854';
}

/**
 * Handle drag leave event for file upload
 * @param {event} e - The dragleave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.target.style.borderColor = '#404040';
    e.target.style.background = '#282828';
    e.target.style.color = '#b3b3b3';
}

/**
 * Handle drop event for file upload
 * @param {event} e - The drop event
 * @param {string} inputId - The ID of the file input to populate
 */
function handleDrop(e, inputId) {
    e.preventDefault();
    e.target.style.borderColor = '#404040';
    e.target.style.background = '#282828';
    e.target.style.color = '#b3b3b3';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById(inputId).files = files;
        const displayId = inputId === 'resume' ? 'resumeFileName' : 'jobDescFileName';
        updateFileName(inputId, displayId);
    }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    console.log('Resume-Job Matching System initialized!');
});