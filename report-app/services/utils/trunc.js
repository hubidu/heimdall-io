export default (msg, MaxLen = 80) => {
  if (!msg) return msg
  let res = msg
  if (msg.length > MaxLen) {
    res = msg.substring(0, MaxLen) + '...'
  }
  return res
}
