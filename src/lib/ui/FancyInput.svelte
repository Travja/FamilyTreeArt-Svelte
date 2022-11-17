<!--suppress XmlInvalidId -->
<script lang='ts'>
  export let id: string;
  export let value: string;
  let focused = false;
</script>

<div class='input-wrapper' class:focused={focused} class:filled={value}>
  <div class='input'>
    <input {id} on:focus={() => focused = true}
           on:blur={() => focused = false}
    bind:value={value}/>
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

  .input-wrapper.focused {
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
</style>
