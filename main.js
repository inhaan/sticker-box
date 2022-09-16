//TODO
//파일로 로직 분리하고
//이벤트 위임하기

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#btnCreateSticker").onclick = onClickBtnCreateSticker;
});

function onClickBtnCreateSticker() {
    //스티커를 생성한다
    document.querySelector("#stickerContainer").append(createSticker());
}

function createSticker() {
    createSticker._stickerTop = (createSticker._stickerTop ?? 0) + 10;
    createSticker._stickerLeft = (createSticker._stickerLeft ?? 0) + 10;
    createSticker._titleIndex = (createSticker._titleIndex ?? 0) + 1;

    const stickerEl = document.createElement("div");
    stickerEl.className = "sticker draggable";
    stickerEl.style.top = `${createSticker._stickerTop}px`;
    stickerEl.style.left = `${createSticker._stickerLeft}px`;

    const titleEl = document.createElement("div");
    titleEl.textContent = `Sticker${createSticker._titleIndex}`;
    stickerEl.append(titleEl);

    const btnAddItemEl = document.createElement("button");
    btnAddItemEl.textContent = "항목 추가";
    stickerEl.append(btnAddItemEl);

    const btnDelStickerEl = document.createElement("button");
    btnDelStickerEl.textContent = "스티커 삭제";
    btnDelStickerEl.onclick = onClickBtnDelSticker.bind(null, stickerEl);
    stickerEl.append(btnDelStickerEl);

    const itemContainerEl = document.createElement("ul");
    itemContainerEl.className = "item-container";
    stickerEl.append(itemContainerEl);

    btnAddItemEl.onclick = onClickBtnAddItem.bind(null, itemContainerEl);

    makeDraggable(stickerEl);

    return stickerEl;
}

function onClickBtnAddItem(itemContainerEl) {
    itemContainerEl.append(createItem());
}

function onClickBtnDelItem(itemEl) {
    itemEl.remove();
}

function onClickBtnDelSticker(stickerEl) {
    stickerEl.remove();
}

function createItem() {
    const itemEl = document.createElement("li");
    itemEl.className = "item";
    itemEl.textContent = "sample text...";

    const btnDelItemEl = document.createElement("button");
    btnDelItemEl.textContent = "삭제";
    btnDelItemEl.onclick = onClickBtnDelItem.bind(null, itemEl);
    itemEl.append(btnDelItemEl);

    makeDraggable(itemEl);

    return itemEl;
}

function makeDraggable(el) {
    el.onmousedown = function (event) {
        const shiftX = event.clientX - el.getBoundingClientRect().left;
        const shiftY = event.clientY - el.getBoundingClientRect().top;
        const parentLeft = event.clientX - el.offsetLeft - shiftX;
        const parentTop = event.clientY - el.offsetTop - shiftY;

        const originalZIndex = el.style.zIndex;
        el.style.zIndex = 1000;

        moveAt(event.pageX, event.pageY);

        // 초기 이동을 고려한 좌표 (pageX, pageY)에서
        // 공을 이동합니다.
        function moveAt(pageX, pageY) {
            el.style.left = pageX - parentLeft - shiftX + "px";
            el.style.top = pageY - parentTop - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // mousemove로 공을 움직입니다.
        document.addEventListener("mousemove", onMouseMove);

        // 공을 드롭하고, 불필요한 핸들러를 제거합니다.
        el.onmouseup = function () {
            document.removeEventListener("mousemove", onMouseMove);
            el.style.zIndex = originalZIndex;
            el.onmouseup = null;
        };

        event.stopPropagation();
    };

    el.ondragstart = function () {
        return false;
    };
}
