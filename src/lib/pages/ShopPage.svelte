<!--suppress XmlDuplicatedId -->
<script lang='ts'>
  import type {
    TreeArtPage
  } from '$lib/conf/TreeArtConfig';
  import {
    calculateTotal,
    deleteMulti,
    getDataValue,
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
  import { onDestroy, onMount } from 'svelte';
  import { config } from '$lib/conf/config';
  import { currentPage, page } from '../pages';
  import type { Unsubscriber } from 'svelte/store';
  import { coupon, couponValue } from '$lib/coupon-manager';
  import {
    isBaseData,
    isButtonOption,
    isGroupData,
    isImageOption,
    isItemOption,
    isNumOption,
    isTextLongOption,
    isTextOption
  } from '$lib/conf/util';
  import type { ButtonOption, ImageOption, ItemOption, TextOption } from '../../types/options';
  import type { MultiSelectData } from '$lib/multi-select';
  import type { BaseData } from '../../types/data';

  let loading = true;
  let options: (ImageOption | ButtonOption | ItemOption | TextOption)[];
  let numOptions: any = {};
  let formattedEntries = {};
  let failsafe = 0;
  let previousPage = -1;
  let cPage = -1;
  let destroyed = false;
  let checked = false;

  let localOpt: any;
  let currentData: MultiSelectData;

  let unOne: Unsubscriber;
  let unTwo: Unsubscriber;

  onMount(() => {
    unOne = currentPage.subscribe(p => {
      failsafe = 0;
      previousPage = cPage;
      cPage = p;
      checked = false;
      destroyed = false;
      destroyMulti(config.pages[previousPage]);
      updateMulti(config.pages[p]?.multiselect);
    });
    unTwo = page.subscribe((pg) => {
      if (!pg) return;
      checkSelections(pg);
    });
    loading = false;
  });

  onDestroy(() => {
    if (unOne) unOne();
    if (unTwo) unTwo();
  });

  export const destroyMulti = (page: TreeArtPage) => {
    if (destroyed) return;
    destroyed = true;
    if (!page) return;
    formattedEntries = {};
    if (!page.multiselect || !page.multiselect.keys) return;
    for (let key of page.multiselect.keys) {
      unset(key);
    }
  };

  const select = (optId: string, value: string | BaseData) => {
    selectItem(optId, value);
    options = [...options];
  };

  const getOrSetValue = (optId: string, fallback: string | BaseData) => {
    let val = getValue(optId);
    if (!val) {
      selectItem(optId, fallback);
      val = fallback;
    }

    return val;
  };

  const addMultiSelect = (multi: MultiSelectData) => {
    let data = { id: {} };
    for (const key of multi.keys) {
      data[key] = getValue(key);
      unset(key);
    }
    selectMultiSelect(multi.id, data);
    updateMulti(multi);
    options = [...options];
  };

  const purgeMulti = (multiId: string, index: number) => {
    let datum: any = getMultiSelect(multiId)[index];
    deleteMulti(multiId, datum);
    updateMulti($page.multiselect);
  };

  const updateMulti = (multi: MultiSelectData) => {
    if (!multi) return;

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
        if (!dataValue) dataValue = '';

        matcher = matcher.replace(
          `%${key}%`,
          dataValue.placeholder ||
          dataValue.displayText ||
          dataValue.key ||
          dataValue
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

    purge.forEach(dat => deleteMulti(multi.id, dat));

    for (let multData of $multiSelectEntries[multi.id]) {
      let formatted = format;
      let total = 0;
      for (let key of multi.keys) {
        let dataValue = multData[key];
        if (!dataValue) dataValue = '';

        formatted = formatted.replace(
          `%${key}%`,
          dataValue.placeholder ||
          dataValue.displayText ||
          dataValue.key ||
          dataValue
        );
        const cost = dataValue.cost || getQualifiedCost(dataValue, multData);
        if (cost != -1) total += cost;
      }

      total *= multData[multi.quantifier] || 1;
      entryData.costs.push(total);
      entryData.data.push(formatted);
    }

    formattedEntries[multi.id] = entryData;
    formattedEntries = { ...formattedEntries };
  };

  const checkSelections = (page: TreeArtPage): void => {
    if (checked) return;
    checked = true;
    failsafe++;

    if (failsafe > 10) {
      failsafe = 0;
      return;
    }

    options = <(ImageOption | ButtonOption)[]>page.options;
    let toSelect: { [key: string]: any } = {};

    for (const opt of options) {
      let selected: any = getValue(opt.id);
      let selectedValid = true;
      if (typeof selected === 'string' || typeof selected === 'number')
        continue;
      if (!meetsPrereqs(selected?.prereq)) selectedValid = false;

      let key = 'images' in opt ? 'images'
        : 'buttons' in opt ? 'buttons' : 'items';
      if (key in opt) {
        numOptions[opt.id] = 0;
        for (const img of opt[key]) {
          if (!meetsPrereqs(img?.prereq)) continue;

          if ('group' in img) {
            for (const data of img.group.images) {
              if (!meetsPrereqs(data?.prereq)) continue;
              numOptions[opt.id]++;
              if (
                (!selected && 'default' in data && data.default) ||
                (selected?.key == data.key)
              ) {
                toSelect[opt.id] = data;
                selected = data;
                selectedValid = true;
              }
            }
            continue;
          }

          numOptions[opt.id]++;
          if (
            (!selected && 'default' in img && img.default) ||
            (selected?.key == img.key)
          ) {
            toSelect[opt.id] = img;
            selected = img;
            selectedValid = true;
          }

        }
      } else if (opt.type === 'number' && !selected) selectItem(opt.id, '1');

      if (!selectedValid) {
        unset(opt.id);
      }
    }

    Object.entries<any>(toSelect).forEach(([key, entry]) => {
      selectItem(key, entry);
    });
  };

  const format = (str: string): string => {
    if (str.match(/\d{4}-\d{2}-\d{2}/)) {
      return new Date(str).toLocaleDateString(undefined, { timeZone: 'UTC' });
    }

    return str;
  };
</script>

<section>
  {#if loading || !$page}
    <h2 id='optionTitle'>Hold tight!</h2>
    <div class='instructions'>
      The webpage is loading! If it doesn't load in a few seconds, please
      refresh the page. If it still doesn't load, email us and let us know!
    </div>
  {:else}
    <h2 class='optionTitle'>{@html $page.title}</h2>
    {#if $page.intro && $page.intro.length > 0}
      <div class='instructions'>{@html $page.intro}</div>
    {/if}
    <div id='options'>
      {#each options as opt}
        {#if !opt.prereq || meetsPrereqs(opt.prereq)}
          <div class='option'>
            <div class='optionLabel'>{@html opt.name}</div>

            <!-- ImageOption -->
            {#if isImageOption(opt)}
              <div
                id={opt.id}
                class='imgSelect'
                class:error={$requirementsNotMet.includes(opt.id)}
              >
                {#each opt.images as img}
                  {#if !img.prereq || meetsPrereqs(img.prereq)}
                    <!-- Groups! -->
                    {#if isGroupData(img)}
                      <div id={img.group.id} class='grouping flex-2'>
                        <div class='flex-1'>{@html img.group.header}</div>
                        {#each img.group.images as gImg}
                          {#if !gImg.prereq || meetsPrereqs(gImg.prereq)}
                            <div
                              class='imgContainer flex-{Math.min(
                                4,
                                img.group.images.length
                              )}'
                              role='button'
                              tabindex='0'
                              on:click={() => select(opt.id, gImg)}
                              on:keypress={(e) => e.key === 'Enter' && select(opt.id, gImg)}
                              class:selected={getDataValue(opt.id)?.key === gImg.key}
                            >
                              <div class='optText'>
                                {#if gImg.placeholder}
                                  {#if getQualifiedCost(gImg) === -1}
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
                              <div class='imgBox'>
                                <img
                                  class='imgOption'
                                  src={gImg.displayImage
                                    ? gImg.displayImage
                                    : getImage(gImg)}
                                  alt={gImg.key}
                                />
                              </div>
                              {#if gImg.footer}
                                <div class='optText footText'>
                                  {@html gImg.footer}
                                </div>
                              {/if}
                            </div>
                          {/if}
                        {/each}
                      </div>
                    {:else}
                      <div
                        class='imgContainer flex-{Math.min(
                          opt.flexCount ? opt.flexCount : 4,
                          numOptions[opt.id]
                        )}'
                        role='button'
                        tabindex='0'
                        on:click={() => select(opt.id, img)}
                        on:keypress={(e) => e.key === 'Enter' && select(opt.id, img)}
                        class:selected={getDataValue(opt.id)?.key === img.key}
                      >
                        <div class='optText'>
                          {#if img.placeholder}
                            {#if getQualifiedCost(img) === -1}
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
                        <div class='imgBox'>
                          <img
                            class='imgOption'
                            src={img.displayImage
                              ? img.displayImage
                              : getImage(img)}
                            style='background-image: {img.background}'
                            alt={img.key}
                          />
                        </div>
                        {#if img.footer}
                          <div class='optText footText'>
                            {@html img.footer}
                          </div>
                        {/if}
                      </div>
                    {/if}
                  {/if}
                {/each}
              </div>
              <!-- ButtonOption -->
            {:else if isButtonOption(opt)}
              <div
                id={opt.id}
                class='imgSelect'
                class:error={$requirementsNotMet.includes(opt.id)}
              >
                {#each opt.buttons as button}
                  {#if !button.prereq || meetsPrereqs(button.prereq)}
                    <div
                      class='imgContainer flex-{Math.min(
                        opt.flexCount ? opt.flexCount : 4,
                        numOptions[opt.id]
                      )} textButton'
                      role='button'
                      tabindex='0'
                      on:click={() => select(opt.id, button)}
                      on:keypress={(e) => e.key === 'Enter' && select(opt.id, button)}
                      class:selected={getDataValue(opt.id)?.key === button.key}
                    >
                      <div class='optText'>
                        {#if button.placeholder}
                          {#if getQualifiedCost(button) === -1}
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
            {:else if isItemOption(opt) && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <select
                id={opt.id}
                on:change={e =>
                  select(
                    opt.id,
                    opt.items[
                      e.currentTarget.selectedIndex -
                        (opt.items.filter(itm => itm.default).length === 0
                          ? 1
                          : 0)
                    ]
                  )}
                class:error={$requirementsNotMet.includes(opt.id)}
              >
                {#if opt.items.filter(itm => itm.default).length === 0}
                  <option value='-1' />
                {/if}
                {#each opt.items as item, i}
                  <option
                    value={i}
                    selected={item.default || $selections[opt.id] === item}
                  >{item.displayText}</option
                  >
                {/each}
              </select>
              <!-- Text :D -->
            {:else if isTextOption(opt) && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type='text'
                id={opt.id}
                placeholder={opt.placeholder}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={e => select(opt.id, e.currentTarget.value)}
                on:keypress={e => select(opt.id, e.currentTarget.value)}
                on:paste={e => select(opt.id, e.currentTarget.value)}
                on:input={e => select(opt.id, e.currentTarget.value)}
                value={$selections[opt.id] || ``}
              />
            {:else if isNumOption(opt) && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type='number'
                min='1'
                id={opt.id}
                placeholder={opt.placeholder}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={e => select(opt.id, e.currentTarget.value)}
                on:keypress={e => select(opt.id, e.currentTarget.value)}
                on:paste={e => select(opt.id, e.currentTarget.value)}
                on:input={e => select(opt.id, e.currentTarget.value)}
                value={getOrSetValue(opt.id, '1')}
              />
            {:else if opt.type === 'date' && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <input
                type='date'
                id={opt.id}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={e => select(opt.id, e.currentTarget.value)}
                value={$selections[opt.id] || ``}
              />
            {:else if isTextLongOption(opt) && (!opt.prereq || meetsPrereqs(opt.prereq))}
              <textarea
                id={opt.id}
                placeholder={opt.placeholder}
                class={opt.id}
                class:error={$requirementsNotMet.includes(opt.id)}
                on:change={e => select(opt.id, e.currentTarget.value)}
                on:keypress={e => select(opt.id, e.currentTarget.value)}
                on:paste={e => select(opt.id, e.currentTarget.value)}
                on:input={e => select(opt.id, e.currentTarget.value)}
                value={String($selections[opt.id] || '')}
              />
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
  {#if $page?.multiselect}
    <button class='button add' on:click={() => addMultiSelect($page.multiselect)}
    >
      <span>Add Item</span>
    </button>
  {/if}
  {#each Object.keys(formattedEntries) as key (formattedEntries[key].id)}
    {#each formattedEntries[key].data as entry, i}
      <div class='multi'>
        {entry}
        <div class='summaryPrice'>${formattedEntries[key].costs[i]}</div>
        <div
          class='delete material-icons no-select'
          title='Delete'
          role='button'
          tabindex='0'
          on:click={() => purgeMulti(key, i)}
          on:keypress={(e) => e.key === 'Enter' && purgeMulti(key, i)}
        >
          delete
        </div>
      </div>
    {/each}
  {/each}

  {#if $page?.finalPage}
    <div id='summary'>
      {#each Object.entries($selections) as [key, entry]}
        {#if entry && (isBaseData(entry) || (typeof entry == 'string' && (localOpt = config.getOption(key))?.display))}
          <div id='preview-{key}' class='summaryItem'>
            {#if isBaseData(entry)}
              {entry.summaryText ||
              entry.key ||
              entry.displayText ||
              JSON.stringify(entry)}
              <div
                class='summaryPrice'
                class:hidden={!entry.cost && !entry.values}
              >
                ${calculateTotal(entry)
                .toFixed(2)
                .replace(/[.,]00$/, '')}
              </div>
            {:else if typeof entry == 'string' && (localOpt = config.getOption(key))?.display}
              {localOpt.display || ''}{format(entry)}
            {/if}
          </div>
        {/if}
      {/each}

      {#each Object.entries($multiSelectEntries) as [key, entry]}
        <span>
          {(currentData = config.getMultiSelectData(key)).display}
          {#each entry as multi}
            <div class='summaryItem'>
              {currentData.parseText(multi)}
              <div class='summaryPrice'
                   class:hidden={!currentData.total(multi)}>
                ${currentData.total(multi)?.toFixed(2).replace(/[.,]00$/, '')}
              </div>
            </div>
          {/each}
        </span>
      {/each}

      {#if $coupon}
        <div class='summaryItem bold'>
          Coupon: {$coupon.code}
          <div class='summaryPrice'>
            -${$couponValue?.toFixed(2).replace(/[.,]00$/, '')}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</section>

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
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
        transition: background-color 0.5s;
        border-radius: 8px;
        min-width: 95px;
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

    .footText {
        flex-grow: 0;
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
        box-sizing: border-box;
        margin: 5px;
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

    #summary {
        margin: 20px 20px 0;
    }
</style>
