<script lang="ts">
	interface ButtonType {
		label: string
		link?: string
	}
	export let buttons: ButtonType[]
	export 	let image = ""
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
		h-96
		overflow-hidden
		"
	>
	<img srcset={image} class="absolute object-cover min-h-full -z-10" />
	<div class="absolute bottom-0 flex flex-col items-center w-full py-8 z-10" >
		<ul class="flex flex-wrap justify-center gap-4 text-center text-lg font-semibold">
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
		</ul>
	</div>
</div>