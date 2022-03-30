import type {
	BaseData,
	ButtonData,
	MultiSelectData,
	OptionImageData,
	Prereqs,
	TreeArtPage
} from './conf/TreeArtConfig';
import { config } from './conf/config';
import { writable } from 'svelte/store';

let selectedValues = writable({});
export let requirementsNotMet = writable([]);
let _requirementsNotMet = [];

let _selections = {};
export let selections = writable(_selections);
let _multiSelectEntries = {};
export let multiSelectEntries = writable(_multiSelectEntries);

export const selectItem = (optId: string, value: any) => {
	// console.log(`New value for ${optId}: `, value);
	_selections[optId] = value;
	// console.log(_selections);
	_requirementsNotMet = _requirementsNotMet.filter(item => item != optId);
	requirementsNotMet.set(_requirementsNotMet);
	selections.set(_selections);
};

export const unset = (optId: string) => {
	_selections[optId] = undefined;
	selections.set(_selections);
};

export const getValue = (optId: string, sourceData?: any): OptionImageData | ButtonData | string => {
	return sourceData && sourceData[optId] ? sourceData[optId] : _selections[optId];
};

export const selectMultiSelect = (optId: string, value: any) => {
	if (!_multiSelectEntries[optId])
		_multiSelectEntries[optId] = [];
	_multiSelectEntries[optId].push(value);
	multiSelectEntries.set(_multiSelectEntries);
};

export const getMultiSelect = (optId: string) => {
	return _multiSelectEntries[optId];
};

export const deleteMulti = (optId: string, multi: MultiSelectData) => {
	_multiSelectEntries[optId] = _multiSelectEntries[optId].filter(data => data != multi);
	multiSelectEntries.set(_multiSelectEntries);
};

export const getQualifiedCost = (option: BaseData, sourceData?: any): number => {
	let value = -1;
	if (!option.values)
		return value;

	for (let check of option.values) {
		let targetValue = getValue(check.option, sourceData);
		// console.log('Target value: ' + targetValue);
		if (!targetValue) continue;

		if ((typeof targetValue == 'string' && check.value.includes(targetValue))
			|| check.value.includes(((<BaseData>targetValue).key))) {
			value = check.cost;
			break;
		}
	}

	return value;
};

export const meetsPrereqs = (prereq: Prereqs): boolean => {
	if (!prereq) return true;

	let value: BaseData | string = getValue(prereq.option);
	if (typeof value != 'string')
		value = (<BaseData>value)?.key;

	if (!value)
		return false;

	let result = prereq.value
		// Check if we have an included value
		? prereq.value.includes(value)
		// Or that we are properly using an excluded value
		: (prereq.not_value && !prereq.not_value.includes(value));

	// Check the and recursively
	if (prereq.and)
		result = result && meetsPrereqs(prereq.and);

	// Check the or recursively
	if (prereq.or)
		result = result || meetsPrereqs(prereq.or);

	// Return our result
	return result;
};

export const requirementsMet = (page: TreeArtPage): boolean => {
	_requirementsNotMet = [];
	for (let opt of page.options) {
		if ((!opt.prereq || meetsPrereqs(opt.prereq)) && opt.required && !getValue(opt.id))
			_requirementsNotMet.push(opt.id);
	}
	requirementsNotMet.set(_requirementsNotMet);
	return _requirementsNotMet.length === 0;
};

/*
	imageFormats = <ImageFormats>{
		leaf: '/imgs/Tree Layers/%type% %gen% %couple% %style1% LEAVES%chalk%.png',
		tree_layer: 2,
		root_layer: 3,
		leaf_layer: 4,
		defaults: {
			type: 'DESCENDANT',
			gen: '3 Gen',
			couple: '',
			style1: 'Style 1',
			color: 'black',
			chalk: ''
		}
	};
 */

export const getImage = (data: OptionImageData) => {
	if (!data.img.use || data.img.use == 'tree')
		return getTreeImage(data);
	else if (data.img.use == 'roots')
		return getRootsImage(data);
};

// tree: '/imgs/Tree Layers/%type% %gen% %couple% %style1% TREE %color%.png',
export const getTreeImage = (data: OptionImageData) => {
	let treeFormat = config.imageFormats.tree
		.replace('%type%', getOrDefault(data, 'type'))
		.replace('%gen%', getOrDefault(data, 'gen'))
		.replace('%couple%', getOrDefault(data, 'couple'))
		.replace('%style1%', getOrDefault(data, 'style1'))
		.replace('%color%', getOrDefault(data, 'color'))
		.replace(/[ ]{2,}/, ' ');

	// console.log(treeFormat);
	return treeFormat;
};

// root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
export const getRootsImage = (data: OptionImageData) => {
	let rootFormat = config.imageFormats.root
		.replace('%type%', getOrDefault(data, 'type'))
		.replace('%gen%', getOrDefault(data, 'gen'))
		.replace('%color%', getOrDefault(data, 'color'))
		.replace(/[ ]{2,}/, ' ');

	// console.log(rootFormat);
	return rootFormat;
};

const getOrDefault = (data: OptionImageData, key: string) => {
	// console.log(`Looking for ${key}`);

	// TODO Get already selected values and see if there is a supplied value there


	if (data.img) {
		// Check for the key in the main img data
		if (key in data.img && data.img[key] != 'reset') {
			// This value should override the prior retrieved value.
			// console.log(`'${key}' In data`);
			return data.img[key];
		} else if (data.img.default && key in data.img.default && data.img.default[key] != 'reset') { // Otherwise, check supplied defaults
			// console.log(`'${key}' In data default`);
			// console.log(data.img);
			return data.img.default[key];
		} else if (data.img.use && data.img.use == 'roots' && data.img.roots[key] != 'reset') {
			if (key in data.img.roots) {
				// console.log(`'${key}' in roots`);
				return data.img.roots[key];
			}
		}
	}

	// Lastly, fallback to the config defaults
	// console.log('Defaulting to ' + config.imageFormats.defaults[key]);
	return config.imageFormats.defaults[key];
};