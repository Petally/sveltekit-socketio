# Sveltekit & Socket.io integration
Here be dragons.

I'm new to webdev, so I wanted to use socket.io with sveltekit. This is probably a really ugly way to do it, but it has the best developer experience out of any other method I've seen.

This project is essentially (this implementation)[https://github.com/suhaildawood/SvelteKit-integrated-WebSocket] reworked to use the socket.io library instead of raw websockets.

If you see any bugs or glaring issues, please open a pull request. I'm a webdev noob right now.

## How it works
We create a file called `src/lib/server/webSocketUtils.ts` which contains our socket.io server logic. `src/app.d.ts` also contains typings for any events you may want to add.

For dev, we have a vite plugin that imports our server: `vite-plugin-websocket.ts` that gets pulled into the vite config - this acts as our socket.io server during development.

For production, we have `prodServer.ts` that imports our server, which you may either build or run directly with tsx.

In our `hooks.server.ts` we can access the socket.io server through the global state, and this allows us to use sveltekit routes in order to use socket.io events. (Pretty cool!)

NOTE: If you significantly change your socket.io server logic while using `npm run dev`, you may have to restart your vite server by re-running `npm run dev`.

## Other tidbits I've included
You will find that this is an example chat application. Of course, for this I have added a few things, such as:
- tailwindcss
- extra fonts in `static/fonts/`

The main logic is entirely contained within the index route.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.