<script lang="ts">
	interface ButtonType {
		label: string
		link?: string
	}
	export let buttons: ButtonType[] | undefined
	export 	let image: string | undefined
	export let video: string | undefined
	//  style="background-image: url(image-set({image}) 3x);
	//	background-size:cover;  
	//	background-position: center;
	//  "
</script>

<div class="
		inline-block relative
		text-dkint-1
		rounded-lg
 		w-full
		lg:h-96 hover:h-full
		overflow-hidden
		"
		style="transition: height 1s linear;"
	>
	{#if image}
		<img srcset={image} class="object-cover z-0" />
	{/if}
	{#if video}
		<video src={video} class="object-cover w-full z-0" controls></video>
	{/if}
	<div class="absolute bottom-0 flex flex-col items-center w-full py-8" >
		<ul class="flex flex-wrap justify-center gap-4 text-center text-lg font-semibold">
			{#if buttons}
			{#each buttons as {label, link}}
				<li class="shadow-md rounded-lg 
					border-b-4 border-r-4 border-t border-l 
					active:border border-currentcolor
					active:mt-1 active:ml-1
					text-black bg-white"
				>
				{#if link}
					<a href={link} class="px-2 py-4 flex flex-col justify-center w-full h-full">
						{label}
					</a>
				{/if}
				{#if !link}
					<p class="px-2 py-4">
						{label}
					</p>
				{/if}
				</li>
			{/each}
			{/if}
		</ul>
	</div>
</div>