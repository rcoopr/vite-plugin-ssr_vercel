// eslint-disable-next-line no-undef
module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	plugins: ['react-refresh', 'import'],
	settings: {
		'import/resolver': {
			typescript: true,
			node: true,
		},
	},
	rules: {
		'react-refresh/only-export-components': 'warn',
		'prefer-const': 'error',
		'import/no-useless-path-segments': 1,
		'import/no-unresolved': 2,
		'import/no-named-as-default': 0,
		'import/named': 2,
		'import/namespace': 2,
		'import/default': 2,
		'import/first': 2,
		'import/export': 2,
		'import/order': [
			1,
			{
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
						position: 'after',
					},
				],
			},
		],
	},
}
