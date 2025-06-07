<script lang="ts">
    let { isConnected } : { isConnected: Boolean } = $props();
</script>

<div class="px-2 border-t-1 border-gray-400">
    Status: <span class={[isConnected && 'text-green-500', !isConnected && 'text-red-500']}>
        {isConnected ? 'Connected' : 'Disconnected'}
    </span>
</div>