/**
 * Demo Landing Page JavaScript
 * Simulates basic interactions for the LocalForge Engine landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for internal links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate stats in the hero preview
    animateStats();
    
    // Add hover effects to tech stack icons
    initTechStackAnimations();
    
    // Start auto-updating the pipeline preview
    startPipelineAnimation();
});

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isPercentage = finalValue.includes('%');
        const numValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        if (!isNaN(numValue)) {
            animateNumber(stat, numValue, isPercentage ? '%' : '', 2000);
        }
    });
}

function animateNumber(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeProgress);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    }
    
    requestAnimationFrame(update);
}

function initTechStackAnimations() {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach((icon, index) => {
        // Add staggered entrance animation
        icon.style.animationDelay = `${index * 0.5}s`;
        
        // Add click interaction
        icon.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
}

function startPipelineAnimation() {
    const steps = document.querySelectorAll('.pipeline-step');
    let currentStep = 0;
    
    function cyclePipelineSteps() {
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Set completed steps
        for (let i = 0; i < currentStep; i++) {
            steps[i].classList.add('completed');
        }
        
        // Set current active step
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
        }
        
        // Move to next step
        currentStep = (currentStep + 1) % (steps.length + 1);
        
        // Schedule next update
        setTimeout(cyclePipelineSteps, 3000);
    }
    
    // Start the animation after a delay
    setTimeout(cyclePipelineSteps, 1000);
}

// Add parallax effect to hero background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-background');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    const steps = document.querySelectorAll('.step');
    
    [...featureCards, ...steps].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add loading states to CTA buttons
document.querySelectorAll('.btn-primary, .btn-outline-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Only add loading state for external navigation
        if (this.href && (this.href.includes('pipelines.html') || this.href.includes('projects.html'))) {
            e.preventDefault();
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            this.classList.add('disabled');
            
            setTimeout(() => {
                window.location.href = this.href;
            }, 800);
        }
    });
});
