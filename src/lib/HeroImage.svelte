<script lang="ts">
	export let buttons = ['Kalender', 'Kontakt oss']
	export let image = ""
</script>

<div class="flex flex-col
		items-center
		justify-end
		text-dkint-1
		rounded-lg
 		py-9 w-full
		mx-2
		h-96
		"
	  style="background-image: url({image});
		background-size:cover;  
		background-position: center;
	  "
	>
	<div class="w-2/3" >
		<ul class="flex justify-center gap-4 text-center text-lg font-semibold">
			{#each buttons as label}
				<li class="shadow-md rounded-lg 
					px-2 py-4 
					border-b-4 border-r-4 border-t border-l 
					active:border border-currentcolor
					text-black bg-white">{label}</li>
			{/each}
		</ul>
	</div>
</div>