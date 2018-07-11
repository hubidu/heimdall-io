export default filepath => {
  let parts = filepath.split('\\')
  if (parts.length === 0) parts = filepath.split('/')

  return {
    file: parts[parts.length - 1],
    path: parts.slice(1, parts.length - 1).join('/')
  }
}

