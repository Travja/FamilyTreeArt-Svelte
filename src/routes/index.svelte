<script lang='ts'>
	import Builder from '$lib/ui/Builder.svelte';
	import { config } from '$lib/conf/config';
	import ShopPage from '../lib/pages/ShopPage.svelte';

	let pages = config.pages;
	let activeIndex = 0;
	let activePage;
	let nextPage: number = -1;
	let previousPage: number = -1;

	$: {
		console.log('Current page: ' + activeIndex);
		activePage = pages[activeIndex];
		console.log(activePage);

		for (let i = activeIndex + 1; i < pages.length; i++) {
			let next = pages[i];
			console.log('n ' + i + ' ' + next?.meetsRequirements());
			if (next?.meetsRequirements()) {
				nextPage = i;
				break;
			} else {
				nextPage = -1;
			}
		}

		for (let i = activeIndex - 1; i >= 0; i--) {
			let prev = pages[i];
			console.log('p ' + i + ' ' + prev?.meetsRequirements());
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

		console.log('Next page: ' + nextPage);
		console.log('Previous page: ' + previousPage);
	}
</script>

<Builder bind:currentPage={activeIndex}
				 pageCount='{pages.length}'
				 {nextPage}
				 {previousPage}>
	<ShopPage config='{config}' data='{activePage}' />
	<!--<svelte:component this='{pageElement}'></svelte:component>-->
	<!--<button on:click={() => pageElement = pageElement == Page1 ? Page2 : Page1}>Click Me</button>-->
</Builder>

