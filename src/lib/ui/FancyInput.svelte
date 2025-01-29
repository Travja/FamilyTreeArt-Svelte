<script lang='ts'>
  import { run } from 'svelte/legacy';

  interface Props {
    id: string;
    value: string;
    required?: boolean;
    pattern?: string | undefined;
    title?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    id,
    value = $bindable(),
    required = false,
    pattern = undefined,
    title = undefined,
    children
  }: Props = $props();
  let focused = $state(false);
  let regex: RegExp = $state();

  run(() => {
    if (pattern) {
        regex = new RegExp(pattern);
      }
  });

  /**
   * Shows a custom validity message
   * @param e - event
   */
  function invalid(e: Event & { currentTarget: (EventTarget & HTMLInputElement) }) {
    if (!regex) {
      e.currentTarget.setCustomValidity('');
      return;
    }

    if (!regex.test(e.currentTarget.value)) { // somehow validity.valid returns a wrong value
      e.currentTarget.setCustomValidity(title);
    } else {
      e.currentTarget.setCustomValidity('');
    }
  }
</script>

<div class='input-wrapper' class:filled={value} class:focused={focused}>
  <div class='input'>
    <input bind:value={value} {id}
           onblur={() => focused = false}
           onfocus={() => focused = true}
           oninput={e => invalid(e)}
           oninvalid={e => invalid(e)}
           {pattern}
           placeholder=' '
           {required}
           {title} />
  </div>
  <label for={id}>
    {@render children?.()}
  </label>
</div>

<style>
    .input-wrapper {
        border: 2px solid black;
        border-radius: 0.5rem;
        position: relative;
        width: 100%;
        margin: 0.5rem auto;
        transition: border 0.2s ease-in-out;
    }

    .input-wrapper:has(:global(input:invalid:not(:placeholder-shown))) {
        border: 2px solid red;
    }

    .input-wrapper:has(:global(input:valid:not(:placeholder-shown))) {
        border: 2px solid #77a34f;
    }

    .input {
        border-radius: 0.5rem;
        position: relative;
        width: 100%;
        /*background-color: white;*/
        overflow: hidden;
    }

    .input-wrapper label {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: calc(50% - 2px);
        padding: 0 0.5rem;
        height: 2px;
        background-color: #cccccc;
        font-size: 1rem;
        transition: top 0.3s ease, font-size 0.3s ease, margin-left 0.3s ease;
        color: #333;
    }

    .input-wrapper.focused label, .input-wrapper.filled label {
        top: -2px;
        font-size: 0.9rem;
        margin-left: 0.7rem;
    }

    .input input {
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 0.5rem;
        background: transparent;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
    }

    label:hover {
        cursor: text;
    }
</style>
