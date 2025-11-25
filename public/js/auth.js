document.addEventListener('DOMContentLoaded', () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // ---------------------------------
    // LÓGICA DE CADASTRO (REGISTER)
    // ---------------------------------
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

=======

    // --- 1. REFERÊNCIAS DE ELEMENTOS (IDs de todas as páginas) ---
    // Header
    const loginContainer = document.getElementById('login-button-container');
    const profileContainer = document.getElementById('profile-menu-container');
    const logoutButton = document.getElementById('btn-logout');
    const avatarTrigger = document.querySelector('.avatar-trigger');
    const dropdownContent = document.getElementById('profile-dropdown-content');
    // 🚨 NOVO: Referência para o span que mostrará a saudação
    const welcomeSpan = document.querySelector('.dropdown-welcome'); 

    // Formulários
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');


    // --- 2. FUNÇÕES PRINCIPAIS DE AUTENTICAÇÃO ---

=======

    // --- 1. REFERÊNCIAS DE ELEMENTOS (IDs de todas as páginas) ---
    // Header
    const loginContainer = document.getElementById('login-button-container');
    const profileContainer = document.getElementById('profile-menu-container');
    const logoutButton = document.getElementById('btn-logout');
    const avatarTrigger = document.querySelector('.avatar-trigger');
    const dropdownContent = document.getElementById('profile-dropdown-content');
    // 🚨 NOVO: Referência para o span que mostrará a saudação
    const welcomeSpan = document.querySelector('.dropdown-welcome'); 

    // Formulários
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');


    // --- 2. FUNÇÕES PRINCIPAIS DE AUTENTICAÇÃO ---

>>>>>>> Stashed changes
    /**
     * @description Verifica o status de login e ajusta o header, incluindo o nome.
     * @param {boolean} isLoggedIn - True se o usuário estiver logado.
     */
    function renderHeader(isLoggedIn) {
        if (loginContainer && profileContainer) {
            if (isLoggedIn) {
                // Se logado: Esconde o botão de Login, mostra o Menu de Perfil
                loginContainer.classList.add('hidden');
                profileContainer.classList.remove('hidden');

                // 🚨 Lógica para mostrar o nome do usuário 🚨
                const userData = JSON.parse(localStorage.getItem('user_data'));
                // Pega apenas o primeiro nome, ou usa 'Usuário' como fallback
                const userName = userData ? userData.name.split(' ')[0] : 'Usuário'; 
                
                if(welcomeSpan) {
                    welcomeSpan.textContent = `Olá, ${userName}!`;
                }

            } else {
                // Se deslogado: Mostra o botão de Login, esconde o Menu de Perfil
                loginContainer.classList.remove('hidden');
                profileContainer.classList.add('hidden');
            }
        }
    }

    /**
     * @description Lógica de logoff: limpa o storage e redireciona.
     */
    function handleLogout() {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('user_data');
        window.location.href = "../../index.html"; 
    }

    /**
     * @description Lógica para alternar o menu dropdown de perfil.
     */
    function setupProfileDropdown() {
        if (avatarTrigger && dropdownContent) {
            avatarTrigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique feche imediatamente
                const isExpanded = avatarTrigger.getAttribute('aria-expanded') === 'true' || false;
                
                // Alterna a visibilidade do dropdown
                dropdownContent.classList.toggle('hidden');
                avatarTrigger.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Fechar o menu se clicar fora
            document.addEventListener('click', (e) => {
                if (!profileContainer.contains(e.target)) {
                    dropdownContent.classList.add('hidden');
                    avatarTrigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }


    // --- 3. LISTENERS PARA FORMULÁRIOS E BOTÕES ---

    // 3.1. CADASTRO
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
            // 1. Busca usuários existentes (simula a tabela do BD)
            let users = JSON.parse(localStorage.getItem('devgames_users')) || [];

            // 2. Verifica se o e-mail já está cadastrado
            if (users.find(user => user.email === email)) {
                registerMessage.textContent = 'Este e-mail já está cadastrado.';
                registerMessage.classList.remove('success-message');
                registerMessage.classList.add('error-message');
                return;
            }

            // 3. Simula o Hash da senha (armazenamos em texto puro apenas para a demo)
            const newUser = { name, email, password };

            // 4. Salva o novo usuário (simula INSERT no BD)
            users.push(newUser);
            localStorage.setItem('devgames_users', JSON.stringify(users));

            // 5. Feedback e redirecionamento
            registerMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            registerMessage.classList.remove('error-message');
            registerMessage.classList.add('success-message');
            
            // Limpa o formulário e redireciona após 2 segundos
            registerForm.reset();
            setTimeout(() => {
                window.location.href = 'login.html';
=======
            let users = JSON.parse(localStorage.getItem('devgames_users')) || [];

            if (users.find(user => user.email === email)) {
                registerMessage.textContent = 'Este e-mail já está cadastrado.';
                registerMessage.className = 'error-message';
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('devgames_users', JSON.stringify(users));

            registerMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            registerMessage.className = 'success-message';
            
            setTimeout(() => {
                window.location.href = 'login.html'; 
>>>>>>> Stashed changes
=======
            let users = JSON.parse(localStorage.getItem('devgames_users')) || [];

            if (users.find(user => user.email === email)) {
                registerMessage.textContent = 'Este e-mail já está cadastrado.';
                registerMessage.className = 'error-message';
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('devgames_users', JSON.stringify(users));

            registerMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            registerMessage.className = 'success-message';
            
            setTimeout(() => {
                window.location.href = 'login.html'; 
>>>>>>> Stashed changes
            }, 2000);
        });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // ---------------------------------
    // LÓGICA DE LOGIN
    // ---------------------------------
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // 1. Busca usuários (simula a tabela do BD)
            let users = JSON.parse(localStorage.getItem('devgames_users')) || [];

            // 2. Busca o usuário
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // SUCESSO: Simula a criação de um token de sessão
                localStorage.setItem('devgames_logged_in', 'true');
                localStorage.setItem('devgames_username', user.name);

                loginMessage.textContent = `Bem-vindo, ${user.name}! Acesso concedido.`;
                loginMessage.classList.remove('error-message');
                loginMessage.classList.add('success-message');
                
                // Redireciona para a página principal (index.html)
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1500);

            } else {
                // ERRO: Credenciais inválidas
                loginMessage.textContent = 'E-mail ou senha incorretos.';
                loginMessage.classList.remove('success-message');
                loginMessage.classList.add('error-message');
=======
    // 3.2. LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('devgames_users')) || [];
            
            const user = users.find(u => u.email === email && u.password === password);

=======
    // 3.2. LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('devgames_users')) || [];
            
            const user = users.find(u => u.email === email && u.password === password);

>>>>>>> Stashed changes
            if (user) {
                // Login bem-sucedido
                localStorage.setItem('isLoggedIn', 'true');
                // 🚨 IMPORTANTE: Salvando o nome do usuário no local storage
                localStorage.setItem('user_data', JSON.stringify({ name: user.name, email: user.email }));
                
                loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                loginMessage.className = 'success-message';
                
                setTimeout(() => {
                    window.location.href = '../../index.html'; 
                }, 1000);
            } else {
                // Credenciais inválidas
                localStorage.setItem('isLoggedIn', 'false');
                loginMessage.textContent = 'E-mail ou senha inválidos.';
                loginMessage.className = 'error-message';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            }
        });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // ---------------------------------
    // LÓGICA DE VERIFICAÇÃO DE SESSÃO
    // ---------------------------------
    const isLoggedIn = localStorage.getItem('devgames_logged_in') === 'true';
    const loginButton = document.querySelector('.main-header .btn-login');

    if (loginButton) {
        if (isLoggedIn) {
            // Se estiver logado, muda o botão para "Sair" e adiciona link
            const username = localStorage.getItem('devgames_username') || 'Usuário';
            loginButton.textContent = `Sair (${username})`;
            loginButton.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('devgames_logged_in');
                localStorage.removeItem('devgames_username');
                alert('Você saiu da sua conta.');
                window.location.reload(); // Recarrega a página para atualizar o botão
            };
        } else {
            // Se não estiver logado, o botão leva para a página de login
            loginButton.onclick = () => {
                window.location.href = 'login.html';
            };
=======
=======
>>>>>>> Stashed changes
    // 3.3. LOGOUT
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // --- 4. INICIALIZAÇÃO E EXECUÇÃO DE FUNÇÕES NO CARREGAMENTO ---

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    renderHeader(isLoggedIn);
    setupProfileDropdown();
    
    // 4.3. Verifica e Renderiza o estado da página Minha Conta (se os elementos existirem)
    if (document.querySelector('.account-page-content')) {
        if (!isLoggedIn) {
             window.location.href = 'login.html';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        }
    }
});