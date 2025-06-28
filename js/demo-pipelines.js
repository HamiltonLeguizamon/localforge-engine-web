/**
 * Demo Pipelines Page JavaScript
 * Simulates pipeline execution and canvas flow for demo purposes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize pipeline UI
    initializePipelineCanvas();
    setupEventListeners();
    setupMainActionListeners();
    
    // Start demo animations
    startPipelineSimulation();
});

function initializePipelineCanvas() {
    const canvas = document.getElementById('pipelineCanvas');
    if (!canvas) return;

    // Demo: pasos fijos para la visualización - todos empiezan como pending
    const steps = [
        { key: 'setup', label: 'Setup', icon: 'fa-cog', status: 'pending' },
        { key: 'build', label: 'Build', icon: 'fa-hammer', status: 'pending' },
        { key: 'test', label: 'Test', icon: 'fa-vial', status: 'pending' },
        { key: 'deploy', label: 'Deploy', icon: 'fa-rocket', status: 'pending' }
    ];

    createCanvasNodes(canvas, steps);
}

function createCanvasNodes(canvas, steps) {
    // Parámetros visuales optimizados
    const nodeWidth = 120;
    const nodeHeight = 160;
    const connectorWidth = 80;
    const totalWidth = steps.length * nodeWidth + (steps.length - 1) * connectorWidth;

    // Contenedor centrado y responsivo
    const canvasStyle = `
        position: relative; 
        width: 100%; 
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        padding: 20px 0;
    `;
    
    const nodesContainerStyle = `
        position: relative;
        width: ${totalWidth}px;
        height: ${nodeHeight}px;
        display: flex;
        align-items: center;
    `;
    
    let html = `
        <div class="canvas-wrapper" style="${canvasStyle}">
            <div class="nodes-container" style="${nodesContainerStyle}">
    `;

    steps.forEach((step, i) => {
        const left = i * (nodeWidth + connectorWidth);
        const nodeTop = 0; // Centrado vertical manejado por flexbox
        const nodeDelay = i * 100; // Staggered animation delay
        
        html += `
            <div class="pipeline-node animate-in" data-step="${step.key}" data-index="${i}"
                 style="position: absolute; left: ${left}px; top: ${nodeTop}px; animation-delay: ${nodeDelay}ms; cursor: pointer;"
                 onclick="showStepDetail('${step.key}', ${i})">
                <div class="node-circle ${step.status}">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div class="node-label">${step.label}</div>
                <div class="node-status ${step.status}">${getNodeStatusText(step.status)}</div>
                <div class="node-index">${i + 1}</div>
            </div>
        `;
        
        // Conector animado (excepto después del último nodo)
        if (i < steps.length - 1) {
            const connectorLeft = left + nodeWidth;
            const connectorTop = 30; // Centro vertical del nodo
            const isActive = step.status === 'success';
            const connectorClass = isActive ? 'pipeline-connector active' : 'pipeline-connector';
            
            html += `
                <div class="${connectorClass}" 
                     style="position: absolute; 
                            left: ${connectorLeft}px; 
                            top: ${connectorTop}px; 
                            width: ${connectorWidth}px; 
                            height: 8px; 
                            border-radius: 4px;
                            transition: all 0.6s ease;
                            animation-delay: ${nodeDelay + 200}ms;">
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    canvas.innerHTML = html;
    
    // Add enhanced CSS animations
    addCanvasAnimationStyles();
}

function getNodeStatusText(status) {
    const statusTexts = {
        'success': 'Completed',
        'running': 'Running',
        'pending': 'Pending',
        'failure': 'Failed'
    };
    return statusTexts[status] || 'Unknown';
}

function updateCanvasAnimation() {
    // Only re-initialize if not currently executing a pipeline
    const stopButton = document.getElementById('stopButton');
    const isExecuting = stopButton && stopButton.style.display !== 'none';
    
    if (!isExecuting) {
        // Ocultar estado vacío cuando hay contenido
        const emptyState = document.getElementById('canvasEmptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        initializePipelineCanvas();
    }
}

function addCanvasAnimationStyles() {
    if (document.getElementById('canvas-animation-styles')) return;
    
    const animationStyles = `
    <style id="canvas-animation-styles">
        .pipeline-node {
            animation: nodeAppear 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px) scale(0.8);
        }
        
        .pipeline-connector {
            background: linear-gradient(90deg, var(--gray-300, #cbd5e1) 0%, var(--gray-400, #94a3b8) 100%);
            animation: connectorAppear 0.4s ease-out forwards;
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left center;
        }
        
        .pipeline-connector.active {
            background: linear-gradient(90deg, var(--success, #10b981) 0%, var(--primary, #2563eb) 100%);
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        
        .pipeline-connector.active::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
            animation: flowAnimation 2s infinite;
        }
        
        .node-circle.running {
            animation: nodeRunning 2s infinite;
        }
        
        .node-circle.running i {
            animation: spin 1s linear infinite;
        }
        
        @keyframes nodeAppear {
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes connectorAppear {
            to {
                opacity: 1;
                transform: scaleX(1);
            }
        }
        
        @keyframes nodeRunning {
            0%, 100% { 
                box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
            }
            50% { 
                box-shadow: 0 0 0 20px rgba(37, 99, 235, 0);
            }
        }
        
        @keyframes flowAnimation {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .pipeline-node:hover {
            transform: translateY(-5px);
            transition: transform 0.3s ease;
        }
        
        .pipeline-node:hover .node-circle {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }
    </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', animationStyles);
}

function setupEventListeners() {
    // Setup main action listeners
    setupMainActionListeners();
}

// Add event listeners for main action buttons
function setupMainActionListeners() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const projectSelector = document.getElementById('projectSelector');
    const environmentSelector = document.getElementById('environmentSelector');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            simulatePipelineExecution();
        });
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', function() {
            stopPipelineExecution();
        });
    }

    if (projectSelector) {
        projectSelector.addEventListener('change', function() {
            const environmentValue = environmentSelector?.value;
            if (this.value && environmentValue) {
                updatePipelineInfo(this.value, environmentValue);
            }
        });
    }

    if (environmentSelector) {
        environmentSelector.addEventListener('change', function() {
            const projectValue = projectSelector?.value;
            if (this.value && projectValue) {
                updatePipelineInfo(projectValue, this.value);
            }
        });
    }

    // Initialize with default values
    const defaultProject = projectSelector?.value;
    const defaultEnvironment = environmentSelector?.value;
    if (defaultProject && defaultEnvironment) {
        updatePipelineInfo(defaultProject, defaultEnvironment);
    }
}

function runPipeline(pipelineId) {
    // This function is not used in the current demo implementation
    // Individual pipeline execution is handled by simulatePipelineExecution()
}

function showPipelineLogs(pipelineId) {
    const demoLogs = [
        '[INFO] Pipeline started at 2024-01-15 10:30:00',
        '[INFO] Setting up environment...',
        '[INFO] Installing dependencies...',
        '[SUCCESS] Dependencies installed successfully',
        '[INFO] Running tests...',
        '[SUCCESS] All tests passed (24/24)',
        '[INFO] Building application...',
        '[SUCCESS] Build completed successfully',
        '[INFO] Deploying to staging...',
        '[SUCCESS] Deployment completed'
    ];

    const modal = document.getElementById('pipelineModal');
    if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h5>Pipeline Logs: ${pipelineId}</h5>
            <div class="logs-container">
                <pre class="logs-text">${demoLogs.join('\n')}</pre>
            </div>
        `;
        
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

function startPipelineSimulation() {
    // Remove the auto-reset interval - animation only starts when user clicks execute
    // The canvas will remain static until user interaction
}

function updatePipelineStatus(pipelineId, newStatus) {
    // This function is not needed for the demo - individual node updates are handled by updatePipelineNodesStatus
}

function getStatusColor(status) {
    switch(status) {
        case 'success': return 'success';
        case 'running': return 'primary';
        case 'failure': return 'danger';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
}

// Global variables to prevent double animations and resets
let pipelineExecutionInterval = null;
let resetTimeout = null;

function simulatePipelineExecution() {
    // Clear any existing interval first
    if (pipelineExecutionInterval) {
        clearInterval(pipelineExecutionInterval);
        pipelineExecutionInterval = null;
    }

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const progressContainer = document.getElementById('progressContainer');
    
    // Toggle buttons
    if (startButton) startButton.style.display = 'none';
    if (stopButton) stopButton.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'block';
    
    // Pipeline steps simulation data
    const pipelineSteps = [
        { key: 'setup', label: 'Setup', icon: 'fa-cog', status: 'running' },
        { key: 'build', label: 'Build', icon: 'fa-hammer', status: 'pending' },
        { key: 'test', label: 'Test', icon: 'fa-vial', status: 'pending' },
        { key: 'deploy', label: 'Deploy', icon: 'fa-rocket', status: 'pending' }
    ];
    
    // Start progress simulation
    let progress = 0;
    let currentStepIndex = 0;
    const progressBar = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const currentStepText = document.getElementById('currentStepText');
    const progressDuration = document.getElementById('progressDuration');
    
    const stepNames = ['Initializing...', 'Setting up environment...', 'Installing dependencies...', 'Running tests...', 'Building application...', 'Deploying...'];
    let stepNameIndex = 0;
    let startTime = Date.now();
    
    pipelineExecutionInterval = setInterval(() => {
        progress += Math.random() * 1 + 1.5; // Slower progress for ~10 second deployment
        if (progress > 100) progress = 100;
        
        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
        
        // Update progress text
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        // Update current step
        if (currentStepText && stepNameIndex < stepNames.length) {
            currentStepText.textContent = stepNames[stepNameIndex];
            if (progress > (stepNameIndex + 1) * (100 / stepNames.length)) {
                stepNameIndex++;
            }
        }
        
        // Update pipeline steps status based on progress
        if (progress > 25 && currentStepIndex === 0) {
            pipelineSteps[0].status = 'success';
            pipelineSteps[1].status = 'running';
            updatePipelineNodesStatus(pipelineSteps);
            currentStepIndex = 1;
        } else if (progress > 50 && currentStepIndex === 1) {
            pipelineSteps[1].status = 'success';
            pipelineSteps[2].status = 'running';
            updatePipelineNodesStatus(pipelineSteps);
            currentStepIndex = 2;
        } else if (progress > 75 && currentStepIndex === 2) {
            pipelineSteps[2].status = 'success';
            pipelineSteps[3].status = 'running';
            updatePipelineNodesStatus(pipelineSteps);
            currentStepIndex = 3;
        } else if (progress >= 100 && currentStepIndex === 3) {
            pipelineSteps[3].status = 'success';
            updatePipelineNodesStatus(pipelineSteps);
        }
        
        // Update duration
        if (progressDuration) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            progressDuration.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Complete execution
        if (progress >= 100) {
            clearInterval(pipelineExecutionInterval);
            pipelineExecutionInterval = null;
            completePipelineExecution();
        }
    }, 200); // Faster updates for smoother animation
}

function updatePipelineNodesStatus(steps) {
    steps.forEach((step, index) => {
        const nodeElement = document.querySelector(`[data-step="${step.key}"]`);
        if (nodeElement) {
            const circleElement = nodeElement.querySelector('.node-circle');
            const statusElement = nodeElement.querySelector('.node-status');
            
            if (circleElement) {
                // Remove all status classes
                circleElement.classList.remove('pending', 'running', 'success', 'failure');
                // Add new status class
                circleElement.classList.add(step.status);
            }
            
            if (statusElement) {
                statusElement.classList.remove('pending', 'running', 'success', 'failure');
                statusElement.classList.add(step.status);
                statusElement.textContent = getNodeStatusText(step.status);
            }
        }
        
        // Update connector after this node (if it exists)
        if (index < steps.length - 1) {
            const nextStepConnector = document.querySelector(`[data-step="${step.key}"]`).parentNode.children[index * 2 + 1];
            if (nextStepConnector && nextStepConnector.classList.contains('pipeline-connector')) {
                if (step.status === 'success') {
                    nextStepConnector.classList.add('active');
                } else {
                    nextStepConnector.classList.remove('active');
                }
            }
        }
    });
}

function stopPipelineExecution() {
    // Clear the active pipeline interval
    if (pipelineExecutionInterval) {
        clearInterval(pipelineExecutionInterval);
        pipelineExecutionInterval = null;
    }

    // Clear any existing reset timeout
    if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
    }

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const progressContainer = document.getElementById('progressContainer');
    const currentStepText = document.getElementById('currentStepText');
    
    // Toggle buttons immediately
    if (startButton) startButton.style.display = 'block';
    if (stopButton) stopButton.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'none';
    
    // Update current step text
    if (currentStepText) {
        currentStepText.textContent = 'Pipeline stopped by user';
    }
    
    // Show stop notification
    showNotification('Pipeline execution stopped', 'warning');
    
    // Reset canvas to initial state after a short delay
    resetTimeout = setTimeout(() => {
        resetPipelineToInitialState();
        resetTimeout = null;
    }, 500); // Reduced delay
}

function completePipelineExecution() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const currentStepText = document.getElementById('currentStepText');
    
    // Update UI immediately
    if (currentStepText) {
        currentStepText.textContent = 'Completed successfully!';
    }
    
    // Toggle buttons immediately
    if (startButton) startButton.style.display = 'block';
    if (stopButton) stopButton.style.display = 'none';
    
    // Show success notification
    showNotification('Pipeline execution completed successfully!', 'success');
    
    // Clear any existing reset timeout
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }
    
    // Reset to initial state after a longer delay
    resetTimeout = setTimeout(() => {
        resetPipelineToInitialState();
        resetTimeout = null;
    }, 30000); // Extended to 5 seconds
}

function resetPipelineToInitialState() {
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Mostrar estado vacío nuevamente
    const emptyState = document.getElementById('canvasEmptyState');
    if (emptyState) {
        emptyState.style.display = 'block';
    }
    
    // Reset canvas to initial pending state
    const canvas = document.getElementById('pipelineCanvas');
    if (!canvas) return;

    const initialSteps = [
        { key: 'setup', label: 'Setup', icon: 'fa-cog', status: 'pending' },
        { key: 'build', label: 'Build', icon: 'fa-hammer', status: 'pending' },
        { key: 'test', label: 'Test', icon: 'fa-vial', status: 'pending' },
        { key: 'deploy', label: 'Deploy', icon: 'fa-rocket', status: 'pending' }
    ];

    createCanvasNodes(canvas, initialSteps);
    
    // Ocultar nuevamente el estado vacío ya que ahora hay nodos
    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
}

/**
 * Step Details Modal Functionality
 */

function showStepDetail(stepKey, stepIndex) {
    // Get the current state of the node from the DOM
    const nodeElement = document.querySelector(`[data-step="${stepKey}"]`);
    if (!nodeElement) return;
    
    const circleElement = nodeElement.querySelector('.node-circle');
    const statusElement = nodeElement.querySelector('.node-status');
    
    // Determine current status from the DOM classes
    let currentStatus = 'pending'; // default
    if (circleElement) {
        if (circleElement.classList.contains('success')) currentStatus = 'success';
        else if (circleElement.classList.contains('running')) currentStatus = 'running';
        else if (circleElement.classList.contains('failure')) currentStatus = 'failure';
        else if (circleElement.classList.contains('pending')) currentStatus = 'pending';
    }
    
    // Base step definitions with different data based on current status
    const stepDefinitions = {
        'setup': {
            label: 'Setup',
            icon: 'fa-cog',
            description: 'Environment initialization and configuration',
            statusData: {
                'pending': {
                    duration: '',
                    startTime: '',
                    endTime: '',
                    logs: ['[PENDING] Setup task is waiting to start...']
                },
                'running': {
                    duration: '~45s',
                    startTime: new Date().toLocaleTimeString(),
                    endTime: '',
                    logs: [
                        '[INFO] Initializing pipeline environment...',
                        '[INFO] Loading configuration files...',
                        '[RUNNING] Setting up workspace...'
                    ]
                },
                'success': {
                    duration: '45s',
                    startTime: '10:30:15',
                    endTime: '10:31:00',
                    logs: [
                        '[INFO] Initializing pipeline environment...',
                        '[INFO] Loading configuration files...',
                        '[INFO] Setting up workspace...',
                        '[SUCCESS] Environment setup completed'
                    ]
                },
                'failure': {
                    duration: '23s',
                    startTime: '10:30:15',
                    endTime: '10:30:38',
                    logs: [
                        '[INFO] Initializing pipeline environment...',
                        '[ERROR] Failed to load configuration files',
                        '[FAILED] Setup failed - missing environment variables'
                    ]
                }
            }
        },
        'build': {
            label: 'Build',
            icon: 'fa-hammer',
            description: 'Application build and compilation process',
            statusData: {
                'pending': {
                    duration: '',
                    startTime: '',
                    endTime: '',
                    logs: ['[PENDING] Build task is waiting for setup to complete...']
                },
                'running': {
                    duration: '~2m 15s',
                    startTime: new Date().toLocaleTimeString(),
                    endTime: '',
                    logs: [
                        '[INFO] Starting build process...',
                        '[INFO] Installing dependencies...',
                        '[RUNNING] Compiling source code...'
                    ]
                },
                'success': {
                    duration: '2m 15s',
                    startTime: '10:31:00',
                    endTime: '10:33:15',
                    logs: [
                        '[INFO] Starting build process...',
                        '[INFO] Installing dependencies...',
                        '[INFO] Compiling source code...',
                        '[INFO] Optimizing assets...',
                        '[SUCCESS] Build completed successfully'
                    ]
                },
                'failure': {
                    duration: '1m 32s',
                    startTime: '10:31:00',
                    endTime: '10:32:32',
                    logs: [
                        '[INFO] Starting build process...',
                        '[INFO] Installing dependencies...',
                        '[ERROR] Compilation failed - syntax error in main.js:42',
                        '[FAILED] Build process terminated'
                    ]
                }
            }
        },
        'test': {
            label: 'Test',
            icon: 'fa-vial',
            description: 'Running automated tests and validation',
            statusData: {
                'pending': {
                    duration: '',
                    startTime: '',
                    endTime: '',
                    logs: ['[PENDING] Test task is waiting for build to complete...']
                },
                'running': {
                    duration: '~1m 30s',
                    startTime: new Date().toLocaleTimeString(),
                    endTime: '',
                    logs: [
                        '[INFO] Starting test suite...',
                        '[INFO] Running unit tests...',
                        '[RUNNING] Currently executing test: authentication_test.js'
                    ]
                },
                'success': {
                    duration: '1m 30s',
                    startTime: '10:33:15',
                    endTime: '10:34:45',
                    logs: [
                        '[INFO] Starting test suite...',
                        '[INFO] Running unit tests...',
                        '[INFO] Running integration tests...',
                        '[SUCCESS] All tests passed (24/24)'
                    ]
                },
                'failure': {
                    duration: '47s',
                    startTime: '10:33:15',
                    endTime: '10:34:02',
                    logs: [
                        '[INFO] Starting test suite...',
                        '[INFO] Running unit tests...',
                        '[ERROR] 3 tests failed in authentication module',
                        '[FAILED] Test suite completed with failures'
                    ]
                }
            }
        },
        'deploy': {
            label: 'Deploy',
            icon: 'fa-rocket',
            description: 'Deployment to target environment',
            statusData: {
                'pending': {
                    duration: '',
                    startTime: '',
                    endTime: '',
                    logs: ['[PENDING] Deploy task is waiting for tests to complete...']
                },
                'running': {
                    duration: '~2m 45s',
                    startTime: new Date().toLocaleTimeString(),
                    endTime: '',
                    logs: [
                        '[INFO] Starting deployment process...',
                        '[INFO] Connecting to target environment...',
                        '[RUNNING] Deploying application artifacts...'
                    ]
                },
                'success': {
                    duration: '2m 45s',
                    startTime: '10:34:45',
                    endTime: '10:37:30',
                    logs: [
                        '[INFO] Starting deployment process...',
                        '[INFO] Connecting to target environment...',
                        '[INFO] Deploying application artifacts...',
                        '[INFO] Running health checks...',
                        '[SUCCESS] Deployment completed successfully'
                    ]
                },
                'failure': {
                    duration: '1m 12s',
                    startTime: '10:34:45',
                    endTime: '10:35:57',
                    logs: [
                        '[INFO] Starting deployment process...',
                        '[ERROR] Failed to connect to target environment',
                        '[ERROR] Connection timeout after 60 seconds',
                        '[FAILED] Deployment failed'
                    ]
                }
            }
        }
    };

    const stepDef = stepDefinitions[stepKey];
    if (!stepDef) return;

    const step = {
        key: stepKey,
        label: stepDef.label,
        icon: stepDef.icon,
        status: currentStatus,
        description: stepDef.description,
        ...stepDef.statusData[currentStatus]
    };

    // Get modal elements
    const modal = document.getElementById('stepDetailModal');
    const modalIcon = document.getElementById('modalStepIcon');
    const modalTitle = document.getElementById('stepDetailModalLabel');
    const modalSubtitle = document.getElementById('stepDetailSubtitle');
    const stepDetailStatus = document.getElementById('stepDetailStatus');

    if (!modal) return;

    // Update modal content
    if (modalIcon) {
        modalIcon.innerHTML = `<i class="fas ${step.icon}"></i>`;
        modalIcon.className = `modal-icon status-${step.status}`;
    }

    if (modalTitle) {
        modalTitle.textContent = `${step.label} Step`;
    }

    if (modalSubtitle) {
        modalSubtitle.textContent = step.description;
    }

    if (stepDetailStatus) {
        const statusInfo = getStepStatusInfo(step.status);
        stepDetailStatus.innerHTML = `
            <span class="badge bg-${statusInfo.color} fs-6">
                <i class="fas ${statusInfo.icon} me-2"></i>${statusInfo.text}
            </span>
        `;
    }

    // Update timing information
    const startTimeElement = document.getElementById('stepStartTime');
    const endTimeElement = document.getElementById('stepEndTime');
    const durationElement = document.getElementById('stepDuration');

    if (startTimeElement) startTimeElement.textContent = step.startTime || 'Not started';
    if (endTimeElement) endTimeElement.textContent = step.endTime || 'Not completed';
    if (durationElement) durationElement.textContent = step.duration || 'N/A';

    // Update logs
    const logsContainer = document.getElementById('stepLogs');
    if (logsContainer) {
        logsContainer.textContent = step.logs.join('\n');
    }

    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function getStepStatusInfo(status) {
    const statusMap = {
        'success': { text: 'Completed', icon: 'fa-check-circle', color: 'success' },
        'running': { text: 'Running', icon: 'fa-spinner', color: 'primary' },
        'pending': { text: 'Pending', icon: 'fa-clock', color: 'warning' },
        'failure': { text: 'Failed', icon: 'fa-times-circle', color: 'danger' }
    };
    return statusMap[status] || { text: 'Unknown', icon: 'fa-question-circle', color: 'secondary' };
}

// ============================================
// DYNAMIC PIPELINE INFORMATION UPDATES
// ============================================

function updatePipelineInfo(projectKey, environmentKey) {
    const pipelineInfos = {
        'e-commerce-api': {
            'dev-docker': {
                description: 'Build, test and deploy API with Docker for development',
                directory: './examples/e-commerce-api',
                steps: 4
            },
            'prod-k8s': {
                description: 'Production deployment to Kubernetes cluster',
                directory: './examples/e-commerce-api',
                steps: 6
            },
            'staging-docker': {
                description: 'Staging deployment with Docker and testing suite',
                directory: './examples/e-commerce-api',
                steps: 5
            }
        },
        'blog-platform': {
            'dev-docker': {
                description: 'Blog platform development with hot reload',
                directory: './examples/blog-platform',
                steps: 3
            },
            'prod-k8s': {
                description: 'Production blog deployment with CDN',
                directory: './examples/blog-platform',
                steps: 5
            }
        },
        'dashboard-app': {
            'dev-docker': {
                description: 'Dashboard app with real-time data updates',
                directory: './examples/dashboard-app',
                steps: 4
            },
            'prod-k8s': {
                description: 'Production dashboard with load balancing',
                directory: './examples/dashboard-app',
                steps: 6
            }
        },
        'ml-pipeline': {
            'dev-docker': {
                description: 'ML model training and validation pipeline',
                directory: './examples/ml-pipeline',
                steps: 7
            },
            'prod-k8s': {
                description: 'Production ML inference with auto-scaling',
                directory: './examples/ml-pipeline',
                steps: 8
            }
        }
    };

    const info = pipelineInfos[projectKey]?.[environmentKey];
    if (!info) return;

    // Update pipeline info display
    const descriptionElement = document.getElementById('pipelineDescription');
    const directoryElement = document.getElementById('pipelineDirectory');
    const stepsElement = document.getElementById('pipelineSteps');

    if (descriptionElement) descriptionElement.textContent = info.description;
    if (directoryElement) directoryElement.textContent = info.directory;
    if (stepsElement) stepsElement.textContent = info.steps;
}
