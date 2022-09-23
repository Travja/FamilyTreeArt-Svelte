import { multiSelectEntries, selections } from './interpreter';

export const saveSelections = (selections): void => {
  if (typeof window == 'undefined' || Object.keys(selections).length == 0)
    return;
  localStorage.setItem('tree-selections', btoa(JSON.stringify(selections)));
};

export const saveMultiData = (entries): void => {
  if (typeof window == 'undefined' || Object.keys(entries).length == 0) return;
  localStorage.setItem('tree-multi', btoa(JSON.stringify(entries)));
};

export const hasPreviousSelections = (): boolean => {
  if (typeof window == 'undefined') return;
  return !!localStorage.getItem('tree-selections');
};

export const loadPrevious = (): void => {
  if (typeof window == 'undefined') return;
  selections.set(JSON.parse(atob(localStorage.getItem('tree-selections'))));
  multiSelectEntries.set(JSON.parse(atob(localStorage.getItem('tree-multi'))));
};

export const deleteCache = (): void => {
  localStorage.removeItem('tree-selections');
  localStorage.removeItem('tree-multi');
};
