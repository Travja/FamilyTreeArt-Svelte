<script lang='ts'>
	import Builder from '$lib/ui/Builder.svelte';
	import { page, PageHelper } from '$lib/pages';
	import ShopPage from '$lib/pages/ShopPage.svelte';
	import { multiSelectEntries } from '$lib/interpreter';
	import type { ShopPage } from '$lib/conf/TreeArtConfig';
	import { onDestroy, onMount } from 'svelte';

	let shopComponent: ShopPage;
	let pageHelper: PageHelper = new PageHelper();

	onMount(() => {
	});

	onDestroy(() => {
		pageHelper.destroy();
	});

	const resetMultiSelect = (e) => {
		// console.log('Changed page: ' + e.detail);
		shopComponent?.destroyMulti();
		console.log($multiSelectEntries);
	};
</script>

<Builder on:change-page={resetMultiSelect}
				 {pageHelper}>
	{#if $page}
		<ShopPage data='{$page}' bind:this={shopComponent} />
	{/if}
	<!--<svelte:component this='{pageElement}'></svelte:component>-->
	<!--<button on:click={() => pageElement = pageElement == Page1 ? Page2 : Page1}>Click Me</button>-->
</Builder>

