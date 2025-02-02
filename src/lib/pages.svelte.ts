import type { Unsubscriber, Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { TreeArtPage } from './conf/TreeArtConfig';
import { config } from './conf/config';
import { requirementsMet, selections } from './interpreter';

export const page: Writable<TreeArtPage> = writable();
export const currentPage: Writable<number> = writable(0);
export const visitedLast: Writable<boolean> = writable(false);

export class PageHelper {
  public nextPage: number = $state(-1);
  public previousPage: number = $state(-1);
  public pageCount: number = $state(0);
  public error: string = $state('');
  unsubIdx: Unsubscriber;
  selSub: Unsubscriber;

  constructor() {
    this.pageCount = config.pages.length;
    this.unsubIdx = currentPage.subscribe(idx => this.initPages(idx));
    this.selSub = selections.subscribe(() => this.initPages(get(currentPage)));
  }

  destroy = (): void => {
    this.unsubIdx();
    this.selSub();
  };

  private initPages = (idx: number): void => {
    if (idx == -1) return;
    const pg = config.pages[idx];
    if (pg.finalPage) visitedLast.set(true);
    page.set(pg);

    if (idx + 1 >= this.pageCount) this.nextPage = -1;
    for (let i = idx + 1; i < this.pageCount; i++) {
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
    if (this.nextPage == idx) {
      this.nextPage = -1;
    }

    if (this.previousPage == idx) this.previousPage = -1;

    // console.log('Next page: ' + this.nextPage);
    // console.log('Previous page: ' + this.previousPage);
  };

  gotoNextPage = () => {
    let current = get(currentPage);
    for (let i = current + 1; i < this.pageCount; i++) {
      let next = config.pages[i];
      // console.log('n ' + i + ' ' + next?.meetsRequirements());
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
    currentPage.set(this.previousPage);
  };
}
