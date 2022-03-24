<script>

	export let pageCount = 0;
	export let currentPage = 0;
	export let nextPage = -1;
	export let previousPage = -1;

	let cost = 0;
	let costFormatted;
	let hideCost = false;

	$: costFormatted = cost.toFixed(2);
</script>

<div id='contentWrapper'>
	<div id='item-wrapper'>
		<div id='item-builder'>
			<div class='resize' id='familyWrapper'>
				<div class='resize' id='familyText'></div>
				<div id='lineTwo'></div>
			</div>
			<div class='resize' id='quoteText'></div>
			<svg id='svgBox' height='100%' width='100%' viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path id='curve' d='M0,71.5
                  C0,71.5 25,74 50,72 S
                  85,71 100,72.5'></path>
				<text x='50%'>
					<textPath class='resize resizeGround' id='groundText' xlink:href='#curve'></textPath>
				</text>
			</svg>
		</div>
		<div class='clear'></div>
		<div id='item-footer'>This is only a representation to help you select design elements. Your tree, like your family,
			will be unique!
		</div>
	</div>
	<div id='configuration'>
		<slot />
		<div id='pageFooter'>
			<div id='error'></div>
			{#if previousPage != -1}
				<button id='back' on:click={() => currentPage = previousPage}><p>&laquo; Back</p></button>
			{/if}
			{#if nextPage != -1}
				<button id='next' on:click={() => currentPage = nextPage}><p>Next &raquo;</p></button>
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
        font-size: 1.3vw;
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
        top: 0.5%;
        left: 0;
        z-index: 100;
    }

    /*svg.shifted {*/
    /*    top: 19%;*/
    /*}*/

    path {
        fill: transparent;
        /*stroke: rgb(255, 0, 0);*/
        /*stroke-width: 0.1;*/
    }

    text {
        text-anchor: middle;
        /*fill: #FF9800;*/
    }

    #groundText {
        font-family: "MType", serif;
    }

    textPath {
        alignment-baseline: hanging;
    }


    /** Footer **/
    #pageFooter, #pagePreFooter {
        position: relative;
        margin: 20px;
    }

    button {
        float: right;
        border: 2px solid #77a34f;
        border-radius: 8px;
        padding: 10px;
        font-family: Lato;
        font-size: 20px;
        margin: 5px 0;
        user-select: none;
    }

    button:hover, .item:hover {
        background-color: rgba(0, 0, 0, 0.15) !important;
    }

    button:active, .item:active {
        background-color: rgba(0, 0, 0, 0.25) !important;
    }

    button > p {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        user-select: none;
    }

    #next {
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