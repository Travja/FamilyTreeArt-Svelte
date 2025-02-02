import { multiSelectEntries, selections } from './interpreter';
import { get } from 'svelte/store';
import { currentPage, visitedLast } from './pages.svelte';

currentPage.subscribe(page => {
  if (typeof window == 'undefined' || !localStorage) return;
  const previous = parseInt(localStorage.getItem('furthest-page'));
  if (!previous || page != 0)
    localStorage.setItem('furthest-page', page.toString());
});

visitedLast.subscribe(visited => {
  if (typeof window == 'undefined' || !localStorage || !visited) return;
  localStorage.setItem('visited-last', String(get(visitedLast)));
});

export const saveSelections = (selections): void => {
  if (typeof window == 'undefined' || Object.keys(selections).length == 0)
    return;
  localStorage.setItem(
    'tree-selections',
    window.btoa(encodeURIComponent(JSON.stringify(selections)))
  );
};

export const saveMultiData = (entries): void => {
  if (typeof window == 'undefined' || Object.keys(entries).length == 0) return;
  localStorage.setItem(
    'tree-multi',
    window.btoa(encodeURIComponent(JSON.stringify(entries)))
  );
};

export const hasPreviousSelections = (): boolean => {
  if (typeof window == 'undefined') return;
  return !!localStorage.getItem('tree-selections');
};

export const loadPrevious = (): void => {
  if (typeof window == 'undefined') return;
  currentPage.set(Math.max(parseInt(localStorage.getItem('furthest-page')) || 0, 0));
  if (localStorage.getItem('visited-last'))
    visitedLast.set(localStorage.getItem('visited-last') == 'true');

  selections.set(
    JSON.parse(
      decodeURIComponent(window.atob(localStorage.getItem('tree-selections')))
    )
  );
  if (localStorage.getItem('tree-multi'))
    multiSelectEntries.set(
      JSON.parse(
        decodeURIComponent(window.atob(localStorage.getItem('tree-multi')))
      )
    );
};

export const deleteCache = (): void => {
  localStorage.removeItem('tree-selections');
  localStorage.removeItem('tree-multi');
  localStorage.removeItem('furthest-page');
  localStorage.removeItem('visited-last');
};
