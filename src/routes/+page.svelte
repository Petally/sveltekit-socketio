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

<div class="container">
    <h1>Socket.IO + Sveltekit Test</h1>

    <div class="messages" bind:this={viewport}>
        <div class="message-list">
            {#each messages as message, i (i)}
                <p class="message">
                    {#if message.isServer}
                        <span class="gray-text">{message.username}</span>
                    {:else}
                        <span class="username">{message.username}</span>
                    {/if}
                    {message.data}
                </p>
            {/each}
        </div>
    </div>

    <div class="status">
        Status: <span class:connected={isConnected} class:disconnected={!isConnected}>
            {isConnected ? 'Connected' : 'Disconnected'}
        </span>
    </div>

    <div class="message-controls">
        <input 
            bind:value={messageInput} 
            placeholder="Type a message..." 
            {onkeypress}
        />
        <button onclick={sendMessage} disabled={!isConnected}>Send</button>
    </div>
</div>

<style>
    :global(body) {
        margin: 0 1rem 0 1rem;
    }

    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .connected {
        color: green;
        font-weight: bold;
    }
    
    .disconnected {
        color: red;
        font-weight: bold;
    }
    
    .message-controls {
        margin-bottom: 1rem;
        display: flex;
        gap: 0.5rem;
    }
    
    .messages {
        flex: 1;
        overflow-y: scroll;
        border: 1px solid #ccc;
        padding: 1rem;
        background-color: #f9f9f9;
    }
    
    .message {
        margin: 0.25rem 0;
        padding: 0.25rem;
        background-color: white;
        border-radius: 4px;
        word-break: break-all;
    }

    .gray-text {
        color: grey;
    }
    
    .username {
        color: #FF8600;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        flex: 1;
    }
    
    button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }
    
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
        background-color: #0056b3;
    }
</style>