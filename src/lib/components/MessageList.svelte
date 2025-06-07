<script lang="ts">
    import type { Message } from '$lib/client/types/Message.js';
    import { tick } from 'svelte';
    
    // Autoscroll to new message if already at the bottom
    let { messages } : { messages: Message[] } = $props();
    let viewport = $state() as HTMLDivElement;
    $effect.pre(() => {
        messages;
        const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

        if (autoscroll) {
            tick().then(() => {
                viewport.scrollTo(0, viewport.scrollHeight);
            });
        }
    });
</script>

<div class="flex-1 overflow-y-scroll px-1" bind:this={viewport}>
    {#each messages as message, i (i)}
        <p class="break-all whitespace-pre-line">
            {#if message.isServer}
                <span class="text-gray-500">{message.username}</span>
            {:else}
                <span class="text-orange-500">{message.username}</span>
            {/if}
            {message.data}
        </p>
    {/each}
</div>