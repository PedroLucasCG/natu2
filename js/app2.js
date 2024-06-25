const pageIndexContainer = document.getElementsByClassName("pages")[0]
const indexTemp = document.getElementsByTagName("template")[1].content

const osContainer = document.getElementsByClassName("os-historico")[0];
const osTemp = document.getElementsByTagName("template")[0].content.childNodes[1]

function loadEntries(pageIndex = 1) {
    //Quantidade de itens exibidos por páginas
    const qtdItens = 5

    const items = osContainer.querySelectorAll("div[name='entry']")
    for (e in Array.from(items))
        items[e].remove()
    
    fetch('json/ordens.json')
        .then((response) => response.json())
        .then((data) => {
            //constrói os índices de navegação das páginas
            makeIndexes(data, qtdItens, pageIndex)

            const currentIndexes = pageIndexContainer.querySelectorAll('span[type="index"]')
            for (e in Array.from(currentIndexes)){
                if(currentIndexes[e].firstChild.data == pageIndex)
                    currentIndexes[e].classList.add("current")
            }
            //console.log(currentIndex)

            //constrói os elementos HTML das O.S.
            for (entry in data) {
                const ini = qtdItens * (pageIndex - 1)
                if (parseInt(entry) == ini + qtdItens) {
                    break
                }
                if (parseInt(entry) >= ini) {
                    c = 0
                    const os = data[entry]
                    const template = osTemp.cloneNode()
                    for (item in os) {
                        let span = osTemp.children[c].cloneNode()
                        span.innerText = os[item]
                        template.appendChild(span)
                        c++
                    }
                    osContainer.appendChild(template)
                }

            }
        })
}

function makeIndexes(data, qtdItens, pageIndex){
    let total = 0
    for (e in data)
        total++
    
    //Realiza a definição da quantidade de índices baseado na quantidade de entradas
    const numberOfIndexes = Math.floor(total/qtdItens) == total/qtdItens ? total/qtdItens : Math.floor(total/qtdItens)+1
    const template = indexTemp.cloneNode()
    
    let end = numberOfIndexes
    let start = pageIndex
    let range = 4
    if (numberOfIndexes <= range)
        range = numberOfIndexes-1
    
    if (pageIndex == numberOfIndexes){
        start = pageIndex - range

    } else if (pageIndex == 1){
        end = pageIndex + range

    } else if(pageIndex - Math.floor(range / 2) < 1){
        start = 1
        end = pageIndex + Math.floor(range / 2)+1

    }else if(pageIndex + Math.floor(range / 2) > numberOfIndexes){
        start = pageIndex - Math.floor(range / 2)-1
        end = numberOfIndexes

    }else{
        start = pageIndex - Math.floor(range / 2)
        end = pageIndex + Math.floor(range / 2)
    }
    
    for (let c = start; c <= end; c++){
        const item = indexTemp.children[0].cloneNode()
        item.innerText = c.toString()
        item.addEventListener('click', function (e) {
            loadEntries(pageIndex = c)
        })
        template.appendChild(item)
    }

    //navegação de volta para o primeiro item
    const goBackToFirst = indexTemp.children[0].cloneNode()
    goBackToFirst.innerHTML = "<span> << </span>"
    goBackToFirst.addEventListener ('click', function (e) {
        loadEntries(pageIndex = 1)
    })
    template.insertBefore(goBackToFirst, template.firstChild)

    //navegação para o último item
    const goToTheLast = indexTemp.children[0].cloneNode()
    goToTheLast.innerHTML = "<span> >> </span>"
    goToTheLast.addEventListener ('click', function (e) {
        loadEntries(pageIndex = numberOfIndexes)
    })
    template.insertBefore(goToTheLast, template.lastChild.nextSibling)

    pageIndexContainer.innerHTML = ""
    pageIndexContainer.appendChild(template)
}