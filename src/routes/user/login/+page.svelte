<script lang="ts">
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

</script>

{#if data.err}
<p>Error - {data.err}</p>
{/if}

{#if data.res.login}
<form method="POST">
    <input type="hidden" id="token" name="token" value="{data.res.login.token}" />
    {#each data.res.login.emojis as emoji}
    <label>
        <input type="radio" name="emoji" id="{emoji}" value="{emoji}">
        {emoji}
    </label>
    {/each}
    <button data-key="enter" formaction="?/check">Sjekk</button>
</form>
{/if}

{#if data.res.loggedIn}
<h1>Du er logget inn</h1>
{/if}

{#if form}
{#if form.err}
<p>{form.err}</p>
{/if}
{#if form.status}
<p>{form.status}</p>
{/if}
{/if}