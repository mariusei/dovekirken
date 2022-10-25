<script lang="ts">
	interface ButtonType {
		label: string
		link?: string
	}
	export let buttons: ButtonType[]
	export 	let image = ""
</script>

<div class="flex flex-col
		items-center
		justify-end
		text-dkint-1
		rounded-lg
 		w-full
		h-96
		"
	  style="background-image: url({image});
		background-size:cover;  
		background-position: center;
	  "
	>
	<div class="flex flex-col items-center w-full py-8" >
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