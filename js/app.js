
//Acessa o menu de navegação de colaboradores através do tab e enter
let add = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("span")[0]
add.addEventListener('keypress', function (e) {
    openWindow()
})

//Array que contém os colaboradores inseridos
let colaboradoresInserted = [];

//Remove os colaboradores retirados da lista de colaboradores inseridos
const updateColaboradoresInserted = function (data) {
    colaboradoresInserted = colaboradoresInserted.filter(item => {
        return item != data
    })
}

//Remove colaboradores selecionados
function removeItem(item) {
    let data = item.previousSibling.data
    updateColaboradoresInserted(data)

    const lista = document.getElementsByClassName("lista")[0].getElementsByTagName("section")[0].children
    let aux;
    Array.from(lista).forEach(item => {
        if (item.children[0].firstChild.data == data) aux = item
    })

    let span = item.parentNode
    span.remove()
    toggleColaborador(aux)
}

//Fecha a tela de seleção de colaboradores
function closeWindow(window) {
    window = window.parentNode.parentNode
    window.classList.toggle("fechar")
}

//Abre a tela de colaboradores
function openWindow() {
    let win = document.getElementsByClassName("pesquisar-colaboradores")[0]
    win.classList.toggle("fechar")
}

//Adiciona ou retira o colaborador de maneira dinâmica
function toggleColaborador(item) {
    let add = true
    if (item.classList[0])
        add = false
    item.classList.toggle("selecionado")
    if (add) {
        addColaborador(item)
    }
    else {
        removeColaborador(item)
    }

}

function removeColaborador(item) {
    const container = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("div")[0].children
    Array.from(container).forEach(child => {
        if (child.firstChild.data == item.children[0].firstChild.data)
            child.remove()
        updateColaboradoresInserted(child.firstChild.data)
    })
}

function addColaborador(colaborador) {
    const colaboradoresContainer = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("div")[0]
    const template = document.getElementsByTagName("template")[0]
    const data = colaborador.children[0].firstChild.data

    if (colaboradoresInserted.includes(data)) return;

    let item = template.content.cloneNode(true).children[0]
    item.firstChild.nodeValue = data
    colaboradoresContainer.appendChild(item)

    colaboradoresInserted.push(data)
}