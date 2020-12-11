function setCookie(key, value, expires) {
  if (!expires) return document.cookie = key + '=' + value

  const time = new Date()
  time.setTime(time.getTime() - 1000 * 60 * 60 * 8 + 1000 * expires)
  document.cookie = `${key}=${value};expires=` + time
}

function getCookie(key) {
  const obj = {}

  const tmp = document.cookie.split('; ')
  tmp.forEach(item => {
    const t = item.split('=')
    obj[t[0]] = t[1]
  })

  return key ? obj[key] : obj
}
