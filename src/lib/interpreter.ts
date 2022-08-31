import type {
	BaseData,
	ButtonData,
	ImageFormatData,
	MultiSelectData,
	OptionImageData,
	Prereqs,
	TreeArtPage
} from '$lib/conf/TreeArtConfig';
import { TreeType } from '$lib/conf/TreeArtConfig';
import { config } from '$lib/conf/config';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

// const svg = `
// <svg id='svgBox' height='100%' width='100%' viewBox='0 0 100 100' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
// 	<defs>
// 		<style>
// 			@font-face {
// 				font-family: 'MType';
// 				font-style: normal;
// 				font-weight: normal;
// 				src: url('${mtypeUri}') format('woff');
// 			}
//
// 			svg {
// 				font-size: 0.2em;
// 			}
//
// 			text {
// 				text-anchor: middle;
// 			}
//
// 			textPath {
// 				font-family: 'MType', serif;
// 				alignment-baseline: hanging;
// 			}
// 		</style>
// 	</defs>
//
// 	<path id='curve' d='M0,71.5
// 	C0,71.5 25,74 50,72 S
// 	85,71 100,72.5' fill='transparent'></path>
// 	<text x='50%'>
// 		<textPath class='resize resizeGround' id='groundText' href='#curve'>{selection}</textPath>
// 	</text>
// </svg>`;

let selectedValues = writable({});
export let requirementsNotMet = writable([]);
let _requirementsNotMet = [];

let _selections = {};
export let selections = writable(_selections);
let _multiSelectEntries = {};
export let multiSelectEntries = writable(_multiSelectEntries);

let myCanvas: HTMLCanvasElement;
export let canv: Writable<HTMLCanvasElement> = writable();
canv.subscribe(val => myCanvas = val);

let _svg: SVGElement;
export let customSvg: Writable<SVGElement> = writable();
customSvg.subscribe(val => _svg = val);

export let composite: Writable<any> = writable();

const drawSvg = () => {
	if (!_svg || !myCanvas) return;
	let ctx = myCanvas.getContext('2d');
	let txt = _svg.outerHTML;
	// Convert the SVG to an object url
	let url = URL.createObjectURL(new Blob([txt], { type: 'image/svg+xml' }));
	let img = document.createElement('img');
	img.src = url;
	console.log(url);
	img.onload = () => {
		ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
		// URL.revokeObjectURL(url);
	};
};

export const selectItem = (optId: string, value: any) => {
	console.log(`New value for ${optId}: `, value);
	_selections[optId] = value;
	if (value.reset) {
		for (let res of value.reset) {
			delete _selections[res];
		}
	}
	console.log(_selections);
	_requirementsNotMet = _requirementsNotMet.filter(item => item != optId);
	requirementsNotMet.set(_requirementsNotMet);
	selections.set(_selections);
	processImg();
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

export const getMultiSelect = (optId: string) => _multiSelectEntries[optId];

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
		.replace(/ {2,}/, ' ');

	// console.log(treeFormat);
	return treeFormat;
};

// root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
export const getRootsImage = (data: OptionImageData) => {
	let rootFormat = config.imageFormats.root
		.replace('%type%', getOrDefault(data, 'type'))
		.replace('%gen%', getOrDefault(data, 'gen'))
		.replace('%color%', getOrDefault(data, 'color'))
		.replace(/ {2,}/, ' ');

	// console.log(rootFormat);
	return rootFormat;
};

const getImageData = (data: ImageFormatData, key: string) => {
	// Check for the key in the main img data
	if (key in data && data[key] != 'reset') {
		// This value should override the prior retrieved value.
		// console.log(`'${key}' In data`);
		return data[key];
	} else if (data.default && key in data.default && data.default[key] != 'reset') { // Otherwise, check supplied defaults
		// console.log(`'${key}' In data default`);
		// console.log(data.img);
		return data.default[key];
	} else if (data.use && data.use == 'roots' && data.roots) {
		if (key in data.roots && data.roots[key] != 'reset') {
			// console.log(`'${key}' in roots`);
			return data.roots[key];
		}
	}

	return null;
};

const getOrDefault = (preData: OptionImageData | ImageFormatData, key: string) => {
	// TODO Get already selected values and see if there is a supplied value there

	let data: ImageFormatData = 'img' in preData
		? preData.img
		: preData as ImageFormatData;

	let val = getImageData(data, key);
	if (!val) val = getImageData(getComposite(), key);
	if (val) return val;

	// Lastly, fallback to the config defaults
	return config.imageFormats.defaults[key];
};

export const getComposite = () => {
	let comp = {};
	for (let key in _selections) {
		if (!(key in _selections) || !_selections[key].img) continue;

		let obj = _selections[key].img;
		// console.log(key + ': ', _selections[key]);
		for (let imgKey in obj) {
			if (typeof obj[imgKey] == 'object') {
				if (!comp[imgKey]) comp[imgKey] = {};
				for (let subKey in obj[imgKey]) {
					let val = obj[imgKey][subKey];
					if (val == 'reset')
						delete comp[imgKey][subKey];
					else
						comp[imgKey][subKey] = val;
				}
			} else {
				let val = obj[imgKey];
				if (val == 'reset')
					delete comp[imgKey];
				else
					comp[imgKey] = val;
			}
		}

		// console.log('Composite', comp);
	}

	composite.set(comp);
	return comp;
};

const processImg = () => {
	let composite = getComposite();
	setTimeout(() => renderCanvas(composite), 500);
};

const renderCanvas = (composite) => {
	delete composite.use;
	let rootsExist = !!composite.roots && 'type' in composite.roots;

	let treeImg = getTreeImage(composite);
	composite.use = 'roots';
	let rootsImg = getRootsImage(composite);

	console.log(treeImg);
	console.log(myCanvas);

	let ctx = myCanvas.getContext('2d');

	let images = [];

	if (composite.background) {
		let background = new Image();
		background.src = composite.background;
		background.width = myCanvas.width;
		background.height = myCanvas.height;
		images.push(background);
	}

	let tree = new Image();
	tree.src = treeImg;
	let tenW = myCanvas.width * 0.1;
	let tenH = myCanvas.height * 0.1;
	tree.width = myCanvas.width - (rootsExist ? (tenW * 2) : 0);
	tree.height = myCanvas.height - (rootsExist ? (tenH * 2) : 0);

	images.push(tree);

	if (rootsExist) {
		let roots = new Image();
		roots.src = rootsImg;
		roots.width = myCanvas.width;
		roots.height = myCanvas.height;
		images.push(roots);
	}

	drawImages(ctx, images);
	drawSvg();
};

const drawImages = (ctx: CanvasRenderingContext2D, images: HTMLImageElement[]) => {
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	images.forEach(img => {
		img.onload = () => {
			let offset = 0;
			if (img.width < myCanvas.width)
				offset = (myCanvas.width - img.width) / 2;
			ctx.drawImage(img, offset, 0, img.width, img.height);
		};
	});
};
