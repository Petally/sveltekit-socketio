<script lang="ts">
    let { onUsernameSelected } = $props();
    let username = $state('');

    const onsubmit = (e: SubmitEvent) => {
        e.preventDefault();
        onUsernameSelected(username);
    };
</script>

<form {onsubmit} class="m-2 *:border *:border-gray-400 *:p-1 *:m-1">
    <label for="username">
        Enter your username.
    </label>
    <br>
    <input 
    type="text" 
    name="username"
    placeholder="Enter username..." 
    bind:value={username} 
    />

    <button type="submit">Continue</button>
</form>