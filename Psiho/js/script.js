/* бургер */

document.addEventListener('click', function(e){
    const targetElement = e.target;
    if(targetElement.closest('.menu-burger')){
        document.documentElement.classList.toggle('menu-open')
    }
})

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