const si = [
  { value: 1, symbol: "" },
  { value: 1E3, symbol: "k" },
  { value: 1E6, symbol: "M" },
  { value: 1E9, symbol: "G" },
  { value: 1E12, symbol: "T" },
  { value: 1E15, symbol: "P" },
  { value: 1E18, symbol: "E" }
]

export default class NumberHelper {
  static abbreviate(num, digits) {
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    let i
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break
      }
    }
    if (typeof digits === 'undefined') {
      digits = 0
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
  }

  static format(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
