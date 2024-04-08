# @zwoo/dashboard-client

A Javascript/Typescript ZRPe dashboard client.

![@zwoo/dashboard-client](https://img.shields.io/npm/v/@zwoo/dashboard-client?style=for-the-badge&label=@zwoo/dashboard-client)
![license](https://img.shields.io/github/license/zwoo-hq/bots-dashboard?style=for-the-badge)
![issues](https://img.shields.io/github/issues/zwoo-hq/bots-dashboard?style=for-the-badge)

## Quickstart

Install the package via npm/yarn/pnpm

`npm i @zwoo/dashboard-client`

## Usage

```cs
import { ProxyClient, Configuration, forGame } from "@zwoo/dashboard-client";

const config = Configuration.withUrl("ws://localhost:9072"); // .fromImportMeta() // .fromEnv()
const socket = new ProxyClient(config);

await socket.connect();

socket.on("open", () => { /* connection opened */});
socket.on("close", () => { /* connection closed */ });
socket.on("error", (e) => { /* a websocket error occurred */ });
socket.on("message", (msg) => { /* received a ZRPe message */ });
socket.on("targetsUpdated", (targets) => {/* the list of listening targets updated */ });

const target = "foo";
await socket.listen(target); // listen to a distributor
await socket.unlisten(target); // stop listening to a distributor

// filtered message handler
socket.on("message", forGame(1, (msg) => { /* received a ZRPe message for game 1 */ }));

```

If `Configuration.fromImportMeta()` / `Configuration.fromEnv()` is used, you must provide:

- `ZRP_DEBUG_PROXY_URL` (the url to the zrp proxy)

as environment variables.