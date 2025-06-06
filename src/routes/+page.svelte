<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { io, type Socket } from 'socket.io-client';
    import type { ServerToClientEvents, ClientToServerEvents } from '../app.d.ts';
    
    type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
    
    let socket: ClientSocket;
    
    type Message = {
        isServer: boolean,
        username: string,
        data: string
    };
    
    let messages: Message[] = $state([]);
    let messageInput: string = $state('');
    let isConnected: boolean = $state(false);
    
    onMount(() => {
        socket = io();
        
        socket.on('connect', () => {
            isConnected = true;
            console.log('Connected to server');
        });
        
        socket.on('disconnect', () => {
            isConnected = false;
            console.log('Disconnected from server');
        });
        
        socket.on('message', (data: string, username: string) => {
            messages = [...messages, {isServer: false, username, data}];
        });

        socket.on('userJoined', (username: string) => {
            messages = [...messages, {
                isServer: true, 
                username: '[SERVER]', 
                data: `${username} has joined the chat`
            }];
        });

        socket.on('userLeft', (username: string) => {
            messages = [...messages, {
                isServer: true, 
                username: '[SERVER]', 
                data: `${username} has left the chat`
            }];
        });

        socket.on('updateUsername', (previousUsername: string, username: string) => {
            messages = [...messages, {
                isServer: true, 
                username: '[SERVER]', 
                data: `${previousUsername} has changed their name to ${username}`
            }];
        });
        
        return () => {
            socket.disconnect();
        };
    });

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
    
    function sendMessage(): void {
        if (messageInput.trim() && socket) {
            socket.emit('message', messageInput);
            messageInput = '';
        }
    }
    
    function onkeypress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }
</script>

<div class="flex flex-col h-screen">
    <h1>Socket.IO + Sveltekit Test</h1>

    <!-- Message list -->
    <div class="flex-1 overflow-y-scroll" bind:this={viewport}>
        {#each messages as message, i (i)}
            <p class="break-all">
                {#if message.isServer}
                    <span class="text-gray-500">{message.username}</span>
                {:else}
                    <span class="text-orange-500">{message.username}</span>
                {/if}
                {message.data}
            </p>
        {/each}
    </div>

    <!-- Connected status -->
    <div class="status">
        Status: <span class={[isConnected && 'text-green-500', !isConnected && 'text-red-500']}>
            {isConnected ? 'Connected' : 'Disconnected'}
        </span>
    </div>

    <!-- Input -->
    <div class="flex">
        <input 
            class="flex-1 border border-gray-400 px-2"
            bind:value={messageInput} 
            placeholder="Type a message..." 
            {onkeypress}
        />
        <button 
            class="px-4 py-2 bg-blue-500 text-white cursor-pointer 
            disabled:bg-gray-300 disabled:cursor-not-allowed
            hover:not-disabled:bg-blue-700"
            onclick={sendMessage} 
            disabled={!isConnected}
        >
            Send
        </button>
    </div>
</div>

<style>
    :global(body) {
        margin: 0 1rem 0 1rem;
    }
</style>