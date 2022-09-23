let _itemIndex = 1;

export function createItem() {
    const itemEl = document.createElement("li");
    itemEl.className = "item droppable";
    itemEl.textContent = `sample text ${_itemIndex++} `;

    const btnDelItemEl = document.createElement("button");
    btnDelItemEl.textContent = "삭제";
    btnDelItemEl.setAttribute("data-action", "delete");
    itemEl.append(btnDelItemEl);

    itemEl.onclick = (event) => onClickItem(event, itemEl);
    makeDraggableItem(itemEl);

    return itemEl;
}

function onClickItem(event, itemEl) {
    switch (event.target.dataset.action) {
        case "delete":
            deleteItem(itemEl);
            break;
    }
}

function deleteItem(itemEl) {
    itemEl.remove();
}

function makeDraggableItem(el) {
    el.ondragstart = () => false;

    el.onmousedown = function (event) {
        //버튼 클릭시 드래그 안함
        if (event.target.dataset.action) {
            return;
        }

        //텍스트 선택 방지
        document.body.classList.add("noselect");

        //초기값 계산
        const clientRect = el.getBoundingClientRect();
        const shiftX = event.clientX - clientRect.left;
        const shiftY = event.clientY - clientRect.top;

        //document에 복사본 만들기
        const ghostEl = el.cloneNode(true);
        ghostEl.className = "item ghost";
        ghostEl.style.width = `${el.clientWidth - 20}px`;
        ghostEl.style.height = `${el.clientHeight - 20}px`;
        document.body.append(ghostEl);

        //placeholder로 변경함
        const placeholderEl = document.createElement("div");
        placeholderEl.className = "placeholder";
        placeholderEl.style.height = `${el.clientHeight}px`;
        el.before(placeholderEl);
        el.classList.add("hidden");

        //ghostEl 위치
        moveAt({ el: ghostEl, pageX: event.pageX, pageY: event.pageY, shiftX, shiftY });

        //ghostEl drag
        const mouseMoveHandler = (event) => {
            onMouseMove(event, { ghostEl, placeholderEl, shiftX, shiftY });
        };
        document.addEventListener("mousemove", mouseMoveHandler);

        //ghostEl drop
        const onMoseUp = () => {
            //ghoseEl 제거
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", onMoseUp);
            ghostEl.remove();

            //항목 이동 후 placehoderEl 제거
            placeholderEl.before(el);
            placeholderEl.remove();
            el.classList.remove("hidden");

            //텍스트 선택 방지 해제
            document.body.classList.remove("noselect");
        };
        document.addEventListener("mouseup", onMoseUp);

        //버블링 중단
        event.stopPropagation();
    };
}

function onMouseMove(event, { ghostEl, placeholderEl, shiftX, shiftY }) {
    //ghostEl 이동
    moveAt({ el: ghostEl, pageX: event.pageX, pageY: event.pageY, shiftX, shiftY });

    //중첩 요소 탐색
    ghostEl.hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    ghostEl.hidden = false;
    if (!elemBelow) {
        return;
    }

    //placeholder 이동 (item)
    let droppableItem = elemBelow.closest(".item.droppable");
    if (droppableItem) {
        moveOnItem(placeholderEl, droppableItem);
        return;
    }

    //placeholder 이동 (item-container / 빈 스티커인 경우)
    let droppableContainer = elemBelow.closest(".item-container.droppable");
    if (droppableContainer && isEmptyContainer(droppableContainer)) {
        droppableContainer.append(placeholderEl);
    }
}

function moveAt({ el, pageX, pageY, shiftX, shiftY }) {
    el.style.left = pageX - shiftX + "px";
    el.style.top = pageY - shiftY + "px";
}

function moveOnItem(placeholderEl, droppableItem) {
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
}

function isEmptyContainer(itemContainerEl) {
    return itemContainerEl.querySelectorAll(".item.droppable:not(.hidden)").length == 0;
}
