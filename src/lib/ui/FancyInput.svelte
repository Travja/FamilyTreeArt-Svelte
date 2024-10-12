<script lang='ts'>
  export let id: string;
  export let value: string;
  export let required = false;
  export let pattern: string | undefined = undefined;
  export let title: string | undefined = undefined;
  let focused = false;
  let regex: RegExp;

  $:
    if (pattern) {
      regex = new RegExp(pattern);
    }

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
           on:blur={() => focused = false}
           on:focus={() => focused = true}
           on:input={e => invalid(e)}
           on:invalid={e => invalid(e)}
           {pattern}
           placeholder=' '
           {required}
           {title} />
  </div>
  <label for={id}>
    <slot />
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

    .input-wrapper:has(input:invalid:not(:placeholder-shown)) {
        border: 2px solid red;
    }

    .input-wrapper:has(input:valid:not(:placeholder-shown)) {
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
