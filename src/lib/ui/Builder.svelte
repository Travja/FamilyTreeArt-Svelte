<script>
	import { config } from '$lib/conf/config';
	import { canv, requirementsMet, selections, customSvg, composite } from '$lib/interpreter';
	import { svgStyle } from '$lib/conf/fonts';
	import { createEventDispatcher } from 'svelte';

	export const pageCount = 0;
	export let currentPage = 0;
	export let nextPage = -1;
	export let previousPage = -1;

	const dispatch = createEventDispatcher();

	let cost = 0;
	let costFormatted;
	let hideCost = false;
	let error = '';

	$: costFormatted = cost.toFixed(2);

	const gotoNextPage = () => {
		for (let i = currentPage + 1; i < pageCount; i++) {
			let next = config.pages[i];
			console.log('n ' + i + ' ' + next?.meetsRequirements());
			if (next?.meetsRequirements()) {
				nextPage = i;
				break;
			} else {
				nextPage = -1;
			}
		}

		if (!requirementsMet(config.pages[currentPage])) {
			error = 'One or more required items do not have a selection.';
			return;
		}

		error = '';
		if (nextPage !== -1)
			currentPage = nextPage;
		dispatch('change-page', currentPage);
	};

	const gotoPreviousPage = () => {
		console.log('Going back.');
		currentPage = previousPage;
		dispatch('change-page', currentPage);
	};
</script>

<div id='contentWrapper'>
	<div id='item-wrapper'>
		<div id='item-builder'>
			<canvas id='builder-canvas' width='1280' height='1638' bind:this={$canv}>
			</canvas>
			<svg id='svgBox' height='100%' width='100%' viewBox='0 0 100 100' preserveAspectRatio='none'
					 xmlns='http://www.w3.org/2000/svg'
					 bind:this={$customSvg}>
				<defs>{@html svgStyle}</defs>

				<foreignObject width='100%' height='100%'>
					<div xmlns='http://www.w3.org/1999/xhtml'
							 class='resize left {$composite?.color?.toLowerCase()}'
							 class:shift={$composite?.show == 'roots'}
							 id='familyWrapper'>
						<div class='resize' id='familyText'>Family Name</div>
						<div id='lineTwo'>Est. 2022</div>
					</div>
					<div xmlns='http://www.w3.org/1999/xhtml'
							 class='resize right {$composite?.color?.toLowerCase()}'
							 class:shift={$composite?.show == 'roots'}
							 id='quoteText'>Quote Text
					</div>
				</foreignObject>

				<!-- Path should be shifted if we are not showing roots -->
				<path id='curve' class:shift={$composite?.show != 'roots'} d='M0,71.5
	C0,71.5 25,74 50,72 S
	85,71 100,72.5' fill='transparent'></path>
				<text x='50%'>
					<textPath class='resize resizeGround {$composite?.color?.toLowerCase()}' id='groundText' href='#curve'
										font-family='{$selections.groundFont ? $selections.groundFont.font : `MType`}, sans-serif'>
						{$selections.ground ? $selections.ground : 'asdfasdfas'}
					</textPath>
				</text>
			</svg>
		</div>
		<div class='clear'></div>
		<div id='item-footer'>This is only a representation to help you select design elements. Your tree, like your family,
			will be unique! {$composite?.show}
		</div>
	</div>
	<div id='configuration'>
		<slot />
		<div class='clear' />
		<div id='pageFooter'>
			{#if error !== ""}
				<div id='error'>{error}</div>
			{/if}
			{#if config.pages[currentPage].footer}
				<hr />
				<div class='footer'>
					{@html config.pages[currentPage].footer}
				</div>
			{/if}
			{#if previousPage != -1}
				<button id='back' on:click={gotoPreviousPage}><p>&laquo; Back</p></button>
			{/if}
			{#if nextPage != -1}
				<button id='next' on:click={gotoNextPage}><p>Next &raquo;</p></button>
			{/if}
		</div>
		<div id='total' class='toggleable-cost' class:hidden={hideCost}>
			<h3>Total: ${costFormatted}</h3>
		</div>
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

    #quoteText, #familyWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #familyWrapper, #quoteText {
        font-family: MType, serif;
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

    #familyWrapper, #quoteText, #groundText {
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
        /*font-family: 'Luckiest Guy', cursive;*/
        color: black;
        font-size: 0.2em;
        position: absolute;
        left: 0;
        z-index: 100;
    }

    /*svg.shifted {*/
    /*    top: 19%;*/
    /*}*/

    text {
        text-anchor: middle;
        /*fill: #FF9800;*/
    }

    #groundText {
        /*font-family: "MType", serif;*/
    }

    textPath {
        alignment-baseline: hanging;
    }


    /** Footer **/
    #pageFooter, .footer {
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

    .toggleable-cost.hidden, .toggleable-cost.hidden * {
        display: none;
        height: 0;
        width: 0;
        padding: 0;
        margin: 0;
    }

</style>