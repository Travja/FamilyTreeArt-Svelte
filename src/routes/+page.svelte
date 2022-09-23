<script lang="ts">
  import Builder from '$lib/ui/Builder.svelte';
  import { page, PageHelper } from '$lib/pages';
  import ShopPage from '$lib/pages/ShopPage.svelte';
  import { onDestroy, onMount } from 'svelte';

  let shopComponent: ShopPage;
  let pageHelper: PageHelper = new PageHelper();

  onMount(() => {});

  onDestroy(() => {
    pageHelper.destroy();
  });

  const resetMultiSelect = () => shopComponent?.destroyMulti();
</script>

<Builder on:change-page={resetMultiSelect} {pageHelper}>
  {#if $page}
    <ShopPage data={$page} bind:this={shopComponent} />
  {/if}
  <!--<svelte:component this='{pageElement}'></svelte:component>-->
  <!--<button on:click={() => pageElement = pageElement == Page1 ? Page2 : Page1}>Click Me</button>-->
</Builder>
