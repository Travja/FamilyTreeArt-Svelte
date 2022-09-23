<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { config } from '$lib/conf/config';
  import { composite, selections, totalCost } from '$lib/interpreter';
  import { currentPage, page, PageHelper, visitedLast } from '$lib/pages';
  import { svgStyle } from '$lib/conf/fonts';
  import type { Unsubscriber } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { canvasManager, customSvg, loading, myCanvas } from '$lib/canvas-manager';
  import PayPalWidget from '$lib/ui/PayPalWidget.svelte';

  export let pageHelper: PageHelper;

  const dispatch = createEventDispatcher();

  let hideCost = false;

  let unsub: Unsubscriber;

  onMount(() => {
    unsub = currentPage.subscribe(page => {
      dispatch('change-page', page);
      setTimeout(() =>
          window.scrollTo(0, document.getElementById('contentWrapper').offsetTop),
        250);
    });
    canvasManager.processImg();
  });

  onDestroy(() => {
    if (unsub) unsub();
  });

  let saveTree = () => {
    let link = document.createElement('a');
    link.setAttribute('download', 'MyTree.png');
    link.setAttribute(
      'href',
      $myCanvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
    );
    link.click();
  };
</script>

<div id="contentWrapper">
  <div id="item-wrapper">
    <div id="item-builder">
      <canvas
        id="builder-canvas"
        width="640"
        height="819"
        bind:this={$myCanvas}
      />
      <svg
        id="svgBox"
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        bind:this={$customSvg}
      >
        <defs>{@html svgStyle}</defs>

        <foreignObject width="100%" height="100%">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="resize
							        {$selections[`nameLoc`]?.position || `left`}
                      {$composite?.color?.toLowerCase()}
                      {$composite?.color?.toLowerCase() != `chalk`
              ? $selections[`familyFont`]?.font?.toLowerCase() || `mtype`
              : ``}"
            class:shift={!!$composite?.roots}
            id="familyWrapper"
          >
            <div class="resize" id="familyText">
              {$selections['familyName'] || ''}
            </div>
            <div id="lineTwo">{$selections['lineTwo'] || ''}</div>
          </div>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="resize
							        {$selections[`quoteLoc`]?.position || `right`}
                      {$composite?.color?.toLowerCase()}
										  {$composite?.color?.toLowerCase() != `chalk`
              ? $selections[`quoteFont`]?.font?.toLowerCase() || `mtype`
              : ``}"
            class:shift={!!$composite?.roots}
            id="quoteText"
          >
            {$selections['quote'] || ''}
          </div>
        </foreignObject>

        <!-- Path should be shifted if we are not showing roots -->
        <path
          id="curve"
          class:shift={!$composite?.roots}
          d="M0,71.5
								 C0,71.5 25,74 50,72 S
								 85,71 100,72.5"
          fill="transparent"
        />
        <text x="50%">
          <textPath
            class="resize
													 resizeGround
													 {$composite?.color?.toLowerCase()}
													 {$selections[`groundFont`]?.font?.toLowerCase() || `mtype`}"
            id="groundText"
            href="#curve"
            font-family=", sans-serif"
          >
            {$selections['ground'] ||
            ($composite?.roots
              ? 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
              : '')}
          </textPath>
        </text>
      </svg>
      {#if $loading}
        <div class="cover" transition:fade={{ duration: 200 }}>
          <span>Loading...</span>
        </div>
      {/if}
      {#if $selections['background']}
        <div id="save" class="cover" on:click={saveTree}>Save Preview</div>
      {/if}
    </div>
    <div class="clear" />
    <div id="item-footer">
      This is only a representation to help you select design elements. Your
      tree, like your family, will be unique!
    </div>
  </div>
  <div id="configuration">
    <slot />
    <div class="clear" />
    <div id="pageFooter">
      {#if pageHelper.error !== ''}
        <div id="error">{pageHelper.error}</div>
      {/if}
      {#if config.pages[$currentPage].footer}
        <hr />
        <div class="footer">
          {@html config.pages[$currentPage].footer}
        </div>
      {/if}
      {#if pageHelper.previousPage != -1}
        <button id="back" on:click={pageHelper.gotoPreviousPage}
        ><p>&laquo; Back</p></button
        >
      {/if}
      {#if pageHelper.nextPage != -1}
        <button id="next" on:click={pageHelper.gotoNextPage}
        ><p>Next &raquo;</p></button
        >
      {/if}
    </div>
    <div id="total" class="toggleable-cost" class:hidden={hideCost}>
      <h3>Total: ${$totalCost.toFixed(2)}</h3>
    </div>
    <div class="clear" />
    {#if $page?.finalPage}
      <PayPalWidget />
    {:else if $visitedLast}
      <button id="skip" on:click={() => currentPage.set(pageHelper.pageCount - 1)}>Jump to Cart</button>
    {/if}
  </div>
</div>

<style>
  #contentWrapper {
    position: relative;
    flex-direction: row;
    align-items: flex-start;
    display: flex;
    z-index: 5;
    padding: 20px;
    min-width: 743px;
    margin: 0 auto 10px;
    background-color: rgba(100, 100, 100, 0.1);
  }

  #item-wrapper {
    position: sticky;
    /*float: left;*/
    top: 20px;
    z-index: 10;
    flex-grow: 0;
    /*display: inline-block;*/
    min-width: 230px;
    /*width: 25vw;*/
    width: 340px;
    /*margin-right: 45px;*/
  }

  #item-builder {
    position: relative;
    /*width: 340px;*/
    height: 435px;
    width: 100%;
    /*height: 31.81vw;*/
    min-height: 310px;
    background-color: white;
    box-shadow: inset -5px -5px 5px #ccc, inset 5px 5px 5px #ccc;
    background-size: cover;
    border-radius: 5px;
    display: inline-block;
  }

  #builder-canvas {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  #configuration {
    position: relative;
    display: block;
    /*text-align: right;*/
    /*float: right;*/
    flex-grow: 1;
    flex-basis: 60%;
    min-width: 490px;
    /*max-width: 50%;*/
    padding: 20px;
    box-sizing: border-box;
    background-color: #cccccc;
    border-radius: 10px;
    box-shadow: #333 5px 5px 10px;
    margin-left: 20px;
    z-index: 15;
  }

  #quoteText,
  #familyWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #familyWrapper,
  #quoteText {
    font-size: 0.21rem;
    position: absolute;
    word-wrap: normal;
    height: 10%;
    width: 35%;
    z-index: 10;
    text-align: center;
    /*background-color: #dd9900;*/
  }

  #lineTwo {
    font-size: 0.87em;
  }

  #familyWrapper,
  #quoteText,
  #groundText {
    display: none;
  }

  @media screen and (max-width: 900px) {
    #contentWrapper {
      flex-direction: column;
      min-width: 200px;
    }

    #item-wrapper {
      float: none;
      margin: 0 auto;
    }

    #item-footer {
      text-align: center;
      font-size: 0.9em;
    }

    #configuration {
      margin: 10px;
      min-width: 200px;
    }
  }

  #item-footer {
    font-size: 0.9em;
  }

  /**SVG**/
  svg {
    color: black;
    font-size: 0.2em;
    position: absolute;
    left: 0;
    z-index: 100;
  }

  text {
    text-anchor: middle;
  }

  textPath {
    alignment-baseline: hanging;
  }

  /** Footer **/
  #pageFooter,
  .footer {
    position: relative;
    margin: 20px;
  }

  #next {
    float: right;
    margin-left: 20px;
  }

  #back {
    float: left;
    margin-right: 20px;
  }

  #total {
    display: block;
    min-width: 100px;
    max-width: 200px;
    text-align: center;
    margin: 20px auto;
  }

  .toggleable-cost.hidden,
  .toggleable-cost.hidden * {
    height: 0;
    width: 0;
    padding: 0;
    margin: 0;
  }

  svg {
    display: none;
  }

  .cover {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-size: 1.5em;

    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.4);
  }

  #save {
    border: 3px dashed black;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  #save:hover {
    cursor: pointer;
    opacity: 1;
  }

  #skip {
    display: block;
    margin: 0 auto;
    text-align: center;
  }
</style>
