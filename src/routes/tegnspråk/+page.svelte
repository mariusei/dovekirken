<script lang="ts">

    import Article from '$lib/Article.svelte'

	import HeroImage from '$lib/HeroImage.svelte';
	import herobg from '$lib/images/ja.jpg?w=300;600;1200;2400&format=webp&srcset'

    import bonneVideo from '$lib/videos/sondagspoesi.mp4'

    const buttons= [
        {label: "Dikt og poesi"},
        {label: "Soul Children Sign", link:"#"},
        {label: "Liturgi", link:"#"},
        {label: "Språkutvikling", link:"#"}
    ]


</script>

<Article heading="Tegnspråk">
    <div slot="hero">
        <HeroImage 
            image={herobg}
            buttons={buttons}
        />
    </div>
    <div slot="content" class="flex flex-wrap gap-4">
        <div>Døvekirken utvikler og oversetter materiell på tegnspråk som kan brukes i gudstjenestene. I tillegg driver vi også med annet tegnspråklig utviklingsarbeid. Døvekirken er en viktig tegnspråklig aktør.</div>
        <div>På disse sidene kan du finne videoer med opptak av poesi, sanger og liturgiene våre.</div>
    </div>
</Article>

<Article heading="Dikt og poesi">
    <div slot="hero">
        <HeroImage 
            video={bonneVideo}
        />
    </div>
    <div slot="content" class="flex flex-col gap-y-4">
        <div>Dag og natt. Slit og strev. Dag og natt. Slit og strev. Dag og natt. Slit og strev. </div>
        <div>Vi legger det til side. </div>
        <div>Kommer til korsets hus. </div>
        <div>Fylles med lys - </div>
        <div>Gud er her til stede. </div>
    </div>
</Article>