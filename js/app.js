function removeItem(item)
{
    let span = item.parentNode;
    span.remove();
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
    item.classList.toggle("selecionado")
    addColaborador(item)
}

function addColaborador(colaborador)
{
    const colaboradoresContainer = document.getElementsByClassName("colaboradores")[0].getElementsByTagName("div")[0];
    const template = document.getElementsByTagName("template")[0];
    
    let item = template.content.cloneNode(true).children[0];
    item.firstChild.nodeValue = colaborador.children[0].firstChild.data;

    colaboradoresContainer.appendChild(item);
}