const input = document.querySelectorAll('input[data-type="periodoMask"]')
var resultStr = ""

const formatPeriodoString = function (e, input, isDateTime) {
    let charOffset = 2
    let char
    let re

    if (isDateTime) {
        re = /([0-9]{2})?([0-9]{2})?/
        char = ":"
        charOffset = 1
    } else {
        re = /([0-9]{2})?([0-9]{2})?([0-9]{4})?/
        char = "/"
        resultStr = ""
    }

    //Separação dos componentes importantes da string
    let result = input.split(re)
    result = result.filter((item) => {
        return item
    })

    //Formatação da string para apresentação
    if (!(e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward")) {
        if (isDateTime) resultStr += " "

        for (i in result) {
            if (i < charOffset)
                resultStr += result[i] + char
            else
                resultStr += result[i]

        }
        e.target.value = resultStr
    }
}

const isValid = function (char, input) {
    input = Array.from(input).filter((char) => {
        return char != "/"
    }).join("");

    let length = input.length
    char = Number.parseInt(char)

    switch (length) {
        case 1:
            if (char > 3) return false
            break

        case 3:
            if (char > 1) return false
            break

        case 4:
            if (Number.parseInt(input.slice(2,4)) > 12) return false;
            break;

        case 10:
            if (char > 2) return false
            break;

        case 12:
            if (char > 5) return false
            break;
    }
    return true
}

const maskInput = function (e) {
    let input = e.target.value

    if (
        input.length > 16 //número máximo de caracteres no campo de input (caracteres especiais inclusos)
        || isNaN(input[input.length - 1]) //o último caracteres digitado não é um número
            && input.length > 0
        && !(e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward") //garante que nenhum ação é realizada quando um caractere é apagado
            || (input.length == 10 && e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward") // Trasição de data para hora no momento de deletar o espaço 
        || !isValid(input[input.length - 1], input)
        || isNaN(input[input.length - 1])
    ) {
        e.target.value = input.slice(0, input.length - 1)
    } else {
        //11 == 8*chars + 2*"/" + " "
        let isDateTime = false
        if (input.length > 11) {
            input = input.split(" ")
            resultStr = input[0]
            input = input[1]
            isDateTime = true

            //Filtro de input para hora
            input = Array.from(input).filter((char) => {
                return char != ":"
            }).join("")

        } else {

            //Filtro de input para data
            input = Array.from(input).filter((char) => {
                return char != "/"
            }).join("")

            //Adição de divisor entre data e hora
            if (input.length == 8) {
                input += " "
            }
        }

        formatPeriodoString(e, input, isDateTime)
    }
}

input.forEach((e) => {
    e.addEventListener("input", maskInput)
})