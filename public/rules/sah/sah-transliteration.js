( function ( $ ) {
	'use strict';

	var sahTransliteration = {
		id: 'sah-transliteration',
		name: 'Sakha Transliteration',
		description: 'Sakha transliteration',
		date: '2012-10-16',
		URL: 'http://github.com/wikimedia/jquery.ime',
		author: 'Amir (Алексей) Aharoni',
		license: 'GPLv3',
		version: '1.0',
		patterns: [
			['Q', 'Й'],
			['W', 'Ц'],
			['E', 'У'],
			['R', 'К'],
			['T', 'Е'],
			['Y', 'Н'],
			['U', 'Г'],
			['I', 'Ш'],
			['O', 'Щ'],
			['P', 'З'],
			['{', 'Х'],
			['}', 'Ъ'],
			['A', 'Ф'],
			['S', 'Ы'],
			['D', 'В'],
			['F', 'А'],
			['G', 'П'],
			['H', 'Р'],
			['J', 'О'],
			['K', 'Л'],
			['L', 'Д'],
			[':', 'Ж'],
			['"', 'Э'],
			['Z', 'Я'],
			['X', 'Ч'],
			['C', 'С'],
			['V', 'М'],
			['B', 'И'],
			['N', 'Т'],
			['M', 'Ь'],
			['<', 'Б'],
			['>', 'Ю'],
			['\\?', ','],

			['q', 'й'],
			['w', 'ц'],
			['e', 'у'],
			['r', 'к'],
			['t', 'е'],
			['y', 'н'],
			['u', 'г'],
			['i', 'ш'],
			['o', 'щ'],
			['p', 'з'],
			['\\[', 'х'],
			['\\]', 'ъ'],
			['a', 'ф'],
			['s', 'ы'],
			['d', 'в'],
			['f', 'а'],
			['g', 'п'],
			['h', 'р'],
			['j', 'о'],
			['k', 'л'],
			['l', 'д'],
			[';', 'ж'],
			['\'', 'э'],
			['z', 'я'],
			['x', 'ч'],
			['c', 'с'],
			['v', 'м'],
			['b', 'и'],
			['n', 'т'],
			['m', 'ь'],
			[',', 'б'],
			['\\.', 'ю'],
			['/', '.'],

			['`', '"'],
			['~', '№'],

			['1', '!'], // 1
			['!', '?'], // 1
			// 2, 3 - ?
			['4', 'ҥ'], // 4
			['\\$', 'Ҥ'], // 4
			['5', 'ҕ'], // 5
			['%', 'Ҕ'], // 5
			['6', 'ө'], // 6
			['\\^', 'Ө'], // 6
			['7', 'һ'], // 7
			['&', 'Һ'], // 7
			['8', 'ү'], // 8
			['\\*', 'Ү'], // 8
			['9', ';'], // 9
			['0', ':']] // 0
	};

	$.ime.register( sahTransliteration );
}( jQuery ) );
