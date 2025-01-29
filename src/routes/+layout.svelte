<script lang="ts">
  import Header from '$lib/ui/Header.svelte';
  import Footer from '$lib/ui/Footer.svelte';
  import '../global.css';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Header />
<div id="contentBody">
  {@render children?.()}
</div>
<Footer />

<style>
  #contentBody {
    padding-top: 20px;
  }
</style>
