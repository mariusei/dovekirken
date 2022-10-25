<script lang="ts">

    import Article from '$lib/Article.svelte'

	import HeroImage from '$lib/HeroImage.svelte';
	import herobg from '$lib/images/ja.jpg'

    const buttons= [
        {label: "Dikt og poesi"},
        {label: "Soul Children Sign", link:"#"},
        {label: "Liturgi", link:"#"},
        {label: "Språkutvikling", link:"#"}
    ]


</script>

<Article>
    <div slot="hero">
        <HeroImage 
            image={herobg}
            buttons={buttons}
        />
    </div>
    <span slot="heading">Tegnspråk</span>
    <div slot="content">
        <div>Døvekirken utvikler og oversetter materiell på tegnspråk som kan brukes i gudstjenestene. I tillegg driver vi også med annet tegnspråklig utviklingsarbeid. Døvekirken er en viktig tegnspråklig aktør.</div>
        <div>På disse sidene kan du finne videoer med opptak av poesi, sanger og liturgiene våre.</div>
    </div>
</Article>