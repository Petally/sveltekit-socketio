<script lang="ts">
    let messageInput = $state('');
    let { disabled, onSubmit } = $props();

    function onkeypress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            // Prevent default to prevent newline from appearing after message is sent
            event.preventDefault();
            onSubmit(messageInput);
            messageInput = '';
        }
    }
</script>

<div class="flex mb-2 mx-2">
    <textarea 
        class="flex-1 border border-gray-400 px-2 resize-none focus:outline-none"
        bind:value={messageInput} 
        placeholder="Type a message..." 
        {onkeypress}
    ></textarea>
    <button 
        class="px-4 py-2 bg-blue-500 text-white cursor-pointer 
        disabled:bg-gray-300 disabled:cursor-not-allowed
        hover:not-disabled:bg-blue-700"
        onclick={onSubmit} 
        disabled={disabled}
    >
        Send
    </button>
</div>