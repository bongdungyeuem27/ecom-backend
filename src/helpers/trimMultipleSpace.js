export default function index(value) {
  return value.replace(/ +(?= )/g, '').trim()
}
