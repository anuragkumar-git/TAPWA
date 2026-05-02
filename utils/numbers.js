const gujDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"]
const engDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const toGujarati = (input) => {
    return String(input).replace(/[0-9]/g, (d)=> gujDigits[d])
}

// const text = "12-02-2026"
// const text = "12/02/2026"
// const text = "23:50"
// const text = "23:50"
// const converted = toGujarati(text)

// console.log("text:", text)
// console.log("converted:", converted)