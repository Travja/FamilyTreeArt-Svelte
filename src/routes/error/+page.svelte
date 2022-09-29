<script lang="ts">

  export let data;

</script>

<div id="error">
  <p>Something went wrong. If you hit the "Pay" button, we most likely received your payment. Please email us for further instruction.</p>
  <p><a href="mailto:order@customfamilytreeart.com">Order@CustomFamilyTreeArt.com</a></p>
</div>

<style>
  #error {
    position: relative;
    align-items: flex-start;
    padding: 20px;
    min-width: 743px;
    margin: 0 auto 10px;
    background-color: rgba(100, 100, 100, 0.1);
  }

  @media screen and (max-width: 900px) {
    #error {
      max-width: 100%;
      min-width: 200px;
    }
  }
</style>