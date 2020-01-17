import TechniqueInfo from './WazaInfo'

const ti = TechniqueInfo.getInstance()

test("isWazaTerm('xyz') to equal false", () => {
    expect(ti.isWazaTerm('xyz')).toBe(false)
})

test("isWazaTerm('Uki-Waza') to equal true", () => {
    expect(ti.isWazaTerm('Uki-Waza')).toBe(true)
})

test("classificationForWazaTerm('xyz') to equal undefined", () => {
    expect(ti.classificationForWazaTerm('xyz')).toBe(undefined)
})

test("classificationForWazaTerm('Zarei') to equal 'Miscellaneous'", () => {
    expect(ti.classificationForWazaTerm('Zarei')).toBe('Miscellaneous')
})

test("wazaForClassificationTerm('Miscellaneous') array length === 4", () => {
    const result = ti.wazaForClassificationTerm('Miscellaneous')
    expect(result.length).toBe(4)
    expect(result[0]).toBe('Obi')
    expect(result[1]).toBe('Obi-Katame')
    expect(result[2]).toBe('Ritsurei')
    expect(result[3]).toBe('Zarei')
})

test("wazaForClassificationTerm('All') array length > 10", () => {
    expect(ti.wazaForClassificationTerm('All').length > 10)
})

test("isKyoWazaTerm('xyz') to equal false", () => {
    expect(ti.isKyoWazaTerm('xyz')).toBe(false)
})

test("isKyoWazaTerm('Yoko-Shiho-Gatame') to equal false", () => {
    expect(ti.isKyoWazaTerm('Yoko-Shiho-Gatame')).toBe(false)
})

test("isKyoWazaTerm('Yoko-Gake') to equal true", () => {
    expect(ti.isKyoWazaTerm('Yoko-Gake')).toBe(true)
})

test("kyoForKyoWazaTerm('xyz') to equal undefined", () => {
    expect(ti.kyoForKyoWazaTerm('xyz')).toBe(undefined)
})

test("kyoForKyoWazaTerm('Yoko-Shiho-Gatame') to equal undefined", () => {
    expect(ti.kyoForKyoWazaTerm('Yoko-Shiho-Gatame')).toBe(undefined)
})

test("kyoForKyoWazaTerm('Ippon-Seoi-Nage') to equal 'GO'", () => {
    expect(ti.kyoForKyoWazaTerm('Ippon-Seoi-Nage')).toBe('GO')
})

test("kyoForKyoWazaTerm('Uchi-Mata') to equal 'YON'", () => {
    expect(ti.kyoForKyoWazaTerm('Uchi-Mata')).toBe('YON')
})

test("kyoForKyoWazaTerm(''Kata-Guruma') to equal 'SAN'", () => {
    expect(ti.kyoForKyoWazaTerm('Kata-Guruma')).toBe('SAN')
})

test("kyoForKyoWazaTerm('Uki-Otoshi') to equal 'NI'", () => {
    expect(ti.kyoForKyoWazaTerm('Uki-Otoshi')).toBe('NI')
})

test("kyoForKyoWazaTerm('Yoko-Gake') to equal 'IK'", () => {
    expect(ti.kyoForKyoWazaTerm('Yoko-Gake')).toBe('IK')
})

test("wazaForKyo('IK') to equal an array", () => {
    const result = ti.wazaForKyo('IK')
    expect(result.length).toBe(8)
    expect(result[0]).toBe('O-Soto-Guruma')
    expect(result[1]).toBe('Uki-Waza')
    expect(result[2]).toBe('Yoko-Wakare')
    expect(result[3]).toBe('Yoko-Guruma')
    expect(result[4]).toBe('Ushiro-Goshi')
    expect(result[5]).toBe('Ura-Nage')
    expect(result[6]).toBe('Sumi-Otoshi')
    expect(result[7]).toBe('Yoko-Gake')
})
