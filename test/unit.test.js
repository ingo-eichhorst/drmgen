
const lib = require('../lib')

describe('generate keys', () => {

  test('generate a complete set of keys', () => {
    const set = lib.generateFullSet()
    expect(set.id.uuid).toMatch(/[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}/)
    expect(set.idFlipped.uuid).toMatch(/[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}/)
    expect(set.key.uuid).toMatch(/[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}/)
    expect(set.keyFlipped.uuid).toMatch(/[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}/)

    expect(set.id.hex).toMatch(/[a-f0-9]{32}/)
    expect(set.idFlipped.hex).toMatch(/[a-f0-9]{32}/)
    expect(set.key.hex).toMatch(/[a-f0-9]{32}/)
    expect(set.keyFlipped.hex).toMatch(/[a-f0-9]{32}/)

    expect(set.id.base64).toMatch(/[a-zA-Z0-9+/]+={0,2}/)
    expect(set.idFlipped.base64).toMatch(/[a-zA-Z0-9+/]+={0,2}/)
    expect(set.key.base64).toMatch(/[a-zA-Z0-9+/]+={0,2}/)
    expect(set.keyFlipped.base64).toMatch(/[a-zA-Z0-9+/]+={0,2}/)

    const flippedBack = lib.swapId(set.idFlipped.uuid)
    expect(set.id.uuid).toBe(flippedBack)
  })

  test('result on wrong uuidToBase64() input', () => {
    expect(lib.uuidToBase64('123')).toBe("")
  })

  test('result on wrong convertUuid() input', () => {
    try {
      lib.convertUuid('123','bas64')
    } catch (e) {
      expect(e.message).toBe('Provided uuid 123 is not valid. See: RFC4122 for details.')
    } 
  })

  test('convertUuid() to uuid', () => {
    let uuid = 'f3abf813-def1-7a4d-a723-bbf82ffebc91'
    expect(lib.convertUuid(uuid, 'uuid')).toBe(uuid)
  })

  test('result on wrong convertUuid() encoding request', () => {
    let uuid = 'f3abf813-def1-7a4d-a723-bbf82ffebc91'
    try {
      lib.convertUuid(uuid, 'undefined')
    } catch (e) {
      expect(e.message).toBe('Selected output encoding is not supported')
    }
  })

  test('swapId() for hex values', () => {
    let hex = 'f3abf813def17a4da723bbf82ffebc91'
    expect(lib.swapId(hex)).toBe('13f8abf3f1de4d7aa723bbf82ffebc91')
  })

})