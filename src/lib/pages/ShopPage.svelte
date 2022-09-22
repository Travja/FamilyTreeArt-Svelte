<!--suppress XmlDuplicatedId -->
<script lang="ts">
  import type {
    BaseData,
    ButtonData,
    ButtonOption,
    GroupData,
    ImageOption,
    MultiSelectData,
    OptionImageData,
    TreeArtPage
  } from '$lib/conf/TreeArtConfig';
  import {
    calculateTotal,
    deleteMulti,
    getImage,
    getMultiSelect,
    getQualifiedCost,
    getValue,
    meetsPrereqs,
    multiSelectEntries,
    requirementsNotMet,
    selections,
    selectItem,
    selectMultiSelect,
    unset
  } from '$lib/interpreter';
  import { onMount } from 'svelte';
  import { config } from '$lib/conf/config';

  export let data: TreeArtPage = undefined;

  let loading = true;
  let options: (ImageOption | ButtonOption)[];
  let numOptions: any = {};
  let formattedEntries = {};

  let localOpt: any;
  let currentData: MultiSelectData;

  onMount(() => (loading = false));

  export const destroyMulti = () => {
    formattedEntries = {};
    if (!data.multiselect || !data.multiselect.keys) return;
    for (let key of data.multiselect.keys) {
      unset(key);
    }
  };

  const select = (optId, value) => {
    selectItem(optId, value);
    options = [...options];
  };

  const addMultiSelect = (multi: MultiSelectData) => {
    let data = { id: {} };
    for (let key of multi.keys) {
      data[key] = getValue(key);
      unset(key);
    }
    selectMultiSelect(multi.id, data);
    console.log(data);
    updateMulti(multi);
    options = [...options];
  };

  const purgeMulti = (multiId: string, index: number) => {
    let datum: any = getMultiSelect(multiId)[index];
    deleteMulti(multiId, datum);
    updateMulti(data.multiselect);
  };

  const updateMulti = (multi: MultiSelectData) => {
    if (!multi) return;

    console.log('multi', multi);

    let multiData = $multiSelectEntries[multi.id];
    if (!multiData) return;

    let rawData = {};
    let format = multi.format;
    let matcherFormat = multi.format.replace(`%${multi.quantifier}%`, '');

    let purge = [];
    let entryData = { id: {}, data: [], costs: [] };
    for (let multiDatum of multiData) {
      let matcher = matcherFormat;
      let quantifier = 0;
      for (let key of multi.keys) {
        let dataValue = multiDatum[key];
        matcher = matcher.replace(
          `%${key}%`,
          dataValue.placeholder || dataValue.displayText || dataValue.key || dataValue
        );

        if (key == multi.quantifier) {
          quantifier = parseInt(dataValue);
          multiDatum[multi.quantifier] = quantifier;
        }
      }

      if (!rawData[matcher]) rawData[matcher] = multiDatum;
      else {
        purge.push(multiDatum);
        rawData[matcher][multi.quantifier] += quantifier;
      }
    }

    purge.forEach((dat) => deleteMulti(multi.id, dat));

    for (let multData of $multiSelectEntries[multi.id]) {
      let formatted = format;
      console.log(multData);
      let total = 0;
      for (let key of multi.keys) {
        let dataValue = multData[key];
        formatted = formatted.replace(
          `%${key}%`,
          dataValue.placeholder || dataValue.displayText || dataValue.key || dataValue
        );
        let cost = dataValue.cost || getQualifiedCost(dataValue, multData);
        console.log(cost);
        if (cost != -1) total += cost;
      }

      total *= multData[multi.quantifier] || 1;
      entryData.costs.push(total);
      entryData.data.push(formatted);
    }

    formattedEntries[multi.id] = entryData;
    formattedEntries = { ...formattedEntries };
    console.log(formattedEntries);
  };

  $: if (data) {
    options = <(ImageOption | ButtonOption)[]>data.options;

    for (let opt: ImageOption | ButtonOption of options) {
      let selected: BaseData | string = getValue(opt.id);
      let selectedValid = true;
      if (typeof selected === 'string' || typeof selected === 'number') continue;
      if (!meetsPrereqs(selected?.prereq)) selectedValid = false;

      let key = 'images' in opt ? 'images' : 'buttons' in opt ? 'buttons' : 'items';
      if (key in opt) {
        numOptions[opt.id] = 0;
        for (let img: OptionImageData | ButtonData | GroupData of opt[key]) {
          if (!meetsPrereqs(img?.prereq)) continue;

          if (
            (!selected && 'default' in img && img.default) ||
            (!selectedValid && selected.key == img.key)
          ) {
            selectItem(opt.id, img);
            selected = img;
            selectedValid = true;
          }

          if ('group' in img) {
            for (let data: OptionImageData of img.group.images) {
              if (!meetsPrereqs(data?.prereq)) continue;
              numOptions[opt.id]++;
              if (
                (!selected && 'default' in data && data.default) ||
                (!selectedValid && selected.key == data.key)
              ) {
                selectItem(opt.id, data);
                selected = data;
                selectedValid = true;
              }
            }
          } else numOptions[opt.id]++;
        }
      } else if (opt.type === 'number' && !selected) selectItem(opt.id, 1);

      if (!selectedValid) {
        unset(opt.id);
      }
    }

    updateMulti(data.multiselect);
  }
</script>

<container>
  {#if loading || !data}
    <h2 id="optionTitle">Hold tight!</h2>
    <div class="instructions">
      The webpage is loading! If it doesn't load in a few seconds, please refresh the page. If it
      still doesn't load, email us and let us know!
    </div>
  {:else}
    <h2 class="optionTitle">{@html data.title}</h2>
    {#if data.intro && data.intro.length > 0}
      <div class="instructions">{@html data.intro}</div>
    {/if}
    <div id="options">
      {#each options as opt}
        {#if !opt.prereq || meetsPrereqs(opt.prereq)}
          <div class="option">
            <div class="optionLabel">{@html opt.name}</div>

            <!-- ImageOption -->
            {#if opt.images}
              <div id={opt.id} class="imgSelect" class:error={$requirementsNotMet.includes(opt.id)}>
                {#each opt.images as img}
                  {#if !img.prereq || meetsPrereqs(img.prereq)}
                    <!-- Groups! -->
                    {#if img.group}
                      <div id={img.group.id} class="grouping flex-2">
                        <div class="flex-1">{@html img.group.header}</div>
                        {#each img.group.images as gImg}
                          {#if !gImg.prereq || meetsPrereqs(gImg.prereq)}
                            <div
                              class="imgContainer flex-{Math.min(4, img.group.images.length)}"
                              on:click={select(opt.id, gImg)}
                              class:selected={getValue(opt.id) == gImg}
                            >
                              <div class="optText">
                                {#if gImg.placeholder}
                                  {#if getQualifiedCost(gImg) == -1}
                                    {@html gImg.placeholder}
                                  {:else}
                                    {@html gImg.displayText.replace(
                                      '%value%',
                                      '$' + getQualifiedCost(gImg).toFixed(2)
                                    )}
                                  {/if}
                                {:else}
                                  {@html gImg.displayText}
                                {/if}
                              </div>
                              <div class="imgBox">
                                <img
                                  class="imgOption"
                                  src={gImg.displayImage ? gImg.displayImage : getImage(gImg)}
                                  alt={gImg.key}
                                />
                              </div>
                            </div>
                          {/if}
                        {/each}
                      </div>
                    {:else}
                      <div
                        class="imgContainer flex-{Math.min(
                          opt.flexCount ? opt.flexCount : 4,
                          numOptions[opt.id]
                        )}"
                        on:click={select(opt.id, img)}
                        class:selected={getValue(opt.id) == img}
                      >
                        <div class="optText">
                          {#if img.placeholder}
                            {#if getQualifiedCost(img) == -1}
                              {@html img.placeholder}
                            {:else}
                              {@html img.displayText.replace(
                                '%value%',
                                '$' + getQualifiedCost(img).toFixed(2)
                              )}
                            {/if}
                          {:else}
                            {@html img.displayText.replace(
                              '%value%',
                              '$' + getQualifiedCost(img).toFixed(2)
                            )}
                          {/if}
                        </div>
                        <div class="imgBox">
                          <img
                            class="imgOption"
                            src={img.displayImage ? img.displayImage : getImage(img)}
                            style="background-image: {img.background}"
                            alt={img.key}
                          />
                        </div>
                      </div>
                    {/if}
                  {/if}
                {/each}
              </div>
              <!-- ButtonOption -->
            {:else if opt.buttons}
              <div id={opt.id} class="imgSelect" class:error={$requirementsNotMet.includes(opt.id)}>
                {#each opt.buttons as button}
                  {#if !button.prereq || meetsPrereqs(button.prereq)}
                    <div
                      class="imgContainer flex-{Math.min(
                        opt.flexCount ? opt.flexCount : 4,
                        numOptions[opt.id]
                      )} textButton"
                      on:click={select(opt.id, button)}
                      class:selected={getValue(opt.id) == button}
                    >
                      <div class="optText">
                        {#if button.placeholder}
                          {#if getQualifiedCost(button) == -1}
                            {@html button.placeholder}
                          {:else}
                            {@html button.displayText.replace(
                              '%value%',
                              '$' + getQualifiedCost(button).toFixed(2)
                            )}
                          {/if}
                        {:else}
                          {@html button.displayText.replace(
                            '%value%',
                            '$' + getQualifiedCost(button).toFixed(2)
                          )}
                        {/if}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
              <!-- ItemOption -->
            {:else if opt.items && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <select
                id={opt.id}
                on:change={(e) =>
                  select(
                    opt.id,
                    opt.items[
                      e.target.selectedIndex -
                        (opt.items.filter((itm) => itm.default).length == 0 ? 1 : 0)
                    ]
                  )}
                class:error={$requirementsNotMet.includes(opt.id)}
              >
                {#if opt.items.filter((itm) => itm.default).length == 0}
                  <option value="-1" />
                {/if}
                {#each opt.items as item, i}
                  <option value={i} selected={item.default || $selections[opt.id] == item}
                    >{item.displayText}</option
                  >
                {/each}
              </select>
              <!-- Text :D -->
            {:else if opt.type == 'text' && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type="text"
                id={opt.id}
                placeholder={opt.placeholder}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={(e) => select(opt.id, e.target.value)}
                on:keypress={(e) => select(opt.id, e.target.value)}
                on:paste={(e) => select(opt.id, e.target.value)}
                on:input={(e) => select(opt.id, e.target.value)}
                value={$selections[opt.id] || ``}
              />
            {:else if opt.type == 'number' && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type="number"
                min="1"
                id={opt.id}
                placeholder={opt.placeholder}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={(e) => select(opt.id, e.target.value)}
                on:keypress={(e) => select(opt.id, e.target.value)}
                on:paste={(e) => select(opt.id, e.target.value)}
                on:input={(e) => select(opt.id, e.target.value)}
                value={$selections[opt.id] || `1`}
              />
            {:else if opt.type == 'date' && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type="date"
                id={opt.id}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={(e) => select(opt.id, e.target.value)}
                value={$selections[opt.id] || ``}
              />
            {:else if opt.type == 'textLong' && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <textarea
                id={opt.id}
                placeholder={opt.placeholder}
                class={opt.id}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={(e) => select(opt.id, e.target.value)}
                on:keypress={(e) => select(opt.id, e.target.value)}
                on:paste={(e) => select(opt.id, e.target.value)}
                on:input={(e) => select(opt.id, e.target.value)}
                value={$selections[opt.id] || ``}
              />
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
  {#if data.multiselect}
    <button class="button add" on:click={addMultiSelect(data.multiselect)}><p>Add Item</p></button>
  {/if}
  {#each Object.keys(formattedEntries) as key (formattedEntries[key].id)}
    {#each formattedEntries[key].data as entry, i}
      <div class="multi">
        {entry}
        <div class="summaryPrice">${formattedEntries[key].costs[i]}</div>
        <div class="delete material-icons no-select" title="Delete" on:click={purgeMulti(key, i)}>
          delete
        </div>
      </div>
    {/each}
  {/each}

  {#if data.finalPage}
    <div id="summary">
      {#each Object.entries($selections) as [key, entry]}
        {#if entry && (entry.summaryText || (typeof entry == 'string' && (localOpt = config.getOption(key))?.display))}
          <div id="preview-{key}" class="summaryItem">
            {#if entry.summaryText}
              {entry.summaryText || entry.key || entry.displayText || JSON.stringify(entry)}
              <div class="summaryPrice" class:hidden={!entry.cost && !entry.values}>
                ${calculateTotal(entry)
                  .toFixed(2)
                  .replace(/[.,]00$/, '')}
              </div>
            {:else if typeof entry == 'string' && (localOpt = config.getOption(key))?.display}
              {localOpt.display || ''}{entry}
            {/if}
          </div>
        {/if}
      {/each}

      {#each Object.entries($multiSelectEntries) as [key, entry]}
        <span>
          {(currentData = config.getMultiSelectData(key)).display}
          {#each entry as multi}
            <div class="summaryItem">
              {currentData.parseText(multi)}
              <div class="summaryPrice" class:hidden={!currentData.total(multi)}>
                ${currentData
                  .total(multi)
                  ?.toFixed(2)
                  .replace(/[.,]00$/, '')}
              </div>
            </div>
          {/each}
        </span>
      {/each}
    </div>
  {/if}
</container>

<style>
  #options {
    user-select: none;
  }

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

  .add {
    float: right;
    margin-right: 20px;
  }

  .multi {
    display: inline-flex;
    background-color: #999;
    border-left: 4px solid #77a34f;
    margin: 3px;
    flex-direction: row;
    align-items: center;
    padding: 10px;
  }

  .multi:hover .delete {
    opacity: 1;
  }

  .delete {
    display: inline-block;
    opacity: 0;
    transition: 0.3s opacity;
  }

  .delete:hover {
    cursor: pointer;
  }

  .summaryItem {
    background-color: #bbb;
    border-left: 4px solid #77a34f;
    margin: 3px;
    padding: 10px;
  }

  span > .summaryItem {
    margin-left: 1.5em;
  }

  .summaryPrice {
    float: right;
    margin: 0 0.4em 0 1.25em;
    color: #555;
  }

  .no-select {
    user-select: none;
  }
</style>
