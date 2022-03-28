<script lang='ts'>
	import type {
		BaseData,
		ButtonData,
		ButtonOption,
		GroupData,
		ImageOption,
		TreeArtPage
	} from '$lib/conf/TreeArtConfig';
	import { onMount } from 'svelte';
	import {
		getImage,
		getPlaceholderValue,
		getValue,
		meetsPrereqs,
		requirementsNotMet,
		selectItem,
		unset
	} from '../interpreter';
	import type { OptionImageData } from '../conf/TreeArtConfig';

	export let data: TreeArtPage;

	let loading = true;
	let options: (ImageOption | ButtonOption)[];
	let numOptions: any = {};

	$: {
		options = <(ImageOption | ButtonOption)[]>data?.options;

		for (let opt: (ImageOption | ButtonOption) of options) {
			let selected: BaseData | string = getValue(opt.id);
			let selectedValid = true;
			if (typeof selected === 'string') continue;
			if (!meetsPrereqs(selected?.prereq))
				selectedValid = false;

			let key = 'images' in opt ? 'images' : ('buttons' in opt ? 'buttons' : 'items');
			if (key in opt) {
				numOptions[opt.id] = 0;
				for (let img: (OptionImageData | ButtonData | GroupData) of opt[key]) {
					if (!meetsPrereqs(img?.prereq)) continue;

					if ((!selected && 'default' in img && img.default) || (!selectedValid && selected.key == img.key)) {
						selectItem(opt.id, img);
						selected = img;
						selectedValid = true;
					}

					if ('group' in img) {
						for (let data: OptionImageData of img.group.images) {
							if (!meetsPrereqs(data?.prereq)) continue;
							numOptions[opt.id]++;
							if ((!selected && 'default' in data && data.default) || (!selectedValid && selected.key == data.key)) {
								selectItem(opt.id, data);
								selected = data;
								selectedValid = true;
							}
						}
					} else
						numOptions[opt.id]++;
				}
			}

			if (!selectedValid) {
				unset(opt.id);
			}
		}
	}

	onMount(() => loading = false);

	const select = (optId, value) => {
		selectItem(optId, value);
		options = [...options];
	};

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
				{#if !opt.prereq || meetsPrereqs(opt.prereq)}
					<div class='option'>
						<div class='optionLabel'>{@html opt.name}</div>


						<!-- ImageOption -->
						{#if opt.images}
							<div class='imgSelect' class:error={$requirementsNotMet.includes(opt.id)}>
								{#each opt.images as img}
									{#if !img.prereq || meetsPrereqs(img.prereq)}
										<!-- Groups! -->
										{#if img.group}
											<div id='{img.group.id}' class='grouping flex-2'>
												<div class='flex-1'>{@html img.group.header}</div>
												{#each img.group.images as gImg}
													{#if !gImg.prereq || meetsPrereqs(gImg.prereq)}
														<div class='imgContainer flex-{Math.min(4, img.group.images.length)}'
																 on:click={select(opt.id, gImg)}
																 class:selected={getValue(opt.id) == gImg}>
															<div class='optText'>
																{#if gImg.placeholder}
																	{#if getPlaceholderValue(gImg) == '???'}
																		{@html gImg.placeholder}
																	{:else}
																		{@html gImg.displayText.replace("%value%", getPlaceholderValue(gImg))}
																	{/if}
																{:else}
																	{@html gImg.displayText}
																{/if}
															</div>
															<div class='imgBox'>
																<img class='imgOption' src='{gImg.displayImage}' alt='{gImg.key}' />
															</div>
														</div>
													{/if}
												{/each}
											</div>
										{:else}
											<div class='imgContainer flex-{Math.min((opt.flexCount ? opt.flexCount : 4), numOptions[opt.id])}'
													 on:click={select(opt.id, img)}
													 class:selected={getValue(opt.id) == img}>
												<div class='optText'>
													{#if img.placeholder}
														{#if getPlaceholderValue(img) == '???'}
															{@html img.placeholder}
														{:else}
															{@html img.displayText.replace("%value%", getPlaceholderValue(img))}
														{/if}
													{:else}
														{@html img.displayText.replace("%value%", getPlaceholderValue(img))}
													{/if}
												</div>
												<div class='imgBox'>
													<img class='imgOption'
															 src='{img.displayImage ? img.displayImage : getImage(img)}'
															 style='background-image: {img.background}'
															 alt='{img.key}' />
												</div>
											</div>
										{/if}
									{/if}
								{/each}
							</div>
							<!-- ButtonOption -->
						{:else if opt.buttons}
							<div class='imgSelect' class:error={$requirementsNotMet.includes(opt.id)}>
								{#each opt.buttons as button}
									{#if !button.prereq || meetsPrereqs(button.prereq)}
										<div
											class='imgContainer flex-{Math.min((opt.flexCount ? opt.flexCount : 4), numOptions[opt.id])} textButton'
											on:click={select(opt.id, button)}
											class:selected={getValue(opt.id) == button}>
											<div class='optText'>
												{#if button.placeholder}
													{#if getPlaceholderValue(button) == '???'}
														{@html button.placeholder}
													{:else}
														{@html button.displayText.replace("%value%", getPlaceholderValue(button))}
													{/if}
												{:else}
													{@html button.displayText.replace("%value%", getPlaceholderValue(button))}
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
							<!-- ItemOption -->
						{:else if opt.items && (!opt.prereq || meetsPrereqs(opt.prereq))}
							<select on:change={(e) => select(opt.id, opt.items[e.target.selectedIndex - 1])}
											class:error={$requirementsNotMet.includes(opt.id)}>
								<option value='-1'></option>
								{#each opt.items as item, i}
									<option value='{i}' selected='{item.default}'>{item.displayText}</option>
								{/each}
							</select>
							<!-- Text :D -->
						{:else if opt.type == 'text' && (!opt.prereq || meetsPrereqs(opt.prereq))}
							<input type='text' placeholder='{opt.placeholder}'
										 class:error={$requirementsNotMet.includes(opt.id)}
										 on:change={(e) => select(opt.id, e.target.value)}
										 on:keypress={(e) => select(opt.id, e.target.value)}
										 on:paste={(e) => select(opt.id, e.target.value)}
										 on:input={(e) => select(opt.id, e.target.value)}
							/>
						{:else if opt.type == 'date' && (!opt.prereq || meetsPrereqs(opt.prereq))}
							<input type='date'
										 class:error={$requirementsNotMet.includes(opt.id)}
										 on:change={(e) => select(opt.id, e.target.value)} />
						{:else if opt.type == 'textLong' && (!opt.prereq || meetsPrereqs(opt.prereq))}
							<textarea placeholder='{opt.placeholder}' class='{opt.id}'
												class:error={$requirementsNotMet.includes(opt.id)}
												on:change={(e) => select(opt.id, e.target.value)}
												on:keypress={(e) => select(opt.id, e.target.value)}
												on:paste={(e) => select(opt.id, e.target.value)}
												on:input={(e) => select(opt.id, e.target.value)}>
							</textarea>
						{/if}
						<!-- TODO Figure out stuff for multiselect -->
					</div>
				{/if}
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

    .error {
        border: 2px solid red;
    }
</style>