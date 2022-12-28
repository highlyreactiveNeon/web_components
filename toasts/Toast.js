export default class Toast {
    #toast;
    #autoCloseTimeout;
    #autoCloseValue;
    #toastEnterTime;

    constructor({ position, text, type, autoClose }) {
        this.#toast = document.createElement("li");
        this.#toast.classList.add("toast-li");
        this.#toast.innerHTML = giveToast(toast_config[type], text);
        this.#toast.addEventListener("click", () => { this.close() });

        this.#autoCloseValue = autoClose || 6000;
        document.documentElement.style.setProperty('--toast-time', String(this.#autoCloseValue/1000) + "s");
        this.autoClose = this.#autoCloseValue;

        this.#toast.addEventListener("mouseenter", () => {
            this.onMouseEnter();
        });
        this.#toast.addEventListener("mouseleave", () => {
            this.onMouseLeave();
        });

        this.position = position || "top-right";
    }

    /**
     * @param {any} value
     */
    set position(value) {
        const selector = `.toasts-container[data-position=${value}]`;
        const container = document.querySelector(selector) || createContainer(value);

        container.appendChild(this.#toast);
    }

    /**
     * @param {number | boolean | undefined} value
     */
    set autoClose(value) {
        if(value === false) return

        this.#toastEnterTime = new Date();

        if(this.#autoCloseTimeout != null) clearTimeout(this.#autoCloseTimeout);

        this.#autoCloseTimeout = setTimeout(() => { this.close() }, value);
    }

    onMouseEnter() {
        this.#autoCloseValue = this.#autoCloseValue - (new Date() - this.#toastEnterTime);
        clearTimeout(this.#autoCloseTimeout);
    }

    onMouseLeave() {
        if(this.#toast.classList.contains("hide"))
            return;
        this.autoClose = this.#autoCloseValue;
    }

    close() {
        clearTimeout(this.#autoCloseTimeout);

        const toast_animation_time = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--toast-show-time").split("s")[0]) * 1000;
        this.#toast.classList.add("hide");
        setTimeout(() => { this.#remove() }, toast_animation_time + 50);
    }

    #remove() {
        const container = this.#toast.parentElement;
        this.#toast.remove();
        if(container.hasChildNodes()) return;
        container.remove();
    }
}

function giveToast(config, text) {
    if(config.type == "error") {
        text = "Error: " + text;
    }
    else if(config.type == "warning") {
        text = "Warning: " + text;
    }

    const toast_template = `
        <div class="toast ${config.type}">
            <div class="fa-toast-icon-container">
                <i class="fa-solid ${config.icon} fa-toast-icon"></i>
            </div>

            <div class="toast-text-section">
                ${text}
            </div>

            <div class="fa-toast-icon-container">
                <i class="fa-solid fa-xmark fa-toast-icon"></i>
            </div>
            <div class="toast-progress-bar"></div>
        </div>
    `;

    return toast_template;
}

function createContainer(position) {
    const container = document.createElement("ul");
    container.classList.add("toasts-container");
    container.classList.add("toasts-ul");
    container.dataset.position = position;
    document.body.append(container);
    return container;
}

const toast_config = {
    info: {
        type: "info",
        icon: "fa-circle-info",
        color: "#3498db",
    },
    success: {
        type: "success",
        icon: "fa-circle-check",
        color: "#07bc0c",
    },
    warning: {
        type: "warning",
        icon: "fa-triangle-exclamation",
        color: "#f1c40f",
    },
    error: {
        type: "error",
        icon: "fa-triangle-exclamation",
        color: "#e74c3c",
    },
}