import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

const accessToken = process.env.VUE_APP_API_GITHUB_KEY;
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

createApp(App).use(store).use(router, axios).mount("#app");
