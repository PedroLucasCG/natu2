const pageIndexContainer = document.getElementsByClassName("pages")[0]
const indexTemp = document.getElementsByTagName("template")[1].content

const osContainer = document.getElementsByClassName("os-historico")[0];
const osTemp = document.getElementsByTagName("template")[0].content.childNodes[1]

function loadEntries(pageIndex = 1) {
    const qtdItens = 1
    const items = osContainer.querySelectorAll("div[name='entry']")
    for (e in Array.from(items))
        items[e].remove()

    fetch('json/ordens.json')
        .then((response) => response.json())
        .then((data) => {
            makeIndexes(data, qtdItens)
            for (entry in data) {
                let ini = qtdItens * (pageIndex - 1)
                if (parseInt(entry) == ini + qtdItens) {
                    break
                }
                if (parseInt(entry) >= ini) {
                    c = 0
                    let os = data[entry]
                    let template = osTemp.cloneNode()
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

function makeIndexes(data, qtdItens){
    let c = 0
    for (e in data)
        c++
    let numberOfIndexes = Number.isInteger(c/qtdItens) ? c/qtdItens : Math.floor(c/qtdItens)+1
    const template = indexTemp.cloneNode()
    for (let c = 1; c <= numberOfIndexes; c++){
        const item = indexTemp.children[0].cloneNode()
        item.innerText = c.toString()
        item.addEventListener('click', function (e) {
            loadEntries(pageIndex = c)
        })
        template.appendChild(item)
    }
    pageIndexContainer.innerHTML = ""
    pageIndexContainer.appendChild(template)
}