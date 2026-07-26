import { navigateTo, router } from './routes';
import './style.css';

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

window.addEventListener("popstate", () => {
    router();
});

const redirect = sessionStorage.redirect;
if (redirect) {
    sessionStorage.removeItem("redirect");
    navigateTo(redirect);
} else {
    router();
}