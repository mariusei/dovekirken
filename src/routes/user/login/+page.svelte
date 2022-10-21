<script lang="ts">
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

</script>

{#if data.err}
<p>Error - {data.err}</p>
{/if}

{#if data.res}
<p>Choose emoji - {data.res.emojis}</p>
{/if}

{#if data.res}
<form method="POST">
    <input type="hidden" id="token" name="token" value="{data.res.token}" />
    {#each data.res.emojis as emoji}
    <label>
        <input type="radio" name="emoji" id="{emoji}" value="{emoji}">
        {emoji}
    </label>
    {/each}
    <button data-key="enter" formaction="?/check">Sjekk</button>

</form>
{/if}

{#if form}
<p>form data</p>
<p>{form.err}</p>
{/if}