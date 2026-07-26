import { Layout } from "../components/Layout";
import { About } from "../pages/About";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";

const routes = {
    '/': Home,
    '/about': About
}

export function router() {
    const app = document.getElementById('app');
    const path = window.location.pathname;
    const page = routes[path] || NotFound;

    app.innerHTML = Layout(page);
}

export function navigateTo(href) {
    history.pushState({}, "", href);
    router();
}