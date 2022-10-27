<script lang="ts">
    import Banner from "$lib/Banner.svelte";
    export let heading=""
</script>

<article class="flex flex-wrap justify-center shrink-0 w-full">
    <div class="w-full">
		<div class="mx-2">
            <picture>
                <slot name="hero">
                    <p>No image</p>
                </slot>
            </picture>
        </div>
    </div>
    <div class="w-full lg:w-4/5 lg:my-2 z-0">
        <div class="mx-2 px-2">
            <Banner
                heading={heading}
            />
            <div class="flex flex-col text-xl text-black 
                mx-4 lg:mx-0 
            "
            >
                <slot name="content">
                </slot>
            </div>
        </div>
    </div>
</article>