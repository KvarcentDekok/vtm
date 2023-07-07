import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function header() {
    ScrollTrigger.create({
        start: 'top -223',
        end: 99999,
        toggleClass: {className: 'header--scrolled', targets: '.header'}
    });
}

export default header;