module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  settings: {
    react: {
      version: "16.8"
    },
    "import/resolver": {
      "typescript": {
        "directory": "./tsconfig.json"
      },
      node: {
        paths: ["./src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: [ 
    "react-hooks"
  ],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ],
    "prettier/prettier": ["error", { "singleQuote": true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/prefer-default-export": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "react/destructuring-assignment": "off",
    "react/prop-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-console": "off",
    "import/no-unresolved": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "react/jsx-wrap-multilines": "off",
    "react/display-name": "off",
    "react/style-prop-object": "off",
    "react/no-unescaped-entities":"off",
    "react/button-has-type": "off",
    "no-unused-vars": "off"
  }
};
