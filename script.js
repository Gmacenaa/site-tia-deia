const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('rolou');
    } else {
        header.classList.remove('rolou');
    }
});

const btnVerMais = document.getElementById('btn-ver-mais');

if (btnVerMais) {
    btnVerMais.addEventListener('click', () => {
        const produtosExtras = document.querySelectorAll('.produto-extra');
        const estaExpandido = btnVerMais.classList.contains('expandido');

        produtosExtras.forEach(card => {
            card.classList.toggle('escondido');
        });

        if (estaExpandido) {
            btnVerMais.textContent = 'Ver Mais Produtos';
        } else {
            btnVerMais.textContent = 'Ver Menos Produtos';
        }

        btnVerMais.classList.toggle('expandido');
    });
}

const botaohamburguer = document.getElementById('botao-hamburguer');

const navPrincipal = document.getElementById('nav-principal');

if (botaohamburguer && navPrincipal) {
    botaohamburguer.addEventListener('click', () => {
        navPrincipal.classList.toggle('aberto');
        botaohamburguer.classList.toggle('aberto');

    });

}

let carrinho = [];

const botaoCarrinho = document.getElementById('botao-carrinho');
const painelCarrinho = document.getElementById('painel-carrinho');
const overlayCarrinho = document.getElementById('overlay-carrinho');
const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const contadorCarrinho = document.getElementById('contador-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
const botoesComprar = document.querySelectorAll('.botao-comprar');

function abrirCarrinho() {
    painelCarrinho.classList.add('aberto');
    overlayCarrinho.classList.add('aberto');
}

function fecharPanielCarrinho() {
    painelCarrinho.classList.remove('aberto');
    overlayCarrinho.classList.remove('aberto');
}

if (botaoCarrinho) botaoCarrinho.addEventListener('click', abrirCarrinho);
if (fecharCarrinhoBtn) fecharCarrinhoBtn.addEventListener('click', fecharPanielCarrinho);
if (overlayCarrinho) overlayCarrinho.addEventListener('click', fecharPanielCarrinho);

function adicionarAoCarrinho(nome, preco, quantidade) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ nome, preco, quantidade: quantidade });
    }

    renderizarCarrinho();
}

function renderizarCarrinho() {
    listaCarrinho.innerHTML = '';

    let totalItens = 0;
    let totalPreco = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalItens += item.quantidade;
        totalPreco += subtotal;

        const div = document.createElement('div');
        div.classList.add('item-carrinho');
        div.innerHTML = `
            <div class="item-info">
                <span class="item-nome">${item.nome}</span>
                <span class="item-preco">R$ ${item.preco.toFixed(2)} cada</span>
            </div>
            <div class="item-controles">
                <button class="btn-diminuir" data-nome="${item.nome}">-</button>
                <span class="item-quantidade">${item.quantidade}</span>
                <button class="btn-aumentar" data-nome="${item.nome}">+</button>
                <button class="btn-remover" data-nome="${item.nome}">🗑️</button>
            </div>
        `;
        listaCarrinho.appendChild(div);
    });

    contadorCarrinho.textContent = totalItens;

    const MINIMO_POR_SABOR = 25;
    const avisoMinimo = document.getElementById('aviso-minimo');

const itemAbaixoDoMinimo = carrinho.find(item => item.quantidade < MINIMO_POR_SABOR);

if (carrinho.length === 0 || itemAbaixoDoMinimo) {
    avisoMinimo.textContent = `Cada sabor precisa ter o minimo ${MINIMO_POR_SABOR} unidades`;
    avisoMinimo.style.display = 'block';
    btnFinalizarPedido.classList.add('desabilitado');
    btnFinalizarPedido.style.pointerEvents = 'none';
} else {
    avisoMinimo.style.display = 'none';
    btnFinalizarPedido.classList.remove('desabilitado');
    btnFinalizarPedido.classList.pointerEvents = 'auto';
}

    totalCarrinho.textContent = `R$ ${totalPreco.toFixed(2)}`;

    let mensagem = "Olá Gostaria de Fazer o seguinte pedido: \n\n";

    carrinho.forEach(item => {
        mensagem += `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });

    mensagem += `\nTotal: R$ ${totalPreco.toFixed(2)}`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    const numeroWhatsApp = "5518997535970";
    btnFinalizarPedido.href = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
}

listaCarrinho.addEventListener('click', (e) => {
    const nome = e.target.dataset.nome;
    if (!nome) return;

    const item = carrinho.find(i => i.nome === nome);
    if (!item) return;

    if (e.target.classList.contains('btn-aumentar')) {
        item.quantidade++;
    }

    if (e.target.classList.contains('btn-diminuir')) {
        item.quantidade--;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.nome !== nome);
        }
    }

    if (e.target.classList.contains('btn-remover')) {
        carrinho = carrinho.filter(i => i.nome !== nome);
    }


    renderizarCarrinho();

});

botoesComprar.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const nomeProduto = botao.dataset.produto;
        const precoProduto = Number(botao.dataset.preco);
        const input = document.querySelector(`.input-quantidade[data-produto="${nomeProduto}"]`);
        const quantidade = Number(input.value);

        if (quantidade <=0) return;

        adicionarAoCarrinho(nomeProduto, precoProduto, quantidade);
        input.value = 0;
    });
});

document.querySelectorAll('.btn-aumentar-card').forEach(botao => {
    botao.addEventListener('click', () => {
        const input = document.querySelector(`.input-quantidade[data-produto="${botao.dataset.produto}"]`);
        input.value = Number(input.value) + 1;
    });
});

document.querySelectorAll('.btn-diminuir-card').forEach(botao => {
    botao.addEventListener('click', () => {
      const input = document.querySelector(`.input-quantidade[data-produto="${botao.dataset.produto}"]`);
      const novoValor = Number(input.value) - 1;
      input.value = novoValor < 0 ? 0 : novoValor;
    });
});