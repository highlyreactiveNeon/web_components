import Toast from "./Toast.js";

const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
    button.addEventListener("click", () => { showToast(button.textContent.toLowerCase()) });
});

function showToast(ty) {
    const newToast = new Toast({ type: ty, text: "Accout successfully registered", autoClose: 3000 });
}