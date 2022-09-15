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

    const divEl = document.createElement("div");
    divEl.className = "sticker draggable";
    divEl.style.top = `${createSticker._stickerTop}px`;
    divEl.style.left = `${createSticker._stickerLeft}px`;

    divEl.innerHTML = `
        
    `;

    makeDraggable(divEl);

    return divEl;
}

function makeDraggable(el) {
    //
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
    };

    el.ondragstart = function () {
        return false;
    };
}
