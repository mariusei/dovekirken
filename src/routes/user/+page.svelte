<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { readable } from 'svelte/store';
	import { enhance } from '$app/forms';
    import { user } from '../../store';

    export let data: PageData;
    export let form: ActionData;

    console.log(data);
    console.log(form)

    //$: res = readable(data.res);
    //$: err = readable(data.err)

</script>

{#if data.user}
    <h1>Hei {data.user.name}!</h1>
    <p>E-post: {data.user.email}</p>
    <form action="?/logout" use:enhance>
        <button type="submit">Logg ut</button>
    </form>
{/if}
{#if data.err}
    <p>Error: {data.err}</p>
{/if}

{#if !data.user}
    <form method="POST" action="?/check" use:enhance>
        <label>
            E-mail
            <input type="email" name="email" />
        </label>
        {#each data.emojis as emoji }
            <label>
                <input type="radio" name="emoji" value="{emoji}">
                {emoji}
            </label>
        {/each}
        <button 
        >Send inn</button>
    </form>
{/if}

{#if form?.status}
    <p>Status: {form?.status}</p>
{/if}
{#if form?.err}
    <p style="color: red">Error: {form?.err}</p>
{/if}