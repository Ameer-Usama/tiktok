document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initAccordion();
    
    // Initialize download buttons
    initDownloadButtons();
    
    // Initialize animated counters for statistics
    initCounters();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
});

// Accordion functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Download buttons functionality
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const inputGroup = this.closest('.input-group');
            const input = inputGroup.querySelector('input');
            const resultContainer = inputGroup.nextElementSibling;
            
            if (!input.value.trim()) {
                showError(resultContainer, 'Please enter a valid TikTok URL');
                return;
            }
            
            if (!validateTikTokUrl(input.value)) {
                showError(resultContainer, 'Please enter a valid TikTok URL');
                return;
            }
            
            // Show loading state
            showLoading(resultContainer);
            
            // Simulate download process (replace with actual API call)
            setTimeout(() => {
                showDownloadResult(resultContainer, input.value);
            }, 2000);
        });
    });
}

// Validate TikTok URL
function validateTikTokUrl(url) {
    // Basic validation - check if URL contains tiktok.com
    return url.includes('tiktok.com');
}

// Show error message
function showError(container, message) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

// Show loading state
function showLoading(container) {
    container.innerHTML = `<div class="loading-message"><span class="loading"></span>Processing your request...</div>`;
}

// Show download result
function showDownloadResult(container, url) {
    const fileName = 'tiktok_' + Math.floor(Math.random() * 1000000) + '.mp4';
    container.innerHTML = `
        <div class="download-result">
            <span>Ready to download!</span>
            <a href="#" class="download-link">Download Now</a>
        </div>
    `;
}

// Initialize animated counters for statistics
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;
    
    const options = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = duration / target;
                
                const timer = setInterval(() => {
                    count++;
                    counter.textContent = count.toLocaleString();
                    
                    if (count >= target) {
                        clearInterval(timer);
                    }
                }, interval);
                
                observer.unobserve(counter);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Auto scroll for testimonials
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const scrollDelay = 30;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    let scrollDirection = 1;
    
    function autoScroll() {
        if (!slider.matches(':hover')) {
            scrollAmount += scrollSpeed * scrollDirection;
            
            if (scrollAmount >= maxScroll) {
                scrollDirection = -1;
            } else if (scrollAmount <= 0) {
                scrollDirection = 1;
            }
            
            slider.scrollLeft = scrollAmount;
        }
        
        setTimeout(autoScroll, scrollDelay);
    }
    
    // Start auto scroll after 3 seconds
    setTimeout(autoScroll, 3000);
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .testimonial-card');
    
    if (!animatedElements.length) return;
    
    const options = {
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Add wave animation to hero section
function createWave() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    const wave = document.createElement('div');
    wave.classList.add('hero-wave');
    wave.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    `;
    
    heroSection.appendChild(wave);
}

// Call createWave function when DOM is loaded
document.addEventListener('DOMContentLoaded', createWave);