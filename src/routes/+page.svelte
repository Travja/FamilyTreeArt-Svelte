<script lang='ts'>
  import Builder from '$lib/ui/Builder.svelte';
  import { currentPage, page, PageHelper } from '$lib/pages.svelte';
  import ShopPage from '$lib/pages/ShopPage.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { deleteCache, hasPreviousSelections, loadPrevious } from '$lib/data-store';
  import { slide } from 'svelte/transition';
  import { multiSelectEntries, selections } from '$lib/interpreter';

  let shopComponent: ShopPage = $state();
  let pageHelper: PageHelper = new PageHelper();
  let hasPrevious = $state(false);

  onMount(() => hasPrevious = hasPreviousSelections());

  onDestroy(() => {
    pageHelper.destroy();
  });

  const proceed = (load = false) => {
    if (load) loadPrevious();
    else {
      currentPage.set(0);
      selections.set({});
      multiSelectEntries.set({});
      deleteCache();
    }
    hasPrevious = false;
  };
</script>

{#if !hasPrevious}
  <div transition:slide>
    <Builder {pageHelper}>
      {#if $page}
        <ShopPage bind:this={shopComponent} />
      {/if}
    </Builder>
  </div>
{:else}
  <div class='load-previous' transition:slide>
    <h3>Previous Tree in Progress</h3>
    <p>
      It looks like you have a previous tree in progress.
      You can load your previous tree or start a new one.
    </p>
    <button onclick={() => proceed(true)}>Load</button>
    <button onclick={() => proceed()}>New</button>
  </div>
{/if}

<style>
    .load-previous {
        text-align: center;
        background-color: rgba(100, 100, 100, 0.1);
        padding: 5em;
    }
</style>