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