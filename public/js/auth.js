document.addEventListener('DOMContentLoaded', () => {

    const USER_DATA_KEY = 'devgames_active_user';

    // --- 1. REFERÊNCIAS DE ELEMENTOS (IDs de todas as páginas) ---
    const loginContainer = document.getElementById('login-button-container');
    const profileContainer = document.getElementById('profile-menu-container');
    const logoutButton = document.getElementById('btn-logout');
    const avatarTrigger = document.querySelector('.avatar-trigger');
    const dropdownContent = document.getElementById('profile-dropdown-content');
    const welcomeSpan = document.querySelector('.dropdown-welcome');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');
    const loginButton = document.getElementById('login-button');

    // determina avatar padrão conforme a localização da página (index na raiz vs páginas em public/html)
    const defaultAvatar = window.location.pathname.includes('/public/')
        ? '../assets/images/avatar/avatar.jpg'    // páginas dentro de public/html
        : './public/assets/images/avatar/avatar.jpg'; // index na raiz

    // --- 2. FUNÇÕES PRINCIPAIS DE AUTENTICAÇÃO ---
    function checkLoginStatus() {
        const userString = localStorage.getItem(USER_DATA_KEY);
        return userString ? JSON.parse(userString) : null;
    }

    function renderHeader(isLoggedIn) {
        // se a página não tiver containers, não tenta manipular DOM
        if (!loginContainer || !profileContainer) return;
        if (isLoggedIn) {
            loginContainer.classList.add('hidden');
            profileContainer.classList.remove('hidden');
            const userData = checkLoginStatus();
            const userName = userData && userData.name ? userData.name.split(' ')[0] : 'Usuário';
            if (welcomeSpan) welcomeSpan.textContent = `Olá, ${userName}!`;
        } else {
            loginContainer.classList.remove('hidden');
            profileContainer.classList.add('hidden');
            if (welcomeSpan) welcomeSpan.textContent = '';
        }
    }

    function handleLogout() {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem(USER_DATA_KEY);

        // Redireciona para a raiz (index.html). Tenta origem se disponível.
        try {
            if (window.location.origin && window.location.origin !== 'null') {
                window.location.href = window.location.origin + '/index.html';
            } else {
                window.location.href = '../../index.html';
            }
        } catch (e) {
            window.location.href = '../../index.html';
        }
    }

    function setupProfileDropdown() {
        if (avatarTrigger && dropdownContent) {
            avatarTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('hidden');
                const isExpanded = avatarTrigger.getAttribute('aria-expanded') === 'true';
                avatarTrigger.setAttribute('aria-expanded', (!isExpanded).toString());
            });

            // Protege caso não exista profileContainer em algumas páginas
            document.addEventListener('click', (e) => {
                if (!profileContainer || !profileContainer.contains(e.target)) {
                    if (dropdownContent) dropdownContent.classList.add('hidden');
                    if (avatarTrigger) avatarTrigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    function updateHeader() {
        const user = checkLoginStatus();
        const loginAction = document.getElementById('login-action');
        const profileMenuContainer = document.getElementById('profile-menu-container');
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const profileAvatar = document.getElementById('profile-avatar');

        if (user) {
            if (loginAction) loginAction.classList.add('hidden');
            if (profileMenuContainer) profileMenuContainer.classList.remove('hidden');
            if (dropdownUserName) dropdownUserName.textContent = user.name.split(' ')[0];
            if (profileAvatar) profileAvatar.src = user.avatarUrl || defaultAvatar;
            if (logoutButton) logoutButton.onclick = handleLogout; // evita múltiplos listeners
        } else {
            if (loginAction) loginAction.classList.remove('hidden');
            if (profileMenuContainer) profileMenuContainer.classList.add('hidden');
            if (profileAvatar) profileAvatar.src = defaultAvatar;
        }
    }

    // --- 3. HANDLERS DE FORMULÁRIO ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name')?.value?.trim() || '';
            const email = document.getElementById('register-email')?.value?.trim() || '';
            const password = document.getElementById('register-password')?.value || '';

            if (!name || !email || !password) {
                if (registerMessage) {
                    registerMessage.textContent = 'Por favor preencha todos os campos.';
                    registerMessage.className = 'error-message';
                }
                return;
            }

            const users = JSON.parse(localStorage.getItem('devgames_users')) || [];
            if (users.find(u => u.email === email)) {
                if (registerMessage) {
                    registerMessage.textContent = 'Este e-mail já está cadastrado.';
                    registerMessage.className = 'error-message';
                }
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('devgames_users', JSON.stringify(users));

            if (registerMessage) {
                registerMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
                registerMessage.className = 'success-message';
            }

            registerForm.reset();
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value?.trim() || '';
            const password = document.getElementById('login-password')?.value || '';
            const users = JSON.parse(localStorage.getItem('devgames_users')) || [];

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem(USER_DATA_KEY, JSON.stringify({ name: user.name, email: user.email }));
                if (loginMessage) {
                    loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                    loginMessage.className = 'success-message';
                }
                setTimeout(() => { window.location.href = '../../index.html'; }, 1000);
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                if (loginMessage) {
                    loginMessage.textContent = 'E-mail ou senha inválidos.';
                    loginMessage.className = 'error-message';
                }
            }
        });
    }

    // --- 4. PÁGINA MINHA CONTA ---
    function renderAccountPage() {
        const user = checkLoginStatus();
        // Compatível com nova estrutura de perfil
        const loggedOutContent = document.getElementById('logged-out-content');
        const profileContent = document.getElementById('profile-content');

        if (user) {
            if (profileContent) profileContent.classList.remove('hidden');
            if (loggedOutContent) loggedOutContent.classList.add('hidden');
        } else {
            if (profileContent) profileContent.classList.add('hidden');
            if (loggedOutContent) loggedOutContent.classList.remove('hidden');
            // Não redireciona automaticamente; apenas mostra chamada para login
            if (loginButton) loginButton.onclick = () => { window.location.href = 'login.html'; };
        }
    }

    // --- 5. INICIALIZAÇÃO ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    renderHeader(isLoggedIn);
    setupProfileDropdown();
    updateHeader();

    if (document.querySelector('.account-page-content')) {
        renderAccountPage();
    }

});