/* eslint-disable */

export const deepStringify = (value: any) => {
  const stringify = (data: any, prefix: any = null): string => {
    function unicode_escape(c: any) {
      var s = c.charCodeAt(0).toString(16)
      while (s.length < 4) s = '0' + s
      return '\\u' + s
    }
    if (!prefix) prefix = ''
    switch (typeof data) {
      case 'object': // object, array or null
        if (data == null) return 'null'
        var i,
          pieces = [],
          before,
          after
        var indent = prefix + '    '
        if (data instanceof Array) {
          for (i = 0; i < data.length; i++)
            pieces.push(stringify(data[i], indent))
          before = '[\n'
          after = ']'
        } else {
          for (i in data) pieces.push(i + ': ' + stringify(data[i], indent))
          before = '{\n'
          after = '}'
        }
        return (
          before + indent + pieces.join(',\n' + indent) + '\n' + prefix + after
        )
      case 'string':
        data = data
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/[\x00-\x19]/g, unicode_escape)
        return '"' + data + '"'
      default:
        return String(data).replace(/\n/g, '\n' + prefix)
    }
  }

  return stringify(value)
}
