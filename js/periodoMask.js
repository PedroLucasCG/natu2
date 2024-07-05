const input = document.querySelectorAll('input[mask-type="periodoMask"]')
const mask = "__/__/____ __:__"
var resultStr = ""
var previousString = mask

const isValid = function (input, caret) {
    input = Array.from(input.slice(0, caret--))

    const length = input.length
    const char = Number.parseInt(input[caret])

    switch (length) {
        case 1:
            if (char > 3) return false
            break

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
            && field.length > groupMask.length
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
    e.target.value = mask

    if (!input || !isValid(input, caret)){
        e.target.value = previousString
        caret--
        e.target.setSelectionRange(caret, caret)
        return
    } 
    
    if (e.inputType == "deleteContentBackward" && mask[caret] != "_") {
        resultStr = ""

        const backString = Array.from(input).splice(caret, input.length)
        input = Array.from(input).splice(0, --caret)
        input = input.concat(backString)

        input = input.filter((char) => {
            return char == "_" || !isNaN(char) && char != " "
        })

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

    if (e.inputType == "deleteContentBackward") {
        deletedItemIndex = caret
    }

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

    let values = []
    let dateTime = date.concat(time)
    dateTime.forEach((row) => {
        row.forEach(item => values.push(item))
    })

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

    input = Array.from(input).filter((char) => {
        return !isNaN(char) && char != " "
    }).join("")

    if (input.length < 12){
        caret = 0
        if (deletedItemIndex) caret = deletedItemIndex - 1
        while (resultStr[caret] != "_" && input.length)
            caret++
    } else{
        caret = resultStr.length
    }

    previousString = resultStr
    e.target.value = resultStr
    e.target.setSelectionRange(caret, caret)
}

input.forEach((field) => {
    field.addEventListener("input", maskInput)
    field.value = mask
})