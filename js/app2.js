let pageIndexContainer = document.getElementsByClassName("pages")[0]
let indexTemp = pageIndexContainer.getElementsByTagName("template")[0].content

let osContainer = document.getElementsByClassName("os-historico")[0];
let osTemp = document.getElementsByTagName("template")[0].content.childNodes[1]

function loadEntries(qtdItens = 3, pageIndex = 1) {
    let items = osContainer.querySelectorAll("div[name='entry']")
    for (e in Array.from(items))
        items[e].remove()

    fetch('json/ordens.json')
        .then((response) => response.json())
        .then((data) => {
            for (entry in data) {
                let ini = qtdItens * (pageIndex - 1)
                if (parseInt(entry) == ini + qtdItens) {
                    break
                }
                if (parseInt(entry) >= ini) {
                    c = 0
                    let os = data[entry]
                    let template = osTemp.cloneNode();
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