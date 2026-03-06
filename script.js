// script.js - Funções compartilhadas do sistema

// Dados simulados (em produção, viriam do backend)
let usuarios = {
    admin: { id: 1, nome: "Administrador", email: "admin@terreiro.com", senha: "admin123", perfil: "admin" },
    joao: { id: 2, nome: "João de Oxóssi", email: "joao@email.com", senha: "123456", perfil: "medium", tipo: "Médium de Consulta", contatoEmergencia: "(13) 99999-9999" },
    roberto: { id: 3, nome: "Roberto Silva", email: "roberto@email.com", senha: "123456", perfil: "socio", status: "adimplente" },
    juliana: { id: 4, nome: "Juliana Santos", email: "juliana@email.com", senha: "123456", perfil: "nao_socio" },
    recepcao: { id: 5, nome: "Recepção", email: "recepcao@terreiro.com", senha: "123456", perfil: "atendente" }
};

let mediuns = [
    { id: 1, nome: "João de Oxóssi", nomeEspiritual: "Caboclo Sete Flechas", foto: "👨", tipo: "Médium de Consulta", telefone: "(13) 99999-9999", contatoEmergencia: "Maria - (13) 98888-8888" },
    { id: 2, nome: "Maria de Iemanjá", nomeEspiritual: "Cabocla Jurema", foto: "👩", tipo: "Médium de Consulta", telefone: "(13) 98888-8888", contatoEmergencia: "João - (13) 97777-7777" },
    { id: 3, nome: "Carlos Ogan", nomeEspiritual: "Ogan", foto: "🥁", tipo: "Ogan", telefone: "(13) 97777-7777", contatoEmergencia: "Ana - (13) 96666-6666" },
    { id: 4, nome: "Ana em Desenvolvimento", nomeEspiritual: "Médium em Desenvolvimento", foto: "👧", tipo: "Desenvolvimento", telefone: "(13) 96666-6666", contatoEmergencia: "Carlos - (13) 95555-5555" }
];

let giras = [
    { id: 1, data: "2026-03-09", tipo: "Gira de Caboclos", horario: "20:00", linha: "Oxóssi", mediunsConfirmados: [1, 2], vagas: 10 },
    { id: 2, data: "2026-03-11", tipo: "Gira de Pretos Velhos", horario: "20:00", linha: "Pai Benedito", mediunsConfirmados: [3], vagas: 8 },
    { id: 3, data: "2026-03-16", tipo: "Gira de Iemanjá", horario: "19:30", linha: "Rainha do Mar", mediunsConfirmados: [2], vagas: 12 }
];

let socios = [
    { id: 1, nome: "Roberto Silva", email: "roberto@email.com", telefone: "(13) 95555-5555", status: "adimplente", pagamento: "2026-03-01" }
];

let consultas = [
    { id: 1, data: "2026-03-09", giraId: 1, consulente: "Roberto Silva", tipo: "socio", mediumId: 1, status: "agendado" },
    { id: 2, data: "2026-03-11", giraId: 2, consulente: "Juliana Santos", tipo: "nao_socio", mediumId: 2, status: "agendado" }
];

let atendimentos = [
    { id: 1, consultaId: 1, chamada: null, entrada: null, saida: null, duracao: null }
];

// Funções de utilidade
function formatarData(data) {
    return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR');
}

function formatarDataHora(dataHora) {
    return new Date(dataHora).toLocaleString('pt-BR');
}

function mostrarAlerta(mensagem, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensagem;
    
    const main = document.querySelector('.sistema-main');
    main.insertBefore(alerta, main.firstChild);
    
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

// Funções de autenticação
function fazerLogin(email, senha) {
    for (let key in usuarios) {
        if (usuarios[key].email === email && usuarios[key].senha === senha) {
            localStorage.setItem('usuario', JSON.stringify(usuarios[key]));
            return usuarios[key];
        }
    }
    return null;
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}

function getUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

function verificarAutenticacao(perfisPermitidos = []) {
    const usuario = getUsuarioLogado();
    
    if (!usuario) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (perfisPermitidos.length > 0 && !perfisPermitidos.includes(usuario.perfil)) {
        window.location.href = 'index.html';
        return false;
    }
    
    return usuario;
}

// Funções para médiuns
function getMediuns() {
    return mediuns;
}

function getMediunsPorTipo(tipo) {
    return mediuns.filter(m => m.tipo === tipo);
}

function confirmarPresenca(mediumId, giraId) {
    const gira = giras.find(g => g.id === giraId);
    if (gira) {
        if (!gira.mediunsConfirmados.includes(mediumId)) {
            gira.mediunsConfirmados.push(mediumId);
            return true;
        }
    }
    return false;
}

// Funções para giras
function getGiras() {
    return giras.sort((a, b) => new Date(a.data) - new Date(b.data));
}

function getGirasDoMes(mes, ano) {
    return giras.filter(g => {
        const data = new Date(g.data + 'T12:00:00');
        return data.getMonth() === mes && data.getFullYear() === ano;
    });
}

function adicionarGira(gira) {
    gira.id = giras.length + 1;
    giras.push(gira);
    return gira;
}

// Funções para consultas
function getConsultas() {
    return consultas.sort((a, b) => new Date(a.data) - new Date(b.data));
}

function getConsultasPorData(data) {
    return consultas.filter(c => c.data === data);
}

function getConsultasPorConsulente(consulente) {
    return consultas.filter(c => c.consulente === consulente);
}

function agendarConsulta(consulta) {
    // Verificar disponibilidade
    const consultasNoDia = getConsultasPorData(consulta.data);
    const gira = giras.find(g => g.id === consulta.giraId);
    
    if (consultasNoDia.length >= gira.vagas) {
        return { sucesso: false, mensagem: "Não há vagas disponíveis nesta gira" };
    }
    
    consulta.id = consultas.length + 1;
    consulta.status = "agendado";
    consultas.push(consulta);
    
    // Criar registro de atendimento
    atendimentos.push({
        id: atendimentos.length + 1,
        consultaId: consulta.id,
        chamada: null,
        entrada: null,
        saida: null,
        duracao: null
    });
    
    return { sucesso: true, consulta };
}

// Funções para atendimento
function chamarConsulta(atendimentoId) {
    const atendimento = atendimentos.find(a => a.id === atendimentoId);
    if (atendimento) {
        atendimento.chamada = new Date().toISOString();
        return true;
    }
    return false;
}

function iniciarAtendimento(atendimentoId) {
    const atendimento = atendimentos.find(a => a.id === atendimentoId);
    if (atendimento && atendimento.chamada) {
        atendimento.entrada = new Date().toISOString();
        return true;
    }
    return false;
}

function finalizarAtendimento(atendimentoId) {
    const atendimento = atendimentos.find(a => a.id === atendimentoId);
    if (atendimento && atendimento.entrada) {
        atendimento.saida = new Date().toISOString();
        const entrada = new Date(atendimento.entrada);
        const saida = new Date(atendimento.saida);
        atendimento.duracao = Math.round((saida - entrada) / 60000); // duração em minutos
        return true;
    }
    return false;
}

// Funções para sócios
function getSocios() {
    return socios;
}

function verificarAdimplencia(socioId) {
    const socio = socios.find(s => s.id === socioId);
    return socio ? socio.status === "adimplente" : false;
}

function confirmarPagamento(socioId) {
    const socio = socios.find(s => s.id === socioId);
    if (socio) {
        socio.status = "adimplente";
        socio.pagamento = new Date().toISOString().split('T')[0];
        return true;
    }
    return false;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há usuário logado
    const usuario = getUsuarioLogado();
    
    if (usuario) {
        // Atualizar informações do header
        const nomeElement = document.getElementById('usuario-nome');
        const perfilElement = document.getElementById('usuario-perfil');
        
        if (nomeElement) nomeElement.textContent = usuario.nome;
        if (perfilElement) {
            const perfis = {
                admin: "Administrador",
                medium: "Médium",
                socio: "Sócio",
                nao_socio: "Consulente",
                atendente: "Atendente"
            };
            perfilElement.textContent = perfis[usuario.perfil];
        }
    }
});