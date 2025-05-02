
// Динамічне додавання класу в бургер 

document.addEventListener('click', function(e) {
    const targetElement = e.target;

    // Перевіряємо, чи клікнули на бургер-меню
    if (targetElement.closest('.menu-burger')) {
        document.documentElement.classList.toggle('menu-open');
    } else {
        // Перевіряємо, чи клікнули за межами меню
        const menuOpen = document.documentElement.classList.contains('menu-open');
        if (menuOpen && !targetElement.closest('.menu')) {
            document.documentElement.classList.remove('menu-open');
        }
    }
});

// Підключення слайдера 
document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.swiper__box', {
        loop: true,
        autoplay: {
             delay: 9000, 
            disableOnInteraction: false,
        },
        speed: 900,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});

// Обнулення дотсів 
document.addEventListener('DOMContentLoaded', () => {
    const pagination = document.querySelector('.swiper-pagination');
    if (pagination) {
        pagination.style.position = 'absolute';
        pagination.style.bottom = '0px';
        pagination.style.left = '0';
        pagination.style.width = '100%';
        pagination.style.textAlign = 'center';
    }
});

// Поява рухомого заголовка 

let options = {
    root: null,
    rootMargin: '5px',
    threshold: 0.5
};

let callback = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

let observer = new IntersectionObserver(callback, options);

let titles = document.querySelectorAll('.anim-title');
titles.forEach(title => {
    observer.observe(title);
})


// Поява соціальних мереж

let writeUsBtn = document.querySelector('.social__write-us'); // Виправив назву змінної
let socialLinks = document.querySelector('.social__links');
let closeBtn = document.querySelector('.social__close-btm');

writeUsBtn.addEventListener('click', () => {
    socialLinks.classList.add('show');
    closeBtn.style.display = 'block'; 
    writeUsBtn.style.display = 'none'; 
});

closeBtn.addEventListener('click', () => {
    socialLinks.classList.remove('show');
    closeBtn.style.display = 'none'; 
    writeUsBtn.style.display = 'block'; 
});


// Скакаюча іконка 

let icon = document.querySelector('.social__img-write-us');

icon.classList.add('bounce')
icon.addEventListener('click', ()=> {
icon.classList.remove('bounce')
})


// Зникання блоку соціальних мереж (самий робочий)

const iconBlock = document.querySelector('.social');
const footer = document.querySelector('.footer');

// Перевіряємо, чи існують обидва елементи, щоб уникнути помилок
if (iconBlock && footer) {
  // Початково приховуємо блок (краще робити це через CSS, але для прикладу залишимо тут)
  iconBlock.style.display = 'none';

  let isScrolling; // Для дебаунсу

  window.addEventListener('scroll', () => {
    // Очищуємо попередній таймер для дебаунсу
    clearTimeout(isScrolling);

    // Встановлюємо новий таймер
    isScrolling = setTimeout(() => {
      const scrollPosition = window.scrollY; // Поточна позиція скролу
      const footerTop = footer.getBoundingClientRect().top; // Позиція верху футера відносно в'юпорта
      const windowHeight = window.innerHeight; // Висота вікна браузера

      // Перевірка, чи футер видимий (або ось-ось з'явиться)
      const isFooterVisible = footerTop <= windowHeight;

      // --- Основна логіка ---

      if (isFooterVisible) {
        // 1. Якщо футер видимий - завжди ховаємо іконки (найвищий пріоритет)
        iconBlock.style.display = 'none';
      } else if (scrollPosition > 600) {
        // 2. Якщо футер НЕ видимий І скрол > 500px - показуємо іконки
        iconBlock.style.display = 'block'; // Або 'flex', 'grid' - залежно від вашого CSS
      } else {
        // 3. В усіх інших випадках (скрол <= 500px і футер не видимий) - ховаємо
        iconBlock.style.display = 'none';
      }

    }, 50); // Затримка 50мс для дебаунсу (можна налаштувати)
  });

} else {
  // Повідомлення в консоль, якщо один з елементів не знайдено
  console.warn("Елемент .social або .footer не знайдено на сторінці.");
}



