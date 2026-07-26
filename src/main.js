import { navigateTo, router } from './routes'
import './style.css'

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

window.addEventListener("popstate", () => {
    router();
})

router();