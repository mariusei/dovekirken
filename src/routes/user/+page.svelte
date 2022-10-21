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

    $: formRes = readable(form)

    if (formRes?.user) {
        console.log("Writing to store!", formRes.user)
        user.set(
            formRes.user
        )
    }

</script>

{#if data.user}
    <h1>Hei {data.user.name}!</h1>
    <p>E-post: {data.user.email}</p>
{/if}
{#if data.err}
    <p>Error: {data.err}</p>
{/if}

{#if data.token}
<p>Du er logget inn</p>
{/if}

<form method="POST" action="?/check" use:enhance>
    <label>
        E-mail
        <input type="email" name="email" />
    </label>
    <label>
        <input type="radio" name="emoji" id="1" value="😀">
        😀
    </label>
    <label>
        <input type="radio" name="emoji" id="2" value="😊">
        😊
    </label>
    <label>
        <input type="radio" name="emoji" id="3" value="🤠">
        🤠
    </label>
    <button 
        data-key="enter"
        formaction="?/check"
        name="send"
    >Send inn</button>


</form>

{#if form?.status}
    <p>Status: {form?.status}</p>
{/if}
{#if form?.err}
    <p style="color: red">Error: {form?.err}</p>
{/if}