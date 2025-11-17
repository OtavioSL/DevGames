/**
 * utils.js
 * Funções auxiliares e de status.
 */

// Função para formatar a data/hora do sistema
export const formatSystemTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Função para atualizar o status do sistema no footer
export const updateSystemStatus = (element) => {
    if (element) {
        element.textContent = `Status: Online. Última atualização: ${formatSystemTime()}`;
    }
};

// Função para simular uma chamada de API (assíncrona)
export const fetchData = async (endpoint) => {
    console.log(`Simulando requisição GET para: ${endpoint}`);
    // Na vida real, seria um fetch() ou axios
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                data: `Dados mockados do ${endpoint}` 
            });
        }, 500);
    });
};