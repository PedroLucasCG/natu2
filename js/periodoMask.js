const input = document.querySelectorAll('input[data-type="periodoMask"]')
var resultStr = ""

const maskInput = (e) => {
    let input = e.target.value
    input = Array.from(input).filter((char) => {
        return char != "/"
    })
    input = input.join("")
    if (input.length > 8 || isNaN(input[input.length - 1]) && input.length > 0) {
        e.target.value = resultStr
        return
    }

    const re = /([0-9]{2})?([0-9]{2})?([0-9]{4})?/
    let result = input.split(re)
    result = result.filter((item) => {
        return item
    })

    if (!(e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward")) {
        resultStr = ""
        for (i in result) {
            if (i < 2)
                resultStr += result[i] + "/"
            else
                resultStr += result[i]
        }
        e.target.value = resultStr
    } 
}

input.forEach((e) => {
    e.addEventListener("input", maskInput)
})