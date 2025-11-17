document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------
    // LÓGICA DE CADASTRO (REGISTER)
    // ---------------------------------
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

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
            }, 2000);
        });
    }

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
            }
        });
    }

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
        }
    }
});