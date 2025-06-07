<script lang="ts">
    import socket from "$lib/client/socket";
    import Chat from "$lib/components/Chat.svelte";
    import SelectUsername from "$lib/components/SelectUsername.svelte";

    let usernameSelected = $state(false);
    function onUsernameSelected(username: String): void {
        usernameSelected = true;
        socket.auth = { username };
        socket.connect();
    };
</script>

{#if !usernameSelected}
    <SelectUsername {onUsernameSelected} />
{:else}
    <Chat />
{/if}