document.addEventListener('DOMContentLoaded', () => {

    const USER_DATA_KEY = 'devgames_active_user';
    const ACCOUNT_PAGE_PATH = 'myAccount.html'; // Nome do seu arquivo de conta
    
    // ---------------------------------
    // FUNÇÕES DE AUTENTICAÇÃO
    // ---------------------------------

    // Verifica o status de login e retorna os dados do usuário se logado
    const checkLoginStatus = () => {
        const userString = localStorage.getItem(USER_DATA_KEY);
        // Retorna o objeto do usuário (nome, email, etc.) ou null
        return userString ? JSON.parse(userString) : null; 
    };

    // Função para limpar o storage e deslogar
    const handleLogout = () => {
        localStorage.removeItem(USER_DATA_KEY);
        // Redireciona para a página principal. Ajuste o caminho se necessário (ex: './index.html')
        window.location.href = '../../index.html'; 
    };
    
    // ---------------------------------
    // LÓGICA DO MENU DROPDOWN
    // ---------------------------------

    // Função para alternar a visibilidade do dropdown
    const toggleDropdown = () => {
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    };
    
    // Atualiza o header (Mostra/Esconde Login ou Avatar/Menu)
    const updateHeader = () => {
        const user = checkLoginStatus();
        const loginAction = document.getElementById('login-action');
        const profileMenuContainer = document.getElementById('profile-menu-container');
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const logoutButton = document.getElementById('logout-button');
        const profileAvatar = document.getElementById('profile-avatar');
        const avatarButton = document.getElementById('profile-avatar-button');

        // Garante que os elementos do cabeçalho existam
        if (loginAction && profileMenuContainer && avatarButton) {
            if (user) {
                // LOGADO: Mostra Avatar/Menu, esconde Login
                loginAction.classList.add('hidden');
                profileMenuContainer.classList.remove('hidden');
                
                // Define o nome (exibe apenas o primeiro nome)
                dropdownUserName.textContent = user.name.split(' ')[0]; 
                
                // Define o avatar (mock de imagem ou default)
                // Se o usuário não tiver uma URL de avatar salva no mock, usa a imagem genérica
                profileAvatar.src = user.avatarUrl || '../assets/images/icons/default-avatar.png'; 

                // 1. Configura o botão Sair
                if (logoutButton) {
                    logoutButton.addEventListener('click', handleLogout);
                }
                
                // 2. Configura o clique no Avatar para abrir o Dropdown
                avatarButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique feche o menu imediatamente
                    toggleDropdown();
                });
                
                // 3. Configura o clique global para fechar o menu
                document.addEventListener('click', (event) => {
                    const dropdown = document.getElementById('profile-dropdown');
                    
                    // Se o clique não foi no container do menu e o menu está aberto, feche
                    if (dropdown && !profileMenuContainer.contains(event.target) && !dropdown.classList.contains('hidden')) {
                        dropdown.classList.add('hidden');
                    }
                });

            } else {
                // DESLOGADO: Mostra Login, esconde Avatar/Menu
                loginAction.classList.remove('hidden');
                profileMenuContainer.classList.add('hidden');
            }
        }
    };
    
    // ---------------------------------
    // LÓGICA DE LOGIN (SALVA DADOS)
    // ---------------------------------
    
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de login bem-sucedido:
            const emailInput = document.getElementById('login-email').value;
            // Cria um nome simples a partir do e-mail
            const mockName = emailInput ? emailInput.split('@')[0].toUpperCase() : "Usuário"; 

            // Dados do usuário (mock)
            const mockUser = { 
                name: mockName, 
                email: emailInput,
                avatarUrl: '', // URL da foto de perfil (vazio para usar a default)
            };

            // PASSO ESSENCIAL: SALVA OS DADOS NO LOCAL STORAGE
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));
            
            // Redireciona para a página Minha Conta
            window.location.href = ACCOUNT_PAGE_PATH; 
        });
    }

    // ---------------------------------
    // RENDERIZAÇÃO DA PÁGINA MINHA CONTA (Tracker)
    // ---------------------------------
    
    const renderAccountPage = () => {
        const user = checkLoginStatus();
        const loggedInContent = document.getElementById('logged-in-content');
        const loggedOutContent = document.getElementById('logged-out-content');

        if (user) {
            // Usuário Logado: Mostra o Rastreador
            if (loggedInContent) loggedInContent.classList.remove('hidden');
            if (loggedOutContent) loggedOutContent.classList.add('hidden');
        } else {
            // Usuário Deslogado: Mostra a Mensagem de Login
            if (loggedInContent) loggedInContent.classList.add('hidden');
            if (loggedOutContent) loggedOutContent.classList.remove('hidden');
        }
    };

    // ---------------------------------
    // INICIALIZAÇÃO
    // ---------------------------------
    
    // 1. Atualiza o header em TODAS as páginas
    updateHeader();

    // 2. Chama a renderização apenas na página Minha Conta
    if (document.querySelector('.account-page-content')) {
        renderAccountPage();
    }
});

