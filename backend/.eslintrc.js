module.exports = {
	env: {
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	plugins: [
		'eslint-plugin-jsdoc',
		'eslint-plugin-prefer-arrow',
		'@typescript-eslint',
		'@typescript-eslint/tslint',
	],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array',
			},
		],
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Object: {
						message: 'Avoid using the `Object` type. Did you mean `object`?',
					},
					Function: {
						message:
							'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
					},
					Boolean: {
						message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
					},
					Number: {
						message: 'Avoid using the `Number` type. Did you mean `number`?',
					},
					String: {
						message: 'Avoid using the `String` type. Did you mean `string`?',
					},
					Symbol: {
						message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
					},
				},
			},
		],
		semi: 'off',
		'@typescript-eslint/semi': ['warn'],
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/dot-notation': 'error',
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-shadow': [
			'error',
			{
				hoist: 'all',
			},
		],
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/quotes': [
			'error',
			'single',
			{
				avoidEscape: true,
			},
		],
		'@typescript-eslint/triple-slash-reference': [
			'error',
			{
				path: 'always',
				types: 'prefer-import',
				lib: 'always',
			},
		],
		'@typescript-eslint/unified-signatures': 'error',
		complexity: 'off',
		'constructor-super': 'error',
		eqeqeq: ['error', 'smart'],
		'guard-for-in': 'error',
		'id-blacklist': [
			'error',
			'any',
			'Number',
			'number',
			'String',
			'string',
			'Boolean',
			'boolean',
			'Undefined',
			'undefined',
		],
		'id-match': 'error',
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		'jsdoc/newline-after-description': 'error',
		'max-classes-per-file': ['error', 1],
		'max-len': 'off',
		'new-parens': 'error',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-console': 'off',
		'no-debugger': 'error',
		'no-empty': 'error',
		'no-eval': 'error',
		'no-fallthrough': 'off',
		'no-invalid-this': 'off',
		'no-multiple-empty-lines': 'error',
		'no-new-wrappers': 'error',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-undef-init': 'error',
		'no-underscore-dangle': 'error',
		'no-unsafe-finally': 'error',
		'no-unused-labels': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'one-var': ['error', 'never'],
		'prefer-arrow/prefer-arrow-functions': 'error',
		'prefer-const': 'error',
		'prefer-template': 'error',
		radix: 'off',
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'spaced-comment': [
			'error',
			'always',
			{
				markers: ['/'],
			},
		],
		'use-isnan': 'error',
		'valid-typeof': 'off',
		indent: 'off',
		'no-underscore-dangle': ['error', { allow: ['_id'] }],
		'@typescript-eslint/tslint/config': [
			'error',
			{
				rules: {
					'prefer-method-signature': true,
					'prefer-switch': true,
					'unnecessary-else': [
						true,
						{
							'allow-else-if': true,
						},
					],
					whitespace: [
						true,
						'check-branch',
						'check-decl',
						'check-operator',
						'check-separator',
						'check-rest-spread',
						'check-type',
						'check-typecast',
						'check-type-operator',
						'check-preblock',
					],
				},
			},
		],
	},
};
