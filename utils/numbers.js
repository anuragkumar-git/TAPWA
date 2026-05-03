const gujDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"]
const engDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const toGujarati = (input) => {
    return String(input).replace(/[0-9]/g, (d)=> gujDigits[d])
}