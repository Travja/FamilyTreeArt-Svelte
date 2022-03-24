<script lang='ts'>
	import type { ButtonOption, GroupData, ImageOption, TreeArtPage } from '$lib/conf/TreeArtConfig';
	import { TreeArtConfig } from '$lib/conf/TreeArtConfig';
	import { onMount } from 'svelte';
	import { getImage } from '../interpreter';

	export let config: TreeArtConfig;
	export let data: TreeArtPage;

	let loading = true;
	let options: (ImageOption | ButtonOption)[];
	let groups: any = {};
	let numOptions: any = {};

	$: {
		options = <(ImageOption | ButtonOption)[]>data?.options;

		for (let opt: (ImageOption | ButtonOption) of options) {
			let key = 'images' in opt ? 'images' : ('buttons' in opt ? 'buttons' : 'items');
			if (key in opt) {
				numOptions[opt.id] = opt[key].length;
				for (let img: (ImageData | GroupData) of opt[key]) {
					if ('group' in img) {
						numOptions[opt.id] += img.group.images.length - 1;
					}
				}
			}
		}

		console.log(numOptions);

	}

	onMount(() => {
		loading = false;
	});

</script>

<container>
	{#if loading || !data}
		<h2 id='optionTitle'>Hold tight!</h2>
		<div class='instructions'>The webpage is loading! If it doesn't load in a few seconds, please refresh the page. If
			it
			still doesn't load, email us and let us know!
		</div>
	{:else}
		<h2 class='optionTitle'>{@html data.title}</h2>
		{#if data.intro && data.intro.length > 0}
			<div class='instructions'>{@html data.intro}</div>
		{/if}
		<div id='options'>
			{#each options as opt}
				<div class='option'>
					<div class='optionLabel'>{@html opt.name}</div>

					<!-- ImageOption -->
					{#if opt.images}
						<div class='imgSelect'>
							{#each opt.images as img}
								<!-- Groups! -->
								{#if img.group}
									<div id='{img.group.id}' class='grouping flex-2'>
										<div class='flex-1'>{@html img.group.header}</div>
										{#each img.group.images as gImg}
											<div class='imgContainer flex-{Math.min(4, img.group.images.length)}'>
												<div class='optText'>{@html gImg.displayText}</div>
												<div class='imgBox'>
													<img class='imgOption' src='{gImg.displayImage}' alt='{gImg.key}' />
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<div class='imgContainer flex-{Math.min(4, numOptions[opt.id])}'
											 class:selected={img.default}>
										<div class='optText'>{@html img.displayText}</div>
										<div class='imgBox'>
											<img class='imgOption'
													 src='{img.displayImage ? img.displayImage : getImage(img)}'
													 style='background: {img.background}'
													 alt='{img.key}' />
										</div>
									</div>
								{/if}
							{/each}
						</div>
						<!-- ButtonOption -->
					{:else if opt.buttons}
						<div class='imgSelect'>
							{#each opt.buttons as button}
								<div class='imgContainer flex-{Math.min(4, numOptions[opt.id])} textButton'
										 class:selected={button.default}>
									<div class='optText'>{button.displayText}</div>
								</div>
							{/each}
						</div>
						<!-- ItemOption -->
					{:else if opt.items}
						<select>
							<option value='-1'></option>
							{#each opt.items as item, i}
								<option value='{item}' selected='{item.default}'>{item.displayText}</option>
							{/each}
						</select>
						<!-- Text :D -->
					{:else if opt.type == 'text'}
						<input type='text' placeholder='{opt.placeholder}' />
					{:else if opt.type == 'date'}
						<input type='date' />
					{:else if opt.type == 'textLong'}
						<textarea placeholder='{opt.placeholder}' class='{opt.id}'></textarea>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</container>

<style>
    .option {
        position: relative;
        /*display: flex;*/
        /*align-items: center;*/
        width: 100%;
        margin: 5px 0 5px 0;
    }

    .imgSelect {
        position: relative;
        width: 100%;
        display: flex;
        align-items: normal;
        flex-wrap: wrap;
        text-align: center;
    }

    .imgContainer {
        /*flex-grow: 1;*/
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
        transition: background-color 0.5s;
        border-radius: 8px;
        min-width: 100px;
    }

    .imgContainer:hover {
        cursor: pointer;
        background-color: #aaa;
    }

    .imgContainer.selected {
        background-color: #999;
    }

    .optText {
        display: flex;
        flex-grow: 1;
        flex-wrap: wrap;
        flex-direction: column;
        /*justify-content: center;*/
    }

    .imgBox {
        position: relative;
    }

    #roots .imgBox {
        margin-top: -60%;
    }

    .grouping {
        /*flex-grow: 2;*/
        flex-basis: 50%;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        padding-top: 10px;
        text-align: center;
        box-sizing: border-box;
        transition: background-color 0.5s;
        border-radius: 8px;
        min-width: 100px;
    }

    .optionLabel {
        display: inline;
        vertical-align: top;
    }

    .textButton {
        background-color: #bbb;
        border: 5px solid #ccc;
        box-sizing: border-box;
        border-radius: 12px;
    }

    textarea {
        width: 50%;
        resize: none;
    }
</style>