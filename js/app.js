let colaboradoresInserted = [];
const updateColaboradoresInserted = function (data) {
    colaboradoresInserted = colaboradoresInserted.filter(item => {
        return item != data
    })
}

function removeItem(item)
{
    let data = item.previousSibling.data
    updateColaboradoresInserted(data)

    const lista = document.getElementsByClassName("lista")[0].getElementsByTagName("section")[0].children
    let aux;
    Array.from(lista).forEach(item => {
        if(item.children[0].firstChild.data == data) aux = item
    })

    let span = item.parentNode
    span.remove()
    toggleColaborador(aux)
}

function closeWindow(window)
{
    window = window.parentNode.parentNode
    window.classList.toggle("fechar")
}

function openWindow()
{
    let win = document.getElementsByClassName("pesquisar-colaboradores")[0]
    win.classList.toggle("fechar")
}

function toggleColaborador(item)
{
    let add = true
    if(item.classList[0])
        add = false
    item.classList.toggle("selecionado")
    if (add)
    {
        addColaborador(item)
    }
    else
    {
        const container = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("div")[0].children
        Array.from(container).forEach(child =>{
            if(child.firstChild.data == item.children[0].firstChild.data)
                child.remove()
                updateColaboradoresInserted(child.firstChild.data)
        })
    }

}

function addColaborador(colaborador)
{
    const colaboradoresContainer = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("div")[0]
    const template = document.getElementsByTagName("template")[0]
    const data = colaborador.children[0].firstChild.data

    if(colaboradoresInserted.includes(data)) return;

    let item = template.content.cloneNode(true).children[0]
    item.firstChild.nodeValue = data
    colaboradoresContainer.appendChild(item)

    colaboradoresInserted.push(data)
}