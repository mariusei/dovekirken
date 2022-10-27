<script>
	//import Counter from './Counter.svelte';
	//import welcome from '$lib/images/svelte-welcome.webp';
	//import welcome_fallback from '$lib/images/svelte-welcome.png';

    import Article from '$lib/Article.svelte'
	import Banner from '$lib/Banner.svelte';
    import HeroImage from '$lib/HeroImage.svelte';
	import herobg from '$lib/images/smil.jpg?w=300;600;1200;2400&format=webp&srcset'

	const heroButtons = [
		{label: "Tegnspråk", link: "/tegnspråk"}
	]
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Article heading="Den norske kirke på tegnspråk">
	<div slot="hero">
        <HeroImage 
            image={herobg}
            buttons={heroButtons}
        />
	</div>

	<Banner></Banner>

</Article>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
