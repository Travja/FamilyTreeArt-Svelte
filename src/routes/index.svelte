<script lang='ts'>
	import Builder from '$lib/ui/Builder.svelte';
	import { config } from '$lib/conf/config';
	import ShopPage from '../lib/pages/ShopPage.svelte';
	import { multiSelectEntries, selections } from '../lib/interpreter';
	import type { ShopPage } from '$lib/conf/TreeArtConfig';
	import { onDestroy, onMount } from 'svelte';

	let pages = config.pages;
	let activeIndex = 0;
	let activePage;
	let nextPage: number = -1;
	let previousPage: number = -1;
	let shopComponent: ShopPage;
	let unsub;

	onMount(() => unsub = selections.subscribe(initPages));

	onDestroy(() => {
		if (unsub) unsub();
	});

	const initPages = () => {
		for (let i = activeIndex + 1; i < pages.length; i++) {
			let next = pages[i];
			// console.log('n ' + i + ' ' + next?.meetsRequirements());
			if (next?.meetsRequirements()) {
				nextPage = i;
				break;
			} else {
				nextPage = -1;
			}
		}

		for (let i = activeIndex - 1; i >= 0; i--) {
			let prev = pages[i];
			// console.log('p ' + i + ' ' + prev?.meetsRequirements());
			if (prev?.meetsRequirements()) {
				previousPage = i;
				break;
			} else {
				previousPage = -1;
			}
		}

		if (nextPage == activeIndex)
			nextPage = -1;

		if (previousPage == activeIndex)
			previousPage = -1;

		// console.log('Next page: ' + nextPage);
		// console.log('Previous page: ' + previousPage);
	};

	$: {
		console.log('Current page: ' + activeIndex);
		activePage = pages[activeIndex];
		initPages();
	}

	const resetMultiSelect = (e) => {
		// console.log('Changed page: ' + e.detail);
		shopComponent?.destroyMulti();
		console.log($multiSelectEntries);
	};
</script>

<Builder bind:currentPage={activeIndex}
				 on:change-page={resetMultiSelect}
				 pageCount='{pages.length}'
				 {nextPage}
				 {previousPage}>
	<ShopPage config='{config}' data='{activePage}' bind:this={shopComponent} />
	<!--<svelte:component this='{pageElement}'></svelte:component>-->
	<!--<button on:click={() => pageElement = pageElement == Page1 ? Page2 : Page1}>Click Me</button>-->
</Builder>

