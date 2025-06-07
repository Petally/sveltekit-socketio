<script lang="ts">
    import { type Socket } from 'socket.io-client';
    import io from '$lib/client/socket';
    import type { ServerToClientEvents, ClientToServerEvents } from '../../app.d.ts';
    import type { Message } from '$lib/client/types/Message.js';
    import { browser } from '$app/environment';
    import MessageList from './MessageList.svelte';
    import ConnectedStatus from './ConnectedStatus.svelte';
    import MessageInput from './MessageInput.svelte';

    type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

    let socket: ClientSocket;

    let messages: Message[] = $state([]);
    let messageInput: string = $state('');
    let isConnected: boolean = $state(false);

    if (browser) {
        socket = io;

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
    }

    const sendMessage = (message: string): void => {
        if (message.trim() && socket) {
            socket.emit('message', message);
        }
    }
</script>

<!-- Message list -->
<MessageList {messages} />

<!-- Connected status -->
<ConnectedStatus {isConnected} />

<!-- Input -->
<MessageInput disabled={!isConnected} onSubmit={sendMessage}/>