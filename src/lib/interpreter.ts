import type { ImageData } from './conf/TreeArtConfig';
import { config } from './conf/config';
import { writable } from 'svelte/store';

let selectedValues = writable({});

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

export const getImage = (data: ImageData) => {
	if (!data.img.use || data.img.use == 'tree')
		return getTreeImage(data);
	else if (data.img.use == 'roots')
		return getRootsImage(data);
};

// tree: '/imgs/Tree Layers/%type% %gen% %couple% %style1% TREE %color%.png',
export const getTreeImage = (data: ImageData) => {
	let treeFormat = config.imageFormats.tree
		.replace('%type%', getOrDefault(data, 'type'))
		.replace('%gen%', getOrDefault(data, 'gen'))
		.replace('%couple%', getOrDefault(data, 'couple'))
		.replace('%style1%', getOrDefault(data, 'style1'))
		.replace('%color%', getOrDefault(data, 'color'))
		.replace(/[ ]{2,}/, ' ');

	console.log(treeFormat);
	return treeFormat;
};

// root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
export const getRootsImage = (data: ImageData) => {
	let rootFormat = config.imageFormats.root
		.replace('%type%', getOrDefault(data, 'type'))
		.replace('%gen%', getOrDefault(data, 'gen'))
		.replace('%color%', getOrDefault(data, 'color'))
		.replace(/[ ]{2,}/, ' ');

	console.log(rootFormat);
	return rootFormat;
};

const getOrDefault = (data: ImageData, key: string) => {
	console.log(`Looking for ${key}`);

	// TODO Get already selected values and see if there is a supplied value there


	if (data.img) {
		// Check for the key in the main img data
		if (key in data.img && data.img[key] != 'reset') {
			// This value should override the prior retrieved value.
			console.log(`'${key}' In data`);
			return data.img[key];
		} else if (data.img.default && key in data.img.default && data.img.default[key] != 'reset') { // Otherwise, check supplied defaults
			console.log(`'${key}' In data default`);
			console.log(data.img);
			return data.img.default[key];
		} else if (data.img.use && data.img.use == 'roots' && data.img.roots[key] != 'reset') {
			if (key in data.img.roots) {
				console.log(`'${key}' in roots`);
				return data.img.roots[key];
			}
		}
	}

	// Lastly, fallback to the config defaults
	console.log('Defaulting to ' + config.imageFormats.defaults[key]);
	return config.imageFormats.defaults[key];
};