import { createItem } from "./stickerItem.js";

let _stickerTop = 0;
let _stickerLeft = 0;
let _titleIndex = 0;

let _stickerZIndex = 1;

export function createSticker() {
    _stickerTop = _stickerTop + 10;
    _stickerLeft = _stickerLeft + 10;
    _titleIndex = _titleIndex + 1;

    const stickerEl = document.createElement("div");
    stickerEl.className = "sticker draggable";
    stickerEl.style.zIndex = getStickerZIndex();
    stickerEl.style.backgroundColor = getRandomBackgroundColor();
    stickerEl.style.top = `${_stickerTop}px`;
    stickerEl.style.left = `${_stickerLeft}px`;

    const titleEl = document.createElement("div");
    titleEl.textContent = `Sticker${_titleIndex}`;
    stickerEl.append(titleEl);

    const btnAddItemEl = document.createElement("button");
    btnAddItemEl.textContent = "항목 추가";
    stickerEl.append(btnAddItemEl);

    const btnDelStickerEl = document.createElement("button");
    btnDelStickerEl.textContent = "스티커 삭제";
    btnDelStickerEl.onclick = onClickBtnDelSticker.bind(null, stickerEl);
    stickerEl.append(btnDelStickerEl);

    const itemContainerEl = document.createElement("ul");
    itemContainerEl.className = "item-container droppable";
    stickerEl.append(itemContainerEl);

    btnAddItemEl.onclick = onClickBtnAddItem.bind(null, itemContainerEl);

    makeDraggableSticker(stickerEl);

    return stickerEl;
}

function onClickBtnAddItem(itemContainerEl) {
    itemContainerEl.append(createItem());
}

function onClickBtnDelSticker(stickerEl) {
    stickerEl.remove();
}

function getStickerZIndex() {
    return _stickerZIndex++;
}

function getRandomBackgroundColor() {
    const getRandom = () => Math.floor(Math.random() * 50 + 150);
    return `rgb(${getRandom()}, ${getRandom()}, ${getRandom()})`;
}

function makeDraggableSticker(el) {
    el.onmousedown = function (event) {
        const shiftX = event.clientX - el.getBoundingClientRect().left;
        const shiftY = event.clientY - el.getBoundingClientRect().top;
        const parentLeft = event.clientX - el.offsetLeft - shiftX;
        const parentTop = event.clientY - el.offsetTop - shiftY;

        el.style.zIndex = getStickerZIndex();

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            el.style.left = pageX - parentLeft - shiftX + "px";
            el.style.top = pageY - parentTop - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        el.onmouseup = function () {
            document.removeEventListener("mousemove", onMouseMove);
            el.onmouseup = null;
        };
    };

    el.ondragstart = function () {
        return false;
    };
}
