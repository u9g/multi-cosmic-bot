exports.EscapeMarkdown = (text) => {
  var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, "$1"); // unescape any "backslashed" character
  var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, "\\$1"); // escape *, _, `, ~, \
  return escaped;
};
