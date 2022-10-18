<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { readable } from 'svelte/store';
	import { enhance } from '$app/forms';

    export let data: PageData;
    export let form: ActionData;

    //console.log(data);

    //$: res = readable(data.res);
    //$: err = readable(data.err)

</script>
{#if data.res}
    <h1>Hei {data.res.name}!</h1>
    <p>E-post: {data.res.email}</p>
{/if}
{#if data.err}
    <p>Error: {data.err}</p>
{/if}

<form method="POST" action="?/check" use:enhance>
    <label>
        E-mail
        <input type="email" name="email" />
    </label>
    <button 
        data-key="enter"
        formaction="?/check"
        name="send"
    >Send inn</button>


</form>

<form method="POST" action="?/followLink" use:enhance>
    <label>
        Token from e-mail:
        <input type="text" name="emailToken" />
    </label>
    <button 
        data-key="enter"
        formaction="?/followLink"
        name="send"
    >Send inn</button>

</form>

{#if form?.status}
    <p>Status: {form?.status}</p>
{/if}
{#if form?.err}
    <p style="color: red">Error: {form?.err}</p>
{/if}