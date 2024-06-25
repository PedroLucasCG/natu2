//container dos indexes das páginas de O.S.
const pageIndexContainer = document.getElementsByClassName("pages")[0]
//Template dos indexes
const indexTemp = document.getElementsByTagName("template")[1].content

//Container das ordens de serviço
const osContainer = document.getElementsByClassName("os-historico")[0];
//Template das ordens de serviço
const osTemp = document.getElementsByTagName("template")[0].content.childNodes[1]

function loadEntries(pageIndex = 1) {
    //Quantidade de itens exibidos por páginas
    const qtdItens = 5

    //Remove a as ordens de serviço exibidas na página anterior
    const items = osContainer.querySelectorAll("div[name='entry']")
    for (e in Array.from(items))
        items[e].remove()
    
    fetch('json/ordens.json')
        .then((response) => response.json())
        .then((data) => {
            //Constrói os índices de navegação das páginas
            makeIndexes(data, qtdItens, pageIndex)

            //Marca o index selecionado na exibição
            const currentIndexes = pageIndexContainer.querySelectorAll('span[type="index"]')
            for (e in Array.from(currentIndexes)){
                if(currentIndexes[e].firstChild.data == pageIndex)
                    currentIndexes[e].classList.add("current")
            }

            //Constrói os elementos HTML das O.S.
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
    
    //Define quantos itens são exibidos em tela dependendo do número de indices e o range (número de indexes exibidos além do atual)
    let end = numberOfIndexes
    let start = pageIndex
    let range = 4

    //Caso o número de index for menor ou igual ao range é calculado um range fixo indenpendente do especificado acima
    if (numberOfIndexes <= range)
        range = numberOfIndexes - 1
    
    /*
    *Sequência de condicionais que lidam com diferetes casos
    *Primeira: checa se o index atual é o último, se for o range se expande totalmente a esquerda do index atual
    *Segunda: verifica se o index atual é o primeiro, se for o range se expande totalmente a direita do index atual
    *Terceira e quarta: verifica se o index atual se localiza próximo a uma extremidade impossibilitando ele se localizar no meio, o início, ou o fim é mantido no primeiro item
    e o fim, ou início, é o index atual mais/menos a metade do range +/- 1, mantendo o range especificado de intens na tela
    *O else lida é quando o index atual está localizado a uma distância que possibilita ele ficar no meio, range/2 para esqueda e para a direita
    */
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

    //Navegação para o primeiro item
    const goBackToFirst = indexTemp.children[0].cloneNode()
    goBackToFirst.innerHTML = "<span> << </span>"
    goBackToFirst.addEventListener ('click', function (e) {
        loadEntries(pageIndex = 1)
    })
    template.insertBefore(goBackToFirst, template.firstChild)

    //Navegação para o último item
    const goToTheLast = indexTemp.children[0].cloneNode()
    goToTheLast.innerHTML = "<span> >> </span>"
    goToTheLast.addEventListener ('click', function (e) {
        loadEntries(pageIndex = numberOfIndexes)
    })
    template.insertBefore(goToTheLast, template.lastChild.nextSibling)

    pageIndexContainer.innerHTML = ""
    pageIndexContainer.appendChild(template)
}