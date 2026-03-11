// assets/js/auth-guard.js
(function() {
    const auth = sessionStorage.getItem('scj_auth');
    if (!auth) {
        // Se estiver dentro da pasta /pages, precisa voltar dois níveis
        window.location.href = '../index.html'; 
    }
})();
