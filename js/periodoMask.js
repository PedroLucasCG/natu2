const input = document.querySelectorAll('input[mask-type="periodoMask"]')
var resultStr = ""
var rawInput

const isValid = function (input, caret) {
    input = Array.from(input.slice(0, caret+1)).filter((char) => {
        return char != "/" && char != "_"
    }).join("");

    const length = input.length
    const char = Number.parseInt(input[caret])


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
    let caret = this.selectionStart - 1
    const mask = "__/__/__ __:__"
    //console.log(!isValid(input[caret], caret))

    if (
        input.length > 16 //número máximo de caracteres no campo de input (caracteres especiais inclusos)
        || isNaN(input[caret]) //o último caracteres digitado não é um número
            && input.length > 0
        && !(e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward") //garante que nenhum ação é realizada quando um caractere é apagado
            || (input.length == 10 && e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward") // Trasição de data para hora no momento de deletar o espaço 
        || !isValid(input, caret)
        || isNaN(input[caret])
    ) {
        if (caret != input.length - 1 && caret > 1) e.target.value = input.slice(0, caret)+input.slice(caret + 1, input.length)
        else if (caret == -1) {
            e.target.value = input.slice(caret + 1, input.length)
            caret+=1
        }
        else e.target.value = input.slice(0, caret)
        console.log(caret)
        
        this.selectionStart = caret
        this.selectionEnd = caret

    } else {
        //Filtro de input
        input = Array.from(input).filter((char) => {
            return !isNaN(char) && char != " " 
        }).join("")
        
        resultStr = ""
        let c = 0
        console.log(input)
        for (char in mask ){
            if (input[c] && mask[char] == "_"){
                resultStr += input[c]
                c++
            }
            else resultStr += mask[char]
        }
        console.log(resultStr)
        rawInput = input
        e.target.value = resultStr
    }
}

input.forEach((e) => {
    e.addEventListener("input", maskInput)
})