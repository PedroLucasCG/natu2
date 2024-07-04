const input = document.querySelectorAll('input[mask-type="periodoMask"]')
var resultStr = ""
var previousValue = ""

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

const dateTimeMap = function (group, groupMask) {
    let field = Array.from(group)
    let removeNext = false

    for (char in field) {
        let charCounter = 0
        field.forEach((char) => {
            if (char) charCounter++
        })

        if (
            !isNaN(field[char])
            && !removeNext
        ) {
            removeNext = true
        }

        if (
            field[char] == "_"
            && removeNext
        ) {
            field[char] = ""
            removeNext = false
        }

    }
    field = field.filter((char) => { return char != "" })
    field = field.slice(0, groupMask.length)
    
    return field
}

const maskInput = function (e) {
    let input = e.target.value
    let caret = e.target.selectionStart
    let deletedItemIndex = null
    const mask = "__/__/____ __:__"
    e.target.value = mask
    
    if (!input) return

    if (e.inputType == "deleteContentBackward" && mask[caret] != "_" && isNaN(input[caret])) {
        resultStr = ""
        input = Array.from(input).splice(0, caret - 1)

        for (char in mask){
            if (mask[char] == "_"){
                if (input[char]){
                    resultStr += input[char]
                }
                else
                    resultStr += mask[char]
            }
            else{
                resultStr += mask[char]
            }
                
        }
        input = resultStr
        console.log(resultStr)
    } else if (e.inputType == "deleteContentBackward") {
        deletedItemIndex = caret
    }

    let [dateMask, timeMask] = mask.split(" ")
    dateMask = dateMask.split("/")
    timeMask = timeMask.split(":")

    let [date, time] = input.split(" ")
    date = date.split("/")
    time = time.split(":")

    for (part in dateMask){
        date[part] = dateTimeMap(date[part], dateMask[part])
    }

    for (part in timeMask){
        time[part] = dateTimeMap(time[part], timeMask[part])
    }

    let values = []
    let dateTime = date.concat(time)
    dateTime.forEach((row) => {
        row.forEach(item => values.push(item))
    })
    
    //Filtro de input
    input = Array.from(input).filter((char) => {
        return !isNaN(char) && char != " " 
    }).join("")

    if (
        input.length > 12 //número máximo de caracteres no campo de input (caracteres especiais inclusos)
        || !isValid(input, e.target.selectionStart)
    ){

    }
    
    resultStr = ""
    let c = 0
    for (char in mask ){
        if (mask[char] == "_"){
            if (deletedItemIndex == char) {
                resultStr += "_"
            }
            else if (values[c]){
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

    caret = values.findIndex(char => char == "_")
    while (resultStr[caret] != "_" && input.length < 12)
        caret++

    e.target.value = resultStr
    previousValue = resultStr
    e.target.selectionStart = caret
    e.target.selectionEnd = caret
}

input.forEach((e) => {
    e.addEventListener("input", maskInput)
})