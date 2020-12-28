export class SessionStorage {
    constructor() {
        this.storage = window.sessionStorage;
    }

    get(key) {
        let value = this.storage.getItem(key);
        switch (value) {
            case "true":
                value = true
                break;
            case "false":
                value = false;
                break;
            case "undefinded":
                value = undefined;
                break;
        }
        return value;
    }

    set(key, value) {
        if(typeof key === "string" && key) {
            this.storage.setItem(key, value)
        }
    }
}