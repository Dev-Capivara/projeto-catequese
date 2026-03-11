// assets/js/include.js
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    for (const el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                el.innerHTML = await response.text();
            }
        } catch (err) {
            console.error("Erro ao carregar componente:", file);
        }
    }
}

// Executa assim que a página carrega
document.addEventListener("DOMContentLoaded", includeHTML);
