<script lang='ts'>
  import Builder from '$lib/ui/Builder.svelte';
  import { page, PageHelper } from '$lib/pages';
  import ShopPage from '$lib/pages/ShopPage.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { deleteCache, hasPreviousSelections, loadPrevious } from '$lib/data-store';
  import { slide } from 'svelte/transition';

  let shopComponent: ShopPage;
  let pageHelper: PageHelper = new PageHelper();
  let hasPrevious = false;

  onMount(() => {
    hasPrevious = hasPreviousSelections();
    if (hasPrevious)
      setTimeout(() => {
        loadPrevious();
        hasPrevious = false;
      }, 500);
  });

  onDestroy(() => {
    pageHelper.destroy();
  });

  const proceed = (load = false) => {
    if (load) loadPrevious();
    else deleteCache();
    hasPrevious = false;
  };
</script>

{#if !hasPrevious}
  <div transition:slide>
    <Builder {pageHelper}>
      {#if $page}
        <ShopPage bind:this={shopComponent} />
      {/if}
      <!--<svelte:component this='{pageElement}'></svelte:component>-->
      <!--<button on:click={() => pageElement = pageElement == Page1 ? Page2 : Page1}>Click Me</button>-->
    </Builder>
  </div>
{:else}
  <div class='load-previous' transition:slide>
    <h3>Previous Tree in Progress</h3>
    <p>
      Looks like you have a previous tree in progress.
      You can load your previous tree or start a new one.
    </p>
    <button on:click={() => proceed(true)}>Load</button>
    <button on:click={() => proceed()}>New</button>
  </div>
{/if}

<style>
  .load-previous {
    text-align: center;
    background-color: rgba(100, 100, 100, 0.1);
    padding: 5em;
  }
</style>