<script lang='ts'>
  import { onDestroy, onMount } from 'svelte';
  import { config } from '$lib/conf/config';
  import { composite, selections, totalCost } from '$lib/interpreter';
  import { currentPage, page, PageHelper, visitedLast } from '$lib/pages';
  import { svgStyle } from '$lib/conf/fonts';
  import type { Unsubscriber } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { canvasManager, customSvg, loading, myCanvas } from '$lib/canvas-manager';
  import PayPalWidget from '$lib/ui/PayPalWidget.svelte';
  import CouponBox from '$lib/ui/CouponBox.svelte';
  import { isBaseData } from '$lib/conf/util.js';

  interface Props {
    pageHelper: PageHelper;
    children?: import('svelte').Snippet;
  }

  let { pageHelper, children }: Props = $props();

  let hideCost = false;

  let unsub: Unsubscriber;

  onMount(() => {
    unsub = currentPage.subscribe(() => {
      setTimeout(() => {
          if ($currentPage > 0) {
            window.scrollTo(0, document.getElementById('contentWrapper').offsetTop);
          }
        },
        250);
    });
    canvasManager.processImg(true);
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

<div id='contentWrapper'>
  <div id='item-wrapper'>
    <div id='item-builder'>
      <canvas
        bind:this={$myCanvas}
        height='819'
        id='builder-canvas'
        width='640'
></canvas>
      <svg
        bind:this={$customSvg}
        height='100%'
        id='svgBox'
        preserveAspectRatio='none'
        viewBox='0 0 100 100'
        width='100%'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>{@html svgStyle}</defs>

        <foreignObject height='100%' width='100%'>
          <div
            class='resize
							        {isBaseData($selections.nameLoc) ? $selections.nameLoc?.position || `left` : `left`}
                      {$composite?.color?.toLowerCase()}
                      {$composite?.color?.toLowerCase() !== `chalk`
              ? isBaseData($selections.familyFont) ? $selections.familyFont?.font?.toLowerCase() || `mtype` : `mtype`
              : ``}'
            class:shift={!!$composite?.roots}
            id='familyWrapper'
            xmlns='http://www.w3.org/1999/xhtml'
          >
            <div class='resize' id='familyText'>
              {$selections['familyName'] || ''}
            </div>
            <div id='lineTwo'>{$selections['lineTwo'] || ''}</div>
          </div>
          <div
            class='resize
							        {isBaseData($selections.quoteLoc) ? $selections.quoteLoc?.position || `right` : `right`}
                      {$composite?.color?.toLowerCase()}
										  {$composite?.color?.toLowerCase() !== `chalk`
              ? isBaseData($selections.quoteFont) ? $selections.quoteFont?.font?.toLowerCase() || `mtype` : `mtype`
              : ``}'
            class:shift={!!$composite?.roots}
            id='quoteText'
            xmlns='http://www.w3.org/1999/xhtml'
          >
            {$selections['quote'] || ''}
          </div>
        </foreignObject>

        <!-- Path should be shifted if we are not showing roots -->
        <path
          class:shift={!$composite?.roots}
          d='{isBaseData($selections.flatGround) && $selections.flatGround?.key === `yes` ? `M0,71.5 100,71.5` : `M0,71.5
								 C0,71.5 25,74 50,72 S
								 85,71 100,72.5`}'
          fill='transparent'
          id='curve'
        />
        <text x='50%'>
          <textPath
            class='resize
													 resizeGround
													 {$composite?.color?.toLowerCase()}
													 {isBaseData($selections.groundFont) ? $selections.groundFont?.font?.toLowerCase() || `mtype` : `mtype`}'
            font-family=', sans-serif'
            href='#curve'
            id='groundText'
          >
            {$selections['ground'] ||
            ($composite?.roots
              ? 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
              : '')}
          </textPath>
        </text>
      </svg>
      {#if $loading}
        <div class='cover' transition:fade={{ duration: 200 }}>
          <span>Creating...</span>
        </div>
      {/if}
      {#if $selections.background}
        <div id='save'
             class='cover'
             role='button'
             tabindex='0'
             onclick={saveTree}
             onkeypress={(e) => e.key === 'Enter' && saveTree()}
        >
          Save Preview
        </div>
      {/if}
    </div>
    <div class='clear'></div>
    <div id='item-footer'>
      This is only a representation to help you select design elements. Your
      tree, like your family, will be unique!
    </div>
  </div>
  <div id='configuration'>
    {@render children?.()}
    <div class='clear'></div>
    <div id='pageFooter'>
      {#if pageHelper.error !== ''}
        <div id='error'>{pageHelper.error}</div>
      {/if}
      {#if config.pages[$currentPage].footer}
        <hr />
        <div class='footer'>
          {@html config.pages[$currentPage].footer}
        </div>
      {/if}
      {#if pageHelper.previousPage !== -1}
        <button id='back' onclick={pageHelper.gotoPreviousPage}
        >
          <span>&laquo; Back</span>
        </button
        >
      {/if}
      {#if pageHelper.nextPage !== -1}
        <button id='next' onclick={pageHelper.gotoNextPage}>
            <span>Next &raquo;</span>
        </button>
      {/if}
    </div>
    <div class='toggleable-cost' class:hidden={hideCost} id='total'>
      <h3>Total: ${$totalCost.toFixed(2)}</h3>
    </div>
    <div class='clear'></div>
    {#if $page?.finalPage}
      <CouponBox />
      <PayPalWidget />
    {:else if $visitedLast}
      <button id='skip' onclick={() => currentPage.set(pageHelper.pageCount - 1)}>Jump to Cart</button>
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
        width: 100%;
        aspect-ratio: .7816;
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
        height: 14%;
        width: 35%;
        z-index: 10;
        text-align: center;
    }

    #lineTwo {
        font-size: 0.87em;
    }

    @media screen and (max-width: 900px) {
        #contentWrapper {
            flex-direction: column;
            max-width: 100%;
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
        z-index: 10;
        left: 0;
        user-select: none;
        opacity: 0;
    }

    foreignObject {
        position: relative;
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
        position: relative;
        z-index: 20;
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
