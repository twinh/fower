import { Plugin, Rule, styli } from '@styli/core'
import { downFirst, isValidPropValue, kebab } from '@styli/utils'

export function isBgColorKey(key: string) {
  return /^bg(.+)?$/.test(key)
}

export default (): Plugin => {
  return {
    onVisitProp({ key: propKey, value: propValue }, sheet) {
      if (!isBgColorKey(propKey)) return { sheet }

      const Colors = styli.getColors()

      const rule: Rule = { name: propKey, cssFragmentList: [], cssFragment: '', style: {} }
      const styleKey = 'backgroundColor'
      const cssAttrKey = kebab(styleKey)

      if (Array.isArray(propValue)) {
        const cssAttrKey = kebab(styleKey)
        propValue.forEach((value, idx) => {
          const cssFragment = rule.cssFragmentList![idx] || ''
          rule.cssFragmentList![idx] = `${cssFragment}${cssAttrKey}:${value};`
        })
      } else {
        const [, color = ''] = propKey.match(/^bg(\w+)$/) || []
        const value = isValidPropValue(propValue) ? propValue : downFirst(color)
        rule.style = { ...rule.style, [styleKey]: Colors[value] || value }
        rule.cssFragment = `${rule.cssFragment}${cssAttrKey}:${Colors[value] || value};`
      }

      sheet.addRule(rule)

      return { sheet, matched: true }
    },
  }
}
