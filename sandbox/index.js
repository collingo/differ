var differ = require('../src/differ');

console.log(differ({
	test: 123,
	deleted: 'test123',
	array: [456]
}, {
	test: 456,
	added: 'test456',
	array: [123, 456, 789]
}));