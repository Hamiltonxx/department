import { defineStore } from "pinia";

export const useCommonState = defineStore("common", {
    state: () => ({
        menu_path: [],
    }),
    actions: {
        setMenuPath(path) {
            this.menu_path.push(path);
        }
    }
});