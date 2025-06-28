/**
 * Demo Projects Page JavaScript
 * Simulates project creation and management for demo purposes
 */

// Demo state and project types must be global for all functions
let demoState = {
    currentStep: 1,
    selectedType: 'flask', // Preseleccionar Flask por defecto
    projectName: 'E-Commerce Dashboard', // Nombre preestablecido
    outputDir: './generated-projects',
    isCreating: false
};

let projectTypes = [
    {
        id: 'flask',
        name: 'Flask API',
        icon: 'fab fa-python',
        description: 'Python web framework for building RESTful APIs and web applications',
        features: [
            'Complete Flask application structure',
            'RESTful API endpoints',
            'Database models and migrations',
            'Authentication system',
            'Docker configuration',
            'CI/CD pipeline setup',
            'Testing framework',
            'Documentation templates'
        ]
    },
    {
        id: 'django',
        name: 'Django App',
        icon: 'fab fa-python',
        description: 'Full-stack Python framework with admin panel and ORM',
        features: [
            'Django project structure',
            'Admin interface',
            'User authentication',
            'Database models',
            'URL routing',
            'Template system',
            'Static files handling',
            'Deployment configuration'
        ]
    },
    {
        id: 'react',
        name: 'React App',
        icon: 'fab fa-react',
        description: 'Modern frontend application with TypeScript support',
        features: [
            'React with TypeScript',
            'Modern build tools (Vite)',
            'Component library setup',
            'Routing configuration',
            'State management',
            'Testing utilities',
            'ESLint and Prettier',
            'Deployment scripts'
        ]
    },
    {
        id: 'nodejs',
        name: 'Node.js API',
        icon: 'fab fa-node-js',
        description: 'Express-based backend API with TypeScript',
        features: [
            'Express.js server',
            'TypeScript configuration',
            'Database integration',
            'Authentication middleware',
            'API documentation',
            'Error handling',
            'Logging system',
            'Docker support'
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeProjectTypes();
    setupEventListeners();
    updateFormValidation();
    updateStats();
});

function initializeProjectTypes() {
    const container = document.getElementById('projectTypesContainer');
    if (!container) return;

    container.innerHTML = '';

    projectTypes.forEach(type => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6';
        col.innerHTML = `
            <div class="project-type-card" data-type="${type.id}">
                <div class="project-type-icon">
                    <i class="${type.icon}"></i>
                </div>
                <div class="project-type-name">${type.name}</div>
                <div class="project-type-description">
                    ${type.description}
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function setupEventListeners() {
    // Project type selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.project-type-card')) {
            selectProjectType(e.target.closest('.project-type-card'));
        }
    });

    // Wizard navigation
    const nextBtn = document.getElementById('nextStepBtn');
    const prevBtn = document.getElementById('prevStepBtn');
    const createBtn = document.getElementById('createProjectBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevStep);
    }
    if (createBtn) {
        createBtn.addEventListener('click', createProject);
    }

    // Form inputs
    const projectNameInput = document.getElementById('projectName');
    const outputDirInput = document.getElementById('outputDir');

    if (projectNameInput) {
        projectNameInput.addEventListener('input', function() {
            demoState.projectName = this.value;
            updateProjectPreview();
            updateFormValidation();
        });
    }

    if (outputDirInput) {
        outputDirInput.addEventListener('input', function() {
            demoState.outputDir = this.value;
            updateProjectPreview();
            updateFormValidation();
        });
    }
}

function selectProjectType(card) {
    // Remove previous selection
    document.querySelectorAll('.project-type-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Add selection
    card.classList.add('selected');
    
    const typeId = card.dataset.type;
    demoState.selectedType = typeId;
    
    // Update preview
    updateProjectPreview();
    updateFormValidation();
    
    showNotification(`Selected ${getProjectType(typeId).name} template`, 'success');
}

function nextStep() {
    if (demoState.currentStep === 1 && demoState.selectedType) {
        demoState.currentStep = 2;
        showStep(2);
        updateFormValidation();
    }
}

function prevStep() {
    if (demoState.currentStep === 2) {
        demoState.currentStep = 1;
        showStep(1);
        updateFormValidation();
    }
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }

    // Update navigation buttons
    const nextBtn = document.getElementById('nextStepBtn');
    const prevBtn = document.getElementById('prevStepBtn');
    const createBtn = document.getElementById('createProjectBtn');

    if (stepNumber === 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (createBtn) createBtn.style.display = 'none';
    } else if (stepNumber === 2) {
        if (prevBtn) prevBtn.style.display = 'inline-block';
        if (nextBtn) nextBtn.style.display = 'none';
        if (createBtn) createBtn.style.display = 'inline-block';
    }
}

function updateProjectPreview() {
    const preview = document.getElementById('projectPreview');
    if (!preview || !demoState.selectedType) return;

    const type = getProjectType(demoState.selectedType);
    if (!type) return;

    // Show preview
    preview.style.display = 'block';

    // Update preview content
    const nameElement = document.getElementById('previewName');
    const pathElement = document.getElementById('previewPath');
    const iconElement = document.getElementById('previewIcon');
    const featuresElement = document.getElementById('previewFeatures');

    if (nameElement) {
        nameElement.textContent = demoState.projectName || 'My Project';
    }

    if (pathElement) {
        const projectSlug = (demoState.projectName || 'my-project')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        pathElement.textContent = `${demoState.outputDir}/${projectSlug}/`;
    }

    if (iconElement) {
        iconElement.innerHTML = `<i class="${type.icon}"></i>`;
    }

    if (featuresElement) {
        featuresElement.innerHTML = type.features
            .map(feature => `<li>${feature}</li>`)
            .join('');
    }
}

function updateFormValidation() {
    const nextBtn = document.getElementById('nextStepBtn');
    const createBtn = document.getElementById('createProjectBtn');

    if (demoState.currentStep === 1) {
        if (nextBtn) {
            nextBtn.disabled = !demoState.selectedType;
        }
    } else if (demoState.currentStep === 2) {
        const isValid = demoState.selectedType && 
                       demoState.projectName.trim().length > 0 && 
                       demoState.outputDir.trim().length > 0;
        
        if (createBtn) {
            createBtn.disabled = !isValid || demoState.isCreating;
        }
    }
}

function createProject() {
    if (demoState.isCreating) return;

    demoState.isCreating = true;
    
    // Show creation progress
    showCreationProgress();
    
    // Simulate project creation
    simulateProjectCreation();
}

function showCreationProgress() {
    const progressSection = document.getElementById('creationProgressSection');
    if (progressSection) {
        progressSection.style.display = 'block';
    }

    // Scroll to progress section
    progressSection?.scrollIntoView({ behavior: 'smooth' });
}

function simulateProjectCreation() {
    const steps = [
        { id: 'stepValidation', text: 'Parameter validation', delay: 500 },
        { id: 'stepDirectory', text: 'Directory creation', delay: 1000 },
        { id: 'stepFiles', text: 'File generation', delay: 2000 },
        { id: 'stepConfig', text: 'Project configuration', delay: 3000 },
        { id: 'stepPipeline', text: 'Pipeline configuration', delay: 4000 }
    ];

    const logs = document.getElementById('projectCreationLogs');
    const progressBar = document.getElementById('creationProgressBar');
    const progressText = document.getElementById('progressText');
    const progressPercentage = document.getElementById('progressPercentage');
    
    const logMessages = [
        '[INFO] Starting project creation...',
        '[INFO] Validating parameters...',
        '[SUCCESS] Parameters validated successfully',
        '[INFO] Creating project directory...',
        '[SUCCESS] Directory created: ./generated-projects/my-project/',
        '[INFO] Generating project files...',
        '[INFO] Installing dependencies...',
        '[SUCCESS] Dependencies installed',
        '[INFO] Configuring project settings...',
        '[SUCCESS] Project configuration completed',
        '[INFO] Setting up CI/CD pipeline...',
        '[SUCCESS] Pipeline configuration created',
        '[SUCCESS] Project created successfully!'
    ];

    // Clear logs and show container
    if (logs) {
        logs.innerHTML = '<div class="log-entry">[INFO] Initializing project creation...</div>';
    }

    // Initialize progress bar
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    if (progressText) {
        progressText.textContent = 'Starting creation...';
    }
    if (progressPercentage) {
        progressPercentage.textContent = '0%';
    }

    // Animate progress bar
    animateProgressBar(progressBar, progressText, progressPercentage, steps);

    // Animate steps
    steps.forEach((step, index) => {
        setTimeout(() => {
            // Complete previous steps
            for (let i = 0; i <= index; i++) {
                const stepElement = document.getElementById(steps[i].id);
                if (stepElement) {
                    stepElement.classList.add('completed');
                    const icon = stepElement.querySelector('.step-icon');
                    if (icon) {
                        icon.className = 'fas fa-check-circle step-icon';
                    }
                }
            }

            // Add log messages
            if (logs && logMessages[index * 2]) {
                logs.innerHTML += `<div class="log-entry">${logMessages[index * 2]}</div>`;
                if (logMessages[index * 2 + 1]) {
                    setTimeout(() => {
                        logs.innerHTML += `<div class="log-entry">${logMessages[index * 2 + 1]}</div>`;
                        logs.scrollTop = logs.scrollHeight;
                    }, 300);
                }
                logs.scrollTop = logs.scrollHeight;
            }

        }, step.delay);
    });

    // Show success after all steps
    setTimeout(() => {
        // Final progress update
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        if (progressText) {
            progressText.textContent = 'Project created successfully!';
        }
        if (progressPercentage) {
            progressPercentage.textContent = '100%';
        }
        
        // Show completion message
        showProjectCompletion();
    }, 5000);
}

function animateProgressBar(progressBar, progressText, progressPercentage, steps) {
    if (!progressBar || !progressText || !progressPercentage) return;
    
    const totalSteps = steps.length;
    const totalDuration = 5000; // 5 seconds total
    const stepDuration = totalDuration / totalSteps;
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            const progress = ((index + 1) / totalSteps) * 100;
            
            // Animate progress bar width
            progressBar.style.width = `${progress}%`;
            
            // Update progress text
            progressText.textContent = step.text;
            
            // Update percentage
            progressPercentage.textContent = `${Math.round(progress)}%`;
            
        }, step.delay);
    });
}

function showProjectCompletion() {
    const projectName = demoState.projectName || 'My Project';
    const projectType = getProjectType(demoState.selectedType);
    
    // Show completion notification
    showNotification(`Project "${projectName}" created successfully!`, 'success');
    
    // Reset creation state
    demoState.isCreating = false;
    
    // Optional: scroll back to form for creating another project
    setTimeout(() => {
        const formSection = document.getElementById('step1');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 2000);
}

function showProjectSuccess() {
    const successSection = document.getElementById('successSection');
    if (successSection) {
        successSection.style.display = 'block';
        successSection.scrollIntoView({ behavior: 'smooth' });
    }

    const projectName = demoState.projectName || 'My Project';
    const successTitle = document.querySelector('#successSection .success-title');
    const successDescription = document.querySelector('#successSection .success-description');

    if (successTitle) {
        successTitle.textContent = `Project "${projectName}" created successfully!`;
    }

    if (successDescription) {
        successDescription.textContent = 
            `Your ${getProjectType(demoState.selectedType)?.name || 'project'} has been generated and is ready for development.`;
    }

    showNotification('Project created successfully!', 'success');
    
    // Reset state
    demoState.isCreating = false;
}

function getProjectType(typeId) {
    return projectTypes.find(type => type.id === typeId);
}

function updateStats() {
    // Update template count
    const templatesElement = document.getElementById('availableTemplates');
    if (templatesElement) {
        templatesElement.textContent = projectTypes.length.toString();
    }

    // Simulate projects created count
    const createdElement = document.getElementById('projectsCreated');
    if (createdElement) {
        // Animate to a demo number
        animateNumber(createdElement, 48);
    }

    // Update connection status
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.classList.add('connected');
        statusElement.innerHTML = '<i class="fas fa-wifi"></i> <span>Connected</span>';
    }
}

function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'danger': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Initialize demo state
window.demoState = demoState;
window.projectTypes = projectTypes;
