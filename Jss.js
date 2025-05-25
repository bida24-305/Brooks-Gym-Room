// Brooks Gym Room - Navigation and Page Handling
document.addEventListener('DOMContentLoaded', function() {
    // Current page identifier
    const currentPage = document.body.dataset.page;
    
    // Navigation Elements
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    // Page Containers (for single-page application approach)
    const pageContainers = {
        home: document.getElementById('home-page'),
        about: document.getElementById('about-page'),
        services: document.getElementById('services-page'),
        contact: document.getElementById('contact-page'),
        feedback: document.getElementById('feedback-page')
    };
    
    // Highlight current page link
    function highlightCurrentLink() {
        navLinks.forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Also highlight in mobile menu if exists
        if (mobileNavLinks.length > 0) {
            mobileNavLinks.forEach(link => {
                if (link.dataset.page === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    
    // Initialize page highlighting
    highlightCurrentLink();
    
    // Mobile Menu Toggle
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const mobileMenu = document.querySelector('.mobile-nav');
            mobileMenu.classList.toggle('active');
            this.classList.toggle('open');
        });
    }
    
    // Handle navigation between pages
    function navigateToPage(page) {
        // If using single-page application approach
        if (Object.keys(pageContainers).includes(page) && pageContainers[page]) {
            // Hide all pages
            Object.values(pageContainers).forEach(container => {
                if (container) container.style.display = 'none';
            });
            
            // Show selected page
            pageContainers[page].style.display = 'block';
            
            // Update URL without reload
            history.pushState(null, '', `?page=${page}`);
            
            // Update current page highlight
            document.body.dataset.page = page;
            highlightCurrentLink();
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-nav');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuButton.classList.remove('open');
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            return false;
        }
        
        // If using multi-page approach, let the link work normally
        return true;
    }
    
    // Add click handlers to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const page = this.dataset.page;
            if (!navigateToPage(page)) {
                e.preventDefault();
            }
        });
    });
    
    // Add click handlers to mobile navigation links if they exist
    if (mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const page = this.dataset.page;
                if (!navigateToPage(page)) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 'home';
        navigateToPage(page);
    });
    
    // Feedback Form Handling
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#feedback-name').value.trim();
            const email = this.querySelector('#feedback-email').value.trim();
            const message = this.querySelector('#feedback-message').value.trim();
            const rating = this.querySelector('input[name="rating"]:checked');
            
            // Simple validation
            if (!name || !email || !message || !rating) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real app, this would send data to a server
            showAlert('Thank you for your feedback!', 'success');
            this.reset();
        });
    }
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#contact-name').value.trim();
            const email = this.querySelector('#contact-email').value.trim();
            const subject = this.querySelector('#contact-subject').value.trim();
            const message = this.querySelector('#contact-message').value.trim();
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real app, this would send data to a server
            showAlert('Your message has been sent! We will contact you soon.', 'success');
            this.reset();
        });
    }
    
    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const mainContent = document.querySelector('main') || document.body;
        mainContent.prepend(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 3000);
    }
});