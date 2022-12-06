const splitRows = (rows) => {
  // split text into rows, handle both LF and CRLF
  return rows.split(/\r?\n/)
}


module.exports = {
  splitRows
}