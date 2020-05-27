module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
  ],
  rules: {
    "no-var": ["error"],  // нельзя использовать var, только let или const
    "key-spacing": ["error"], // пробел между ключом свойства объекта и его значением {"key": "value"}
    //"indent": ["error", 2],  //  следит за неправильными отступами от начала строки (в данном случае должно быть два пробела, затем 4 и т.д.)
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};