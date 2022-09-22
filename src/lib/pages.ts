import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { TreeArtPage } from './conf/TreeArtConfig';
import { config } from './conf/config';
import { requirementsMet, selections } from './interpreter';

export const page: Writable<TreeArtPage> = writable();
export const currentPage: Writable<number> = writable(0);

export class PageHelper {
	public nextPage: number = -1;
	public previousPage: number = -1;
	public pageCount: number = 0;
	public error: string = '';
	unsubIdx: Unsubscriber;
	selSub: Unsubscriber;

	constructor() {
		this.unsubIdx = currentPage.subscribe(idx => {
			console.log('Current Page: ' + idx);
			this.initPages();
		});

		this.selSub = selections.subscribe(this.initPages);
	}

	destroy = (): void => {
		this.unsubIdx();
		this.selSub();
	};

	private initPages = (): void => {
		let idx = get(currentPage);
		page.set(config.pages[idx]);
		for (let i = idx + 1; i < config.pages.length; i++) {
			let next = config.pages[i];
			// console.log('n ' + i + ' ' + next?.meetsRequirements());
			if (next?.meetsRequirements()) {
				this.nextPage = i;
				break;
			} else {
				this.nextPage = -1;
			}
		}
		for (let i = idx - 1; i >= 0; i--) {

			let prev = config.pages[i];
			// console.log('p ' + i + ' ' + prev?.meetsRequirements());
			if (prev?.meetsRequirements()) {
				this.previousPage = i;
				break;
			} else {
				this.previousPage = -1;
			}
		}
		{
			if (this.nextPage == idx) {
				this.nextPage = -1;
			}
		}

		if (this.previousPage == idx)
			this.previousPage = -1;

		// console.log('Next page: ' + this.nextPage);
		// console.log('Previous page: ' + this.previousPage);
	};

	gotoNextPage = () => {
		console.log(';(');
		let current = get(currentPage);
		for (let i = current + 1; i < this.pageCount; i++) {
			let next = config.pages[i];
			console.log('n ' + i + ' ' + next?.meetsRequirements());
			if (next?.meetsRequirements()) {
				this.nextPage = i;
				break;
			} else {
				this.nextPage = -1;
			}
		}

		if (!requirementsMet(config.pages[current])) {
			this.error = 'One or more required items do not have a selection.';
			return;
		}

		this.error = '';
		if (this.nextPage !== -1) {
			currentPage.set(this.nextPage);
		}
	};

	gotoPreviousPage = () => {
		console.log('Going back.');
		currentPage.set(this.previousPage);
	};
}