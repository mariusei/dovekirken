<script>
	import { page } from '$app/stores';
	//import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import logo from '$lib/images/logo-hvit.png'

	import herobg from '$lib/images/smil.jpg'

	import HeroImage from '$lib/HeroImage.svelte';

	import { titleMaster, titlePage, titleSub, pictureMaster } from '../store'
	import { locations } from '../store'

	import { slide } from 'svelte/transition';

	let visible=true

</script>

<header class="flex flex-wrap w-full justify-center">
	<div class="flex flex-wrap flex-col justify-between w-full lg:w-4/5 lg:flex-row" >
		<div class="flex justify-center
			p-6 mx-2 mt-2 lg:my-2 
			invert
		">
			<img class="h-24" src={logo} alt="Dovekirkens logo" />
		</div>
		<input class="peer md:hidden" type="checkbox">
		<ul class="hidden peer-checked:flex md:flex flex-col md:flex-row 
			lg:w-4/6 md:items-end
			gap-2 p-2
			mb-4
			font-bold
			"
		>
			{#each $locations as {name, color}}
				<li class="flex flex-auto
					h-12 p-2 
					justify-center items-center 
					rounded-lg
					{color} border-b-4 border-r-4 active:border-0  border-current
					">
					{name}</li>
			{/each}
		</ul>
	</div>
	<HeroImage 
		image={herobg}
		buttons={["test", "Igjen"] }
	/>
	<!--
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a href="/">Home</a>
			</li>
			<li class:active={$page.url.pathname === '/about'}>
				<a href="/about">About</a>
			</li>
			<li class:active={$page.url.pathname.startsWith('/sverdle')}>
				<a href="/sverdle">Sverdle</a>
			</li>
			<li class:active={$page.url.pathname.startsWith('/user')}>
				<a href="/user">Bruker</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a>
	</div>
	-->
</header>

<!--
<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
-->