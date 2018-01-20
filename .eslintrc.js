module.exports = {
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "env": {
        "es6": true,
        "node": true
    },
    "rules": {
        "no-useless-escape": "off",
        "no-shadow": "error",
        "no-trailing-spaces": "error",
        "semi": ["error", "always"]
    }
};