
document.addEventListener("click", function (e) {
	const targetElement = e.target;

	if (targetElement.closest('.site-content__burger-menu')) {
		document.documentElement.classList.toggle('menu-open');
		e.preventDefault();
	}

})