import cds from '@sap/cds/eslint.config.js'
export default [ ...cds.recommended ]

//
// The above is the recommended minimalistic eslint config, just using
// recommended defaults provided by cds. Alternatively, go for enhanced
// project-specific options, but only if really required, like this:
//
// export default [ ...cds.recommended, {
//   rules: {
//     'complexity': [ 'warn', 66 ],
//     'require-await': 'warn',
//     'no-await-in-loop': 'warn',
//   },
// }, {
//   ignores: [
//     '**/webapp/**'
//   ]
// }]
//
