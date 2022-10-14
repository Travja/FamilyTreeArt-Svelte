import { multiSelectEntries, selections } from './interpreter';
import { get } from 'svelte/store';
import { currentPage } from './pages';

export const saveSelections = (selections): void => {
  if (typeof window == 'undefined' || Object.keys(selections).length == 0)
    return;
  localStorage.setItem('tree-selections', window.btoa(encodeURIComponent(JSON.stringify(selections))));
  localStorage.setItem('furthest-page', get(currentPage).toString());
};

export const saveMultiData = (entries): void => {
  if (typeof window == 'undefined' || Object.keys(entries).length == 0) return;
  localStorage.setItem('tree-multi', window.btoa(encodeURIComponent(JSON.stringify(entries))));
};

export const hasPreviousSelections = (): boolean => {
  if (typeof window == 'undefined') return;
  return !!localStorage.getItem('tree-selections');
};

export const loadPrevious = (): void => {
  if (typeof window == 'undefined') return;
  currentPage.set(parseInt(localStorage.getItem('furthest-page')) || 0);
  selections.set(JSON.parse(decodeURIComponent(window.atob(localStorage.getItem('tree-selections')))));
  if (localStorage.getItem('tree-multi'))
    multiSelectEntries.set(JSON.parse(decodeURIComponent(window.atob(localStorage.getItem('tree-multi')))));
};

export const deleteCache = (): void => {
  localStorage.removeItem('tree-selections');
  localStorage.removeItem('tree-multi');
  localStorage.removeItem('furthest-page');
};
