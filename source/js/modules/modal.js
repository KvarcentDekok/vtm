const modals = document.querySelectorAll('.modal');

let activeElement;
let isModalShow = false;

function onCallerClick(evt) {
    const caller = evt.target;
    const targetModal = document.querySelector(`#${caller.getAttribute('aria-controls')}`);
    const modalContent = targetModal.querySelector('.modal__content');
    const substrate = document.createElement('div');

    evt.preventDefault();

    isModalShow = true;
    activeElement = document.activeElement;

    substrate.classList.add('substrate-modal');

    document.body.append(substrate);
    targetModal.classList.add('offset-scroll');

    if (document.documentElement.clientWidth !== window.innerWidth) {
        document.body.classList.add('offset-scroll');
    }

    document.body.classList.add('no-scroll');

    setTimeout(() => {
        substrate.classList.add('substrate-modal--show');
    }, 10);

    setTimeout(() => {
        targetModal.classList.add('modal--show');
        targetModal.focus();
    });

    setTimeout(() => {
        modalContent.classList.add('modal__content--show');

        if (targetModal.clientWidth === window.innerWidth) {
            targetModal.classList.remove('offset-scroll');
        }
    }, 200);

    giveData(caller, targetModal);
}

function onCloseClick(evt, modal) {
    let target = evt.target;

    while (target !== modal.parentNode) {
        if (target.dataset.call === 'close') {
            closeModal(modal);
        } else if (target.classList.contains('modal__content')) {
            break;
        }

        target = target.parentNode;
    }
}

function giveData (caller, modal) {
    let dataGive = caller.dataset.give;

    if (dataGive) {
        dataGive = dataGive.replace(/[\n\r]/g, ' ');

        const giveItems = dataGive.split(';; ');
        const giveObject = {};
        const takeElems = modal.querySelectorAll('[data-take]');

        for (let i = 0; i < giveItems.length; i++) {
            const key = giveItems[i].split(':: ')[0].replace(/\s{2,}/g, '');

            let value = giveItems[i].split(':: ')[1].trim();

            if (value[0] === '[' && value[value.length - 1] === ']') {
                value = JSON.parse(value);
            }

            giveObject[key] = value;
        }

        for (let key in giveObject) {
            if (giveObject.hasOwnProperty(key)) {
                for (let i = 0; i < takeElems.length; i++) {
                    const takeThings = takeElems[i].dataset.take.split(', ');

                    for (let j = 0; j < takeThings.length; j++) {
                        if (takeThings[j].indexOf(key) + 1 && key === 'text') { // give text
                            if (typeof giveObject[key] === 'string') {
                                takeElems[i].textContent = giveObject[key];
                            } else if (typeof giveObject[key] === 'object') {
                                let takeString = takeElems[i].dataset.take,
                                    index = takeString.slice(takeString.indexOf('[') + 1, takeString.indexOf(']'));

                                takeElems[i].textContent = giveObject[key][Number(index)];
                            }
                        } else if (takeThings[j].indexOf(key) + 1 && key === 'class') { // give class
                            if (typeof giveObject[key] === 'string') {
                                takeElems[i].classList.toggle(giveObject[key]);

                                if (takeElems[i].classList.contains(giveObject[key])) {
                                    takeElems[i].setAttribute('data-add-class', giveObject[key]);
                                } else {
                                    takeElems[i].setAttribute('data-remove-class', giveObject[key]);
                                }
                            } else if (typeof giveObject[key] === 'object') {
                                if (takeThings[j] === key) {
                                    let addArray = [],
                                        removeArray = [];

                                    for (let k = 0; k < giveObject[key].length; k++) {
                                        takeElems[i].classList.toggle(giveObject[key][k]);

                                        if (takeElems[i].classList.contains(giveObject[key][k])) {
                                            addArray.push(giveObject[key][k]);
                                        } else {
                                            removeArray.push(giveObject[key][k]);
                                        }
                                    }

                                    if (addArray.length > 0) {
                                        takeElems[i].dataset.addClass = '[' + String(addArray) + ']';
                                    }

                                    if (removeArray.length > 0 ) {
                                        takeElems[i].dataset.removeClass = '[' + String(removeArray) + ']';
                                    }
                                } else {
                                    let takeString = takeElems[i].dataset.take,
                                        index = takeString
                                            .slice(takeString.indexOf('[') + 1, takeString.indexOf(']'));

                                    takeElems[i].classList.toggle(giveObject[key][Number(index)]);

                                    if (takeElems[i].classList.contains(giveObject[key][Number(index)])) {
                                        takeElems[i].dataset.addClass = giveObject[key][Number(index)];
                                    } else {
                                        takeElems[i].dataset.removeClass = giveObject[key][Number(index)];
                                    }
                                }
                            }
                        } else if (takeThings[j].indexOf(key) + 1) { // give attribute
                            if (typeof giveObject[key] === 'string') {
                                takeElems[i].setAttribute(key, giveObject[key]);
                            } else if (typeof giveObject[key] === 'object') {
                                let takeString = takeElems[i].dataset.take,
                                    index = takeString.slice(takeString.indexOf('[') + 1, takeString.indexOf(']'));

                                takeElems[i].setAttribute(key, giveObject[key][Number(index)]);
                            }
                        }
                    }
                }
            }
        }
    }
}

function removeData (modal) {
    const takeElems = modal.querySelectorAll('[data-take]');

    if (takeElems.length > 0) {
        const addClassElems = modal.querySelectorAll('[data-add-class]');
        const removeClassElems = modal.querySelectorAll('[data-remove-class]');

        for (let i = 0; i < takeElems.length; i++) {
            const takeThings = takeElems[i].dataset.take.split(', ');

            for (let j = 0; j < takeThings.length; j++) {
                if (takeThings[j].indexOf('text') + 1) { // remove text
                    takeElems[i].textContent = '';
                } else if (!(takeThings[j].indexOf('class') + 1)) { // remove attribute
                    if (takeThings[j].indexOf('[') + 1) {
                        takeElems[i].removeAttribute(takeThings[j].slice(0, takeThings[j].indexOf('[')));
                    } else {
                        takeElems[i].removeAttribute(takeThings[j]);
                    }
                }
            }
        }

        for (let i = 0; i < addClassElems.length; i++) { // add class
            let value = addClassElems[i].dataset.addClass;

            if (value[0] === '[' && value[value.length - 1] === ']') {
                value = value.slice(1, value.length - 1).split(', ');

                for (let j = 0; j < value.length; j++) {
                    addClassElems[i].classList.remove(value[j]);
                }
            } else {
                addClassElems[i].classList.remove(value);
            }

            addClassElems[i].removeAttribute('data-add-class');
        }

        for (let i = 0; i < removeClassElems.length; i++) { // remove class
            let value = removeClassElems[i].dataset.removeClass;

            if (value[0] === '[' && value[value.length - 1] === ']') {
                value = value.slice(1, value.length - 1).split(',');

                for (let j = 0; j < value.length; j++) {
                    removeClassElems[i].classList.add(value[j]);
                }
            } else {
                removeClassElems[i].classList.add(value);
            }

            removeClassElems[i].removeAttribute('data-remove-class');
        }
    }
}

function closeModal (modal) {
    const modalContent = modal.querySelector('.modal__content');
    const substrate = document.querySelector('.substrate-modal');
    const closeEvent = new Event('closeModal');

    isModalShow = false;

    modalContent.classList.remove('modal__content--show');
    substrate.classList.remove('substrate-modal--show');

    setTimeout(function () {
        modal.classList.remove('modal--show');
        substrate.remove();
        removeData(modal);
    }, 200);

    document.body.classList.remove('no-scroll');
    document.body.classList.remove('offset-scroll');

    activeElement?.focus();

    document.dispatchEvent(closeEvent);
}

function setCloseListeners (modal) {
    const callersClose = modal.querySelectorAll('[data-call="close"]');

    for (let i = 0; i < callersClose.length; i++) {
        callersClose[i].addEventListener('click', (evt) => {
            onCloseClick(evt, modal);
        });
    }

    if (modal.dataset.call === 'close') {
        modal.addEventListener('click', (evt) => {
            onCloseClick(evt, modal);
        });
    }

    window.onkeydown = (evt) => {
        if (evt.code === 'Escape') {
            if (modal.classList.contains('modal--show')) {
                evt.preventDefault();

                closeModal(modal);
            }
        }
    }
}

function onDocumentFocus (evt) {
    const modal = findModalShow();

    if (isModalShow) {
        const target = evt.target;

        if (target !== modal && target !== document && !isHasElem(target, modal)) {
            modal.focus();
        }
    }
}

function findModalShow() {
    const modals = document.querySelectorAll('.modal');

    for (let i = 0; i < modals.length; i++) {
        if (modals[i].classList.contains('modal--show')) {
            return modals[i];
        }
    }
}

function isHasElem (elem, parent) {
    const descendants = parent.querySelectorAll('*');

    for (let i = 0; i < descendants.length; i++) {
        if (elem === descendants[i]) {
            return true;
        }
    }
}

function modal (callers = document.querySelectorAll('[data-call="modal"]')) {
    if (callers.length > 0) {
        for (let i = 0; i < callers.length; i++) {
            callers[i].addEventListener('click', (evt) => {
                onCallerClick(evt);
            });
        }
    }

    for (let i = 0; i < modals.length; i++) {
        setCloseListeners(modals[i]);
    }

    document.addEventListener('focusin', (evt) => {
        onDocumentFocus(evt);
    });
}

export default modal;