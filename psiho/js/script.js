/* бургер відкриття/закриття*/

document.addEventListener('click', function(e) {
    const targetElement = e.target;
    const html = document.documentElement;

    // Відкриття/закриття по кліку на бургер
    if (targetElement.closest('.menu-burger')) {
        html.classList.toggle('menu-open');
    } 
    // Закриття, якщо меню відкрите і клік був НЕ по меню і НЕ по бургеру
    else if (html.classList.contains('menu-open') && !targetElement.closest('.menu__body')) {
        html.classList.remove('menu-open');
    }

    // Блокування скролу: якщо клас є, вішаємо hidden, якщо немає — прибираємо
    if (html.classList.contains('menu-open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

/* Анімація тайтла */

const hiroContent = document.querySelector('.home-hiro__box-title');

window.addEventListener('load', () => {
    hiroContent.classList.add('_active');
});


/* Анімація тексту */
const observerOptions = {
    threshold: 0.4 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('_active');
        }
    });
}, observerOptions);

// Чіпляємо спостерігач на текстовий блок
const textBlock = document.querySelector('.home-first__text-block');
if (textBlock) {
    observer.observe(textBlock);
}

/*Анімація карток */

const secondSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('_active');
            // Після активації можна припинити спостереження
            secondSectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 }); 

const targetSection = document.querySelector('.home-second');
if (targetSection) {
    secondSectionObserver.observe(targetSection);
}