import { noCase } from 'no-case'
import { Styli } from '../styli'
import { PlainObject } from '../types'
import { ModifierType } from '../types/Modifiers'

export const canUseDom = !!window?.document?.createElement

export function upFirst(s: string = '') {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function downFirst(s: string = '') {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function kebab(s: string) {
  return noCase(s).replace(/\s/g, '-')
}

export function isNumber(s: string | number) {
  return /^-?\d+$/.test('' + s)
}

export function isValidPropValue(v: any) {
  return typeof v !== 'boolean'
}

export function getValue(value: string | number, modifierType?: ModifierType) {
  if (isNumber(value)) {
    const { transformUnit } = Styli.getConfigs()
    return transformUnit(Number(value), modifierType)
  }
  return value
}

export function memorize(fn: Function) {
  const cache: any = {}
  const s = (key: string, ...args: any) => {
    cache[key] = cache[key] || fn.apply(fn, args)
    return cache[key]
  }
  s.cache = cache
  return s
}

export function elementType(ele: any) {
  const typeStr = Object.prototype.toString.call(ele)
  const reg = /^\[object\s([A-Za-z]+)\]$/
  reg.test(typeStr)
  return RegExp.$1.toLowerCase()
}

export function mergeWithDefaultOptions(options: PlainObject, defaultOptions: PlainObject): any {
  const targetOptions: PlainObject = options
  for (let key in defaultOptions) {
    const defaultOptionsKeyTypeStr = elementType(defaultOptions[key])
    const optionsKeyTypeStr = elementType(options[key])
    const optionsKeyIsUndefined = optionsKeyTypeStr === 'undefined'

    if (defaultOptionsKeyTypeStr === 'object') {
      targetOptions[key] = mergeWithDefaultOptions(
        optionsKeyIsUndefined ? {} : options[key],
        defaultOptions[key],
      )
    } else {
      targetOptions[key] = optionsKeyIsUndefined ? defaultOptions[key] : options[key]
    }
  }
  return targetOptions
}

// https://github.com/MatthewBarker/hash-string/blob/master/source/hash-string.js
export function hash(text: string): string {
  let hashValue = 5381
  let index = text.length - 1

  while (index) {
    hashValue = (hashValue * 33) ^ text.charCodeAt(index)
    index -= 1
  }

  return (hashValue >>> 0).toString(16)
}
