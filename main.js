import { createSticker } from "./sticker.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#btnCreateSticker").onclick = onClickBtnCreateSticker;
});

function onClickBtnCreateSticker() {
    document.querySelector("#stickerContainer").append(createSticker());
}
