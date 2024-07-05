/* TO DOs
-> incorporar exclusão por range de seleção
-> considerar a exclusaão para frente inputType=="deleteContentFoward"
-> incorporar, ou impedir, a inserção por copy paste
*/

const input = document.querySelectorAll('input[mask-type="periodoMask"]')
const mask = "__/__/____ __:__"
var resultStr = ""
var previousString = mask

//Confere se os valores são válidos em suas posições
const isValid = function (input, caret) {
    input = Array.from(input.slice(0, caret--))

    const length = input.length
    const char = Number.parseInt(input[caret])

    switch (length) {
        case 1:
            if (char > 3) return false
            break

        case 2:
            if (Number.parseInt(input.slice(0, 2).join("")) > 31) return false;
            break;

        case 4:
            if (char > 1) return false
            break

        case 5:
            if (Number.parseInt(input.slice(3, 5).join("")) > 12) return false;
            break;

        case 12:
            if (char > 2) return false
            break;

        case 13:
            if (Number.parseInt(input.slice(11, 13).join("")) > 23) return false;
            break;

        case 15:
            if (char > 5) return false
            break;
    }
    return true
}

//reponsável por retirar os placeholdres de valores (caractere '_') dos vetores de grupos de data/hora
const dateTimeMap = function (group, groupMask) {
    let field = Array.from(group)
    let removeNext = false

    for (char in field) {
        //verifica a possibilida de remoção do caratere, se não é um número ou se sua posição é válida (caso a quantidade de carcteres no grupo é igual ao da máscara)
        if (
            !isNaN(field[char])
            && !removeNext
            && field.length > groupMask.length
        ) {
            removeNext = true
        }

        //substitui os caracteres por ""
        if (
            field[char] == "_"
            && removeNext
        ) {
            field[char] = ""
            removeNext = false
        }

    }
    //filtra o output da for{}
    field = field.filter((char) => { return char != "" })
    //retira qualquer resto
    field = field.slice(0, groupMask.length)

    return field
}

//função principal de aplicação da máscara de input
const maskInput = function (e) {
    let input = e.target.value
    let caret = e.target.selectionStart
    let deletedItemIndex = null
    e.target.value = mask

    //testa a validade e possibilidade de existência do input e reseta o valor no campo de input para o anterior válido
    if (!input || !isValid(input, caret)){
        e.target.value = previousString
        caret--
        e.target.setSelectionRange(caret, caret)
        return
    } 
    
    //verifica se o caractere apagado é um que não pode ser substituído por número (caracteres de estrutura)
    if (e.inputType == "deleteContentBackward" && mask[caret] != "_") {
        resultStr = ""

        //exclui o valor anterior para manter consistência do ato de apagar um valor
        const backString = Array.from(input).splice(caret, input.length)
        input = Array.from(input).splice(0, --caret)
        input = input.concat(backString)

        //exclui caracteres especiais de estrutura da máscara
        input = input.filter((char) => {
            return char == "_" || !isNaN(char) && char != " "
        })

        //reformata a string reposicionando os caracteres de estrutura
        let c = 0
        for (char in mask) {
            if (mask[char] == "_") {
                if (char == caret + 1) resultStr += mask[char]
                else if (input[c]) {
                    resultStr += input[c]
                    c++
                }
                else
                    resultStr += mask[char]
            }
            else {
                resultStr += mask[char]
            }
        }
        input = resultStr
    }

    //salva o indice do caractere excluído
    if (e.inputType == "deleteContentBackward") {
        deletedItemIndex = caret
    }

    //separa os dados de data e hora pata serem mapeados individualmente
    let [dateMask, timeMask] = mask.split(" ")
    dateMask = dateMask.split("/")
    timeMask = timeMask.split(":")

    let [date, time] = input.split(" ")
    date = date.split("/")
    time = time.split(":")
    
    for (part in dateMask) {
        date[part] = dateTimeMap(date[part], dateMask[part])
    }

    for (part in timeMask) {
        time[part] = dateTimeMap(time[part], timeMask[part])
    }

    //planifica as matrizes de data e hora em um vetor
    let values = []
    let dateTime = date.concat(time)
    dateTime.forEach((row) => {
        row.forEach(item => values.push(item))
    })

    //formata a string, posicionando os carcteres de estrutura
    resultStr = ""
    let c = 0
    for (char in mask) {
        if (mask[char] == "_") {
            if (deletedItemIndex == char) {
                resultStr += "_"
            }
            else if (values[c]) {
                resultStr += values[c]
                c++
            } else {
                resultStr += mask[char]
            }
        }
        else {
            resultStr += mask[char]
        }
    }

    //filtra o input deixando apenas os valores númericos
    input = Array.from(input).filter((char) => {
        return !isNaN(char) && char != " "
    }).join("")

    //reposiciona o caret
    if (input.length < 12){
        caret--
        if (deletedItemIndex) caret = deletedItemIndex - 1
        while (resultStr[caret] != "_" && caret < mask.length)
            caret++
    }

    previousString = resultStr
    e.target.value = resultStr
    e.target.setSelectionRange(caret, caret)
}

input.forEach((field) => {
    field.addEventListener("input", maskInput)
    field.value = mask
})