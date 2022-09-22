<script>
	import Header from '$lib/ui/Header.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import '../global.css';
</script>

<Header />
<div id='contentBody'>
	<slot />
</div>
<Footer />

<style>
    #contentBody {
        padding-top: 20px;
    }
</style>