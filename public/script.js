const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-db-btn');
const responseOutput = document.getElementById('response-output');
const statusCode = document.getElementById('status-code');

// Função para preencher o formulário a partir da documentação
window.fillForm = (method, endpoint, bodyId = null) => {
    document.getElementById('method').value = method;
    document.getElementById('endpoint').value = endpoint;
    if (bodyId) {
        const bodyContent = document.getElementById(bodyId).innerText;
        document.getElementById('request-body').value = bodyContent;
    } else {
        document.getElementById('request-body').value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Função específica para preencher logs com a data de hoje
window.fillTodayLogs = () => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    window.fillForm('GET', `/logs?data=${today}`);
};

// Resetar banco de dados
resetBtn.addEventListener('click', async () => {
    if (!confirm('Deseja realmente resetar o banco de dados?')) return;
    try {
        const response = await fetch('/reset', { method: 'POST' });
        const data = await response.json();
        alert(data.mensagem);
    } catch (error) {
        alert('Erro ao resetar banco: ' + error.message);
    }
});

sendBtn.addEventListener('click', async () => {
    const method = document.getElementById('method').value;
    const endpoint = document.getElementById('endpoint').value;
    const token = document.getElementById('token').value;
    const bodyText = document.getElementById('request-body').value;

    responseOutput.textContent = "Carregando...";
    statusCode.textContent = "PROCESSANDO...";
    statusCode.style.background = "#94a3b8";

    try {
        const options = {
            method: method,
            headers: {}
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (method !== 'GET' && bodyText) {
            options.headers['Content-Type'] = 'application/json';
            options.body = bodyText;
        }

        const response = await fetch(endpoint, options);
        
        // Verifica se é um PDF
        const contentType = response.headers.get('Content-Type');
        
        if (contentType && contentType.includes('application/pdf')) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            statusCode.textContent = `${response.status} OK (PDF Baixado)`;
            statusCode.style.background = "#22c55e";
            responseOutput.textContent = '{ "mensagem": "Arquivo PDF gerado e baixado com sucesso." }';
            return;
        }

        const data = await response.json();

        // Atualiza status
        statusCode.textContent = `${response.status} ${response.statusText}`;
        statusCode.style.background = response.ok ? "#22c55e" : "#ef4444";

        responseOutput.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        statusCode.textContent = "ERRO";
        statusCode.style.background = "#ef4444";
        responseOutput.textContent = error.message;
    }
});
