const capitalize = words => words.map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ')
const isLowercase = str => {
  return str === str.toLowerCase();
}

module.exports = str => {
  if (!isLowercase(str)) return str

  const words = str.split('-')
  return capitalize(words)
}
