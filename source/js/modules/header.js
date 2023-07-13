import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const ToggleText = {
    Collapsed: 'Показать навигацию',
    Expanded: 'Скрыть навигацию'
}

const headerElement = document.querySelector('.header');
const toggleButton = headerElement.querySelector('.header__toggle');
const toggleTextElement = toggleButton.querySelector('span');

function toggleClickHandler() {
    headerElement.classList.toggle('header--expanded');

    if (headerElement.classList.contains('header--expanded')) {
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleTextElement.textContent = ToggleText.Expanded;
    } else {
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleTextElement.textContent = ToggleText.Collapsed;
    }
}

gsap.registerPlugin(ScrollTrigger);

function header() {
    ScrollTrigger.create({
        start: 'top -223',
        end: 99999,
        toggleClass: {className: 'header--scrolled', targets: '.header'}
    });

    toggleButton.addEventListener('click', () => {
        toggleClickHandler();
    });
}

export default header;