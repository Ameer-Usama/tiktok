// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Download Button Functionality
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const loading = document.getElementById('loading');

    if (downloadBtn && videoUrlInput && loading) {
        downloadBtn.addEventListener('click', function() {
            const url = videoUrlInput.value.trim();
            
            if (!url) {
                showNotification('Please enter a TikTok video URL', 'error');
                return;
            }

            if (!isValidTikTokUrl(url)) {
                showNotification('Please enter a valid TikTok video URL', 'error');
                return;
            }

            downloadVideo(url);
        });

        // Enter key support
        videoUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                downloadBtn.click();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});

// TikTok URL Validation
function isValidTikTokUrl(url) {
    const tiktokRegex = /^https?:\/\/(www\.|vm\.)?tiktok\.com\/.+/i;
    return tiktokRegex.test(url);
}

// Download Video Function
async function downloadVideo(url) {
    const loading = document.getElementById('loading');
    const downloadBtn = document.getElementById('downloadBtn');
    
    try {
        // Show loading state
        loading.style.display = 'flex';
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Send request to PHP backend
        const response = await fetch('download.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Create download link
            const link = document.createElement('a');
            link.href = result.download_url;
            link.download = result.filename || 'tiktok_video.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Video download started!', 'success');
            
            // Show video info if available
            if (result.video_info) {
                showVideoInfo(result.video_info);
            }
        } else {
            showNotification(result.message || 'Failed to download video', 'error');
        }
    } catch (error) {
        console.error('Download error:', error);
        showNotification('An error occurred while downloading the video', 'error');
    } finally {
        // Hide loading state
        loading.style.display = 'none';
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Show Video Info
function showVideoInfo(videoInfo) {
    const existingInfo = document.querySelector('.video-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    const videoInfoDiv = document.createElement('div');
    videoInfoDiv.className = 'video-info';
    videoInfoDiv.innerHTML = `
        <div class="video-info-content">
            <h3>Video Information</h3>
            <div class="video-details">
                ${videoInfo.title ? `<p><strong>Title:</strong> ${videoInfo.title}</p>` : ''}
                ${videoInfo.author ? `<p><strong>Author:</strong> ${videoInfo.author}</p>` : ''}
                ${videoInfo.duration ? `<p><strong>Duration:</strong> ${videoInfo.duration}s</p>` : ''}
                ${videoInfo.quality ? `<p><strong>Quality:</strong> ${videoInfo.quality}</p>` : ''}
            </div>
            <button class="close-info" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(videoInfoDiv);
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Page transition effects
function initPageTransitions() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.step, .faq-item, .footer-section').forEach(el => {
        observer.observe(el);
    });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', initPageTransitions);

// Particle background effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 0, 80, 0.5);
            border-radius: 50%;
            animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    hero.appendChild(particlesContainer);
}

// Add particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Form validation and enhancement
function enhanceForm() {
    const urlInput = document.getElementById('videoUrl');
    if (!urlInput) return;

    // Real-time validation
    urlInput.addEventListener('input', function() {
        const url = this.value.trim();
        const isValid = url === '' || isValidTikTokUrl(url);
        
        this.style.borderColor = url === '' ? 'rgba(255, 255, 255, 0.1)' : 
                                 isValid ? '#4ade80' : '#ef4444';
    });

    // Paste event handling
    urlInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const url = this.value.trim();
            if (isValidTikTokUrl(url)) {
                showNotification('Valid TikTok URL detected!', 'success');
            }
        }, 100);
    });
}

// Initialize form enhancements
document.addEventListener('DOMContentLoaded', enhanceForm);

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}