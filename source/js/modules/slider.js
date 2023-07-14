import {Autoplay, Navigation, Swiper, Pagination, Controller} from "swiper";

function getPagination(id) {
    return {
        el: `.slider__pagination[data-slider="${id}"]`,
        clickable: true,
        bulletClass: 'slider__pagination-bullet',
        bulletActiveClass: 'slider__pagination-bullet--active',
        renderBullet: (index, className) => {
            const number = index < 9 ? `0${index + 1}` : index + 1;

            return `<button type="button" class="${className}">${number}</button>`;
        }
    }
}

export function initSliderHome() {
    const sliderHomeBackground = new Swiper('#home-background-slider');

    const sliderHome = new Swiper('#home-slider', {
        modules: [Navigation, Autoplay, Pagination, Controller],
        autoplay: {
            delay: 8000
        },
        navigation: {
            nextEl: '.slider__control--right[data-slider="home-slider"]',
            prevEl: '.slider__control--left[data-slider="home-slider"]',
            disabledClass: 'slider__control--disabled'
        },
        pagination: getPagination('home-slider'),
        controller: {
            control: sliderHomeBackground
        }
    });
}

export function initSliderClients() {
    const sliderClients = new Swiper('#clients-slider', {
        modules: [Navigation, Pagination],
        spaceBetween: 56,
        slidesPerView: 2,
        navigation: {
            nextEl: '.slider__control--right[data-slider="clients-slider"]',
            prevEl: '.slider__control--left[data-slider="clients-slider"]',
            disabledClass: 'slider__control--disabled'
        },
        pagination: getPagination('clients-slider'),
        breakpoints: {
            800: {
                slidesPerView: 4
            }
        }
    });
}

export function initSliderExamples() {
    const sliderExamples = new Swiper('#examples-slider', {
        modules: [Navigation, Pagination],
        spaceBetween: 14,
        slidesPerView: 1,
        navigation: {
            nextEl: '.slider__control--right[data-slider="examples-slider"]',
            prevEl: '.slider__control--left[data-slider="examples-slider"]',
            disabledClass: 'slider__control--disabled'
        },
        pagination: getPagination('examples-slider'),
        breakpoints: {
            1100: {
                slidesPerView: 2
            }
        }
    });
}