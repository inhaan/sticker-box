let _itemIndex = 1;

export function createItem() {
    const itemEl = document.createElement("li");
    itemEl.className = "item droppable";
    itemEl.textContent = `sample text ${_itemIndex++} `;

    const btnDelItemEl = document.createElement("button");
    btnDelItemEl.textContent = "삭제";
    btnDelItemEl.setAttribute("data-action", "delete");
    btnDelItemEl.onclick = onClickBtnDelItem.bind(null, itemEl);
    itemEl.append(btnDelItemEl);

    makeDraggableItem(itemEl);

    return itemEl;
}

function onClickBtnDelItem(itemEl) {
    itemEl.remove();
}

function makeDraggableItem(el) {
    el.onmousedown = function (event) {
        if (event.target.dataset.action) {
            return;
        }

        //초기값 계산
        const clientRect = el.getBoundingClientRect();
        const shiftX = event.clientX - clientRect.left;
        const shiftY = event.clientY - clientRect.top;

        //document에 복사본 만들기
        const ghostEl = el.cloneNode(true);
        ghostEl.className = "item ghost";
        ghostEl.style.width = `${el.clientWidth - 20}px`;
        ghostEl.style.height = `${el.clientHeight - 20}px`;
        ghostEl.style.zIndex = 1000;
        ghostEl.style.listStyleType = "none";
        document.body.append(ghostEl);

        //placeholder로 변경함
        const placeholderEl = document.createElement("div");
        placeholderEl.className = "placeholder";
        placeholderEl.style.height = `${el.clientHeight}px`;
        el.before(placeholderEl);
        el.classList.add("hidden");

        //ghostEl 이동
        moveAt(event.pageX, event.pageY);
        document.addEventListener("mousemove", onMouseMove);

        //drop
        ghostEl.onmouseup = function () {
            document.removeEventListener("mousemove", onMouseMove);
            ghostEl.remove();

            placeholderEl.before(el);
            placeholderEl.remove();
            el.classList.remove("hidden");
        };

        //버블링 중단
        event.stopPropagation();

        function moveAt(pageX, pageY) {
            ghostEl.style.left = pageX - shiftX + "px";
            ghostEl.style.top = pageY - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            ghostEl.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            ghostEl.hidden = false;

            if (!elemBelow) {
                return;
            }

            //placeholder 이동하기 (item)
            let droppableItem = elemBelow.closest(".item.droppable");
            if (droppableItem) {
                const placeholderTop = placeholderEl.getBoundingClientRect().top;
                const droppableTop = droppableItem.getBoundingClientRect().top;

                if (placeholderTop < droppableTop) {
                    if (placeholderEl.nextElementSibling == droppableItem) {
                        droppableItem.after(placeholderEl);
                    } else {
                        droppableItem.before(placeholderEl);
                    }
                } else if (placeholderTop > droppableTop) {
                    if (placeholderEl.previousElementSibling == droppableItem) {
                        droppableItem.before(placeholderEl);
                    } else {
                        droppableItem.after(placeholderEl);
                    }
                }

                return;
            }

            //placeholder 이동하기 (item-container)
            let droppableContainer = elemBelow.closest(".item-container.droppable");
            if (droppableContainer) {
                //빈 스티커인 경우
                if (isEmptyContainer(droppableContainer)) {
                    droppableContainer.append(placeholderEl);
                }
            }
        }
    };

    el.ondragstart = function () {
        return false;
    };
}

function isEmptyContainer(itemContainerEl) {
    return itemContainerEl.querySelectorAll(".item.droppable:not(.hidden)").length == 0;
}
