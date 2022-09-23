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
    btnDelStickerEl.onclick = () => onClickBtnDelSticker(stickerEl);
    stickerEl.append(btnDelStickerEl);

    const itemContainerEl = document.createElement("ul");
    itemContainerEl.className = "item-container droppable";
    stickerEl.append(itemContainerEl);

    btnAddItemEl.onclick = () => onClickBtnAddItem(itemContainerEl);

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
    el.ondragstart = () => false;

    el.onmousedown = function (event) {
        //텍스트 선택 방지
        document.body.classList.add("noselect");

        //맨 위로 올리기
        el.style.zIndex = getStickerZIndex();

        //초기값 계산
        const clientRect = el.getBoundingClientRect();
        const shiftX = event.clientX - clientRect.left;
        const shiftY = event.clientY - clientRect.top;
        const parentLeft = event.clientX - el.offsetLeft - shiftX;
        const parentTop = event.clientY - el.offsetTop - shiftY;

        //drag
        const onMouseMove = (event) => {
            moveAt({
                el,
                pageX: event.pageX,
                pageY: event.pageY,
                shiftX,
                shiftY,
                parentLeft,
                parentTop,
            });
        };
        document.addEventListener("mousemove", onMouseMove);

        //drop
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            //텍스트 선택 방지 해제
            document.body.classList.remove("noselect");
        };
        document.addEventListener("mouseup", onMouseUp);
    };
}

function moveAt({ el, pageX, pageY, shiftX, shiftY, parentLeft, parentTop }) {
    el.style.left = pageX - parentLeft - shiftX + "px";
    el.style.top = pageY - parentTop - shiftY + "px";
}
