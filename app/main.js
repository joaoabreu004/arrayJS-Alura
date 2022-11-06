let livros = [];
const endPointApi = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';
getBuscarLivroApi()


const elementoComValorTotalDeLivrosDisponiveis = document.querySelector('#valor_total_livros_disponiveis')
const elementoParaInserirLivros = document.querySelector('#livros')


//FUNÇÃO ASSÍNCRONA
async function getBuscarLivroApi() {
    //ESPERE POR UMA PROMESSA
    const res = await fetch(endPointApi);
    livros = await res.json();

    let livrosComDescontos = aplicarDescontos(livros)
    console.table(livros);
    exibirOsLivrosNaTela(livrosComDescontos);
}


//MÉTODO FOR EACH
function exibirOsLivrosNaTela(listaDeLivros) {
    elementoComValorTotalDeLivrosDisponiveis.innerHTML = ''
    elementoParaInserirLivros.innerHTML = ''
    listaDeLivros.forEach(livro => {
        // let disponibilidade = verificarDisponibilidadeDoLivro(livro);
        //OPERADOR TERNÁRIO
        let disponibilidade = livro.quantidade > 0 ? 'livro_imagens' : 'livro_imagens indisponivel' 
        elementoParaInserirLivros.innerHTML += `
        <div class="livro">
            <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
            <h2 class="livro__titulo">
                Cangaceiro JavaScript:
                Uma aventura no sertão da programação
            </h2>
            <p class="livro__descricao">${livro.autor}</p>
            <p class="livro__preco" id="preco">${livro.preco.toFixed(2)}</p>
            <div class="tags">
                <span class="tag">${livro.categoria}</span>
            </div>
        </div>
        `
    });
}

// function verificarDisponibilidadeDoLivro(livro){
//     //IF TRADICIONAL
//     if(livro.quantidade > 0){
//         return 'livro_imagens'
//     }else{
//         return 'livro_imagens indisponivel'
//     }
// }


//MÉTODO MAP
function aplicarDescontos(livros){
    const desconto = 0.3; 
    livrosComDesconto = livros.map(livro => {
        //RETORNO DO MÉTODO MAP
        return{...livro, preco: livro.preco - (livro.preco * desconto)}; 
    }); 

    //RETORNO DA FUNÇÃO!
    return livrosComDesconto; 
}


//MÉTODO FILTER!
const botoes = document.querySelectorAll('.btn'); 
botoes.forEach(btn =>  btn.addEventListener('click', filtrarLivros))

function filtrarLivros(){
    //THIS MOSTRAR QUE ESSE É O ID DO BOTÃO CLICADO!
    const elementBtn = document.getElementById(this.id)
    let categoria = elementBtn.value; 
    let livrosFiltrados = categoria == 'disponivel' ? filtrarPorDisponibilidade() : filtrarPorCategoria(categoria); 
    exibirOsLivrosNaTela(livrosFiltrados)
    if(categoria == 'disponivel'){
        const valorTotal = calcularValorTotalDeLivrosDisponiveis(livrosFiltrados); 
        console.log(valorTotal)
        exibirValorTotalDosLivrosDisponiveisNaTela(valorTotal)
    } 
}

function filtrarPorCategoria(categoria) {
    return livros.filter(livro => livro.categoria == categoria);
}

function filtrarPorDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0);
}

function exibirValorTotalDosLivrosDisponiveisNaTela(valorTotal){
    elementoComValorTotalDeLivrosDisponiveis.innerHTML = `
     <div class="livros__disponiveis">
        <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
     </div>
    `
}


//MÉTODO REDUCE

function calcularValorTotalDeLivrosDisponiveis(livros) {
    return livros.reduce((acumulador, livro) => acumulador + livro.preco, 0).toFixed(2)
}