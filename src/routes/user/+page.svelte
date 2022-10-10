<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { readable } from 'svelte/store';

    export let data: PageData;
    //export let form: ActionData;

    console.log(data);

    $: res = readable(data.res);
    $: err = readable(data.err)

</script>
{#if data.res}
    <h1>Hei {$res.name}!</h1>
    <p>E-post: {$res.email}</p>
{/if}
{#if data.err}
    <p>Error: {$err}</p>
{/if}