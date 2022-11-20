<script lang='ts'>
  import { onMount } from 'svelte';

  export let data;

  onMount(() => {
    localStorage.removeItem('tree-selections');
    localStorage.removeItem('tree-multi');
    localStorage.removeItem('furthest-page');
    localStorage.removeItem('visited-last');
  });
</script>

<div id='success'>
  <p>Thank you {data.user}! Your order has been received.</p>
  <p>An email has been sent to {data.email} with the form(s) to submit your family names.</p>
  <p>If you don’t see an email within 30 minutes, check your Spam or Junk folders.</p>
  <p>If you don't receive an email, please reach out to us at <a href='mailto:order@customfamilytreeart.com'>Order@CustomFamilyTreeArt.com</a>
    and we’ll take care of you!</p>
</div>

<style>
  #success {
    position: relative;
    align-items: flex-start;
    padding: 20px;
    min-width: 743px;
    margin: 0 auto 10px;
    background-color: rgba(100, 100, 100, 0.1);
  }

  @media screen and (max-width: 900px) {
    #success {
      max-width: 100%;
      min-width: 200px;
    }
  }
</style>