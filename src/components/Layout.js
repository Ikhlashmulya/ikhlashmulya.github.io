import { Navbar } from "./Navbar";

export function Layout(Content) {
    return `
    <header>
    ${Navbar()}
    </header>
    <main>
    ${Content()}
    </main>
    `;
}