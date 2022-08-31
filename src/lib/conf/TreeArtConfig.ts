import { meetsPrereqs } from '../interpreter';

export class TreeArtConfig {
	imageFormats = <ImageFormats>{
		tree: '/imgs/Tree Layers/%type% %gen% %couple% %style1% TREE %color%.png',
		root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
		leaf: '/imgs/Tree Layers/%type% %gen% %couple% %style1% LEAVES%chalk%.png',
		background_layer: 1,
		tree_layer: 2,
		root_layer: 3,
		leaf_layer: 4,
		defaults: {
			type: TreeType.DESCENDANT,
			gen: '3 Gen',
			couple: '',
			style1: 'Style 1',
			color: 'black',
			chalk: ''
		}
	};

	builderFooter: string = '';
	pages: TreeArtPage[] = [];

	constructor(data: TreeArtConfigData = {}) {
		//Load in and set our image formats, overriding the defaults if they are present.
		if (data.imageFormats) {
			for (let key in data.imageFormats) {
				console.log(typeof data.imageFormats[key]);
				if (typeof data.imageFormats[key] != 'object')
					this.imageFormats[key] = data.imageFormats[key];
				else {
					for (let sub_key in data.imageFormats[key]) {
						this.imageFormats[key][sub_key] = data.imageFormats[key][sub_key];
					}
				}
			}
		}


		//Set our other variables dynamically
		for (let key in data) {
			if (key == 'imageFormats') continue;
			this[key] = data[key];
		}
	}

	setPages(pages: TreeArtPage[]) {
		this.pages = pages;
	}

	addPage(page: TreeArtPage) {
		this.pages.push(page);
	}
}

export class TreeArtPage {
	title: string;
	intro: string;
	footer: string;
	prereq: Prereqs | undefined;
	options: (ImageOption | ButtonOption | ItemOption | TextOption)[];
	finalPage = false;
	multiselect: MultiSelectData | undefined = undefined;

	constructor(init: TreeArtPageData) {
		this.title = init.title;
		this.intro = init.intro;
		this.footer = init.footer;
		this.prereq = init.prereq;
		this.options = init.options;
		this.multiselect = init.multiselect;
		if (init.finalPage) this.finalPage = init.finalPage;
	}

	meetsRequirements() {
		return meetsPrereqs(this.prereq);
	}
}

/** @type **/
export interface TreeArtPageData {
	title: string,
	intro: string,
	footer?: string,
	prereq?: Prereqs,
	options: (ImageOption | ButtonOption | ItemOption | TextOption)[],
	finalPage?: boolean,
	multiselect?: MultiSelectData
}

export interface Prereqs {
	option: string,
	value?: string[],
	not_value?: string[],
	and?: Prereqs,
	or?: Prereqs
}

export interface MultiSelectData {
	id: string,
	keys: string[],
	quantifier: string,
	format: string,
	formula: string
}

export interface TreeArtConfigData {
	imageFormats?: ImageFormats,
	builderFooter?: string,
	pages?: [TreeArtPage]
}

export interface ImageFormats {
	tree?: string,
	root?: string,
	leaf?: string,
	tree_layer?: number,
	root_layer?: number,
	leaf_layer?: number,
	defaults?: {
		type?: string,
		gen?: string,
		couple?: string,
		style1?: string,
		color?: string,
		chalk?: string,
	},
}

export interface BaseOption {
	prereq?: Prereqs,
	name: string,
	id: string,
	type: string,
	required?: boolean,
	layer?: number,
	display?: string,
	flexCount?: number
}

export interface ImageOption extends BaseOption {
	images: (OptionImageData | GroupData)[];
}

export interface ButtonOption extends BaseOption {
	buttons: ButtonData[];
}

export interface ItemOption extends BaseOption {
	items: ItemData[];
}

export interface TextOption extends BaseOption {
	placeholder?: string;
}

export interface BaseData {
	prereq?: Prereqs,
	displayText?: string,
	cost?: number,
	key?: string,
	summaryText?: string,
	default?: boolean,
	img?: ImageFormatData,
	placeholder?: string,
	values?: ValueInformation[],
	reset?: string[]
}

export interface OptionImageData extends BaseData {
	displayImage?: string,
	background?: string,
	footer?: string
}

export interface ButtonData extends BaseData {
}

export interface ItemData extends BaseData {
	formDisplay: string;
}

export interface ImageFormatData {
	use?: string,
	show?: string,
	type?: TreeType,
	couple?: string,
	color?: string,
	chalk?: string,
	gen?: string,
	style1?: string,
	background?: string,
	roots?: {
		type?: string,
		gen?: string,
		color?: string
	},
	default?: {
		type?: TreeType,
		couple?: string,
		color?: string,
		gen?: string,
		style1?: string,
	}
}

export interface GroupData extends BaseData {
	group: {
		id: string,
		header?: string
		images: OptionImageData[]
	};
}

export enum TreeType {
	ANCESTRY = 'ANCESTRY',
	DESCENDANT = 'DESCENDANT'
}

export interface ValueInformation {
	option: string,
	value: any[],
	cost: number
}

export interface ShopPage {
	destroyMulti(): void,

	data: TreeArtPage
}