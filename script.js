document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initTabs();
    initFormValidation();
    initHeaderScroll();
});

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.review-card, .menu-item');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        if (!validateName(nameInput)) {
            isValid = false;
        }
        
        if (!validateEmail(emailInput)) {
            isValid = false;
        }
        
        if (!validateMessage(messageInput)) {
            isValid = false;
        }
        
        if (isValid) {
            showSuccessMessage();
            form.reset();
            clearErrors();
        }
    });

    nameInput.addEventListener('blur', () => validateName(nameInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    messageInput.addEventListener('blur', () => validateMessage(messageInput));

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            clearFieldError(nameInput);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') {
            clearFieldError(emailInput);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            clearFieldError(messageInput);
        }
    });
}

function validateName(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');

    if (value === '') {
        showError(formGroup, errorMessage, 'Пожалуйста, введите ваше имя');
        return false;
    } else if (value.length < 2) {
        showError(formGroup, errorMessage, 'Имя должно содержать минимум 2 символа');
        return false;
    } else {
        clearError(formGroup, errorMessage);
        return true;
    }
}

function validateEmail(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        showError(formGroup, errorMessage, 'Пожалуйста, введите ваш email');
        return false;
    } else if (!emailRegex.test(value)) {
        showError(formGroup, errorMessage, 'Пожалуйста, введите корректный email');
        return false;
    } else {
        clearError(formGroup, errorMessage);
        return true;
    }
}

function validateMessage(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');

    if (value === '') {
        showError(formGroup, errorMessage, 'Пожалуйста, введите сообщение');
        return false;
    } else if (value.length < 10) {
        showError(formGroup, errorMessage, 'Сообщение должно содержать минимум 10 символов');
        return false;
    } else {
        clearError(formGroup, errorMessage);
        return true;
    }
}

function showError(formGroup, errorElement, message) {
    formGroup.classList.add('error');
    errorElement.textContent = message;
}

function clearError(formGroup, errorElement) {
    formGroup.classList.remove('error');
    errorElement.textContent = '';
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    clearError(formGroup, errorMessage);
}

function clearErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}

function showSuccessMessage() {
    const successElement = document.querySelector('.form-success');
    if (!successElement) return;

    successElement.textContent = 'Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.';
    successElement.classList.add('show');

    setTimeout(() => {
        successElement.classList.remove('show');
    }, 5000);
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}
