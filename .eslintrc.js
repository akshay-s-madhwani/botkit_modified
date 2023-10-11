module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },

    "env": {
        "node": true,
        "es6": true
    },

    //"extends": "plugin:prettier/recommended",
    //"extends": "airbnb-base",
    //"extends": "airbnb",
    "extends": ["airbnb-base", "plugin:prettier/recommended"],
    //"plugins": ["prettier"],

    //"plugins": ["promise"],

    "rules": {
        "global-require": 0,
        "quotes": ["error", "backtick"],
        "no-underscore-dangle": [2, { "allow": ['_config','__'] }],
        "no-cond-assign": [2, "except-parens"],
        /*"no-console": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ],*/
        "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["prop","controller"] }],
        //'space-before-function-paren': [ 'error', { anonymous: 'always', named: 'always', asyncArrow: 'always' } ]
        //"linebreak-style": 0,
        //"global-require": 0,
        //"eslint linebreak-style": [0, "error", "windows"],
        //"prettier/prettier": ["error"],
        //    "space-in-parens": ["error", "always"]
    }


};