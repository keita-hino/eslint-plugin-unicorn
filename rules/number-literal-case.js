import {checkVueTemplate} from './utils/rule.js';
import {isNumberLiteral, isBigIntLiteral} from './ast/index.js';

const MESSAGE_ID = 'number-literal-case';
const messages = {
	[MESSAGE_ID]: 'Invalid number literal casing.',
};

const fix = raw => {
	let fixed = raw.toLowerCase();
	if (fixed.startsWith('0x')) {
		fixed = '0x' + fixed.slice(2).toUpperCase();
	}

	return fixed;
};

/** @param {import('eslint').Rule.RuleContext} context */
const create = () => ({
	Literal(node) {
		const {raw} = node;

		let fixed = raw;
		if (isNumberLiteral(node)) {
			fixed = fix(raw);
		} else if (isBigIntLiteral(node)) {
			fixed = fix(raw.slice(0, -1)) + 'n';
		}

		if (raw !== fixed) {
			return {
				node,
				messageId: MESSAGE_ID,
				fix: fixer => fixer.replaceText(node, fixed),
			};
		}
	},
});

/** @type {import('eslint').Rule.RuleModule} */
const config = {
	create: checkVueTemplate(create),
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce proper case for numeric literals.',
			recommended: true,
		},
		fixable: 'code',
		messages,
	},
};

export default config;
