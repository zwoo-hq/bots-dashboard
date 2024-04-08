import { ProxyClient, Configuration } from "@zwoo/dashboard-client";

const connectBtn = document.getElementById("connect");
const listenBtn = document.getElementById("listen");
const unlistenBtn = document.getElementById("unlisten");
const input = document.getElementById("id") as HTMLInputElement;

const targetOut = document.querySelector(".targets");
const messagesOut = document.querySelector(".messages");

const socket = new ProxyClient(Configuration.withUrl("ws://localhost:9072"));

socket.on("open", () => {
  const p = document.createElement("p");
  p.innerText = "Connected!";
  messagesOut?.appendChild(p);
});

socket.on("close", () => {
  const p = document.createElement("p");
  p.innerText = "Closed!";
  messagesOut?.appendChild(p);
});

socket.on("error", (e) => {
  const p = document.createElement("p");
  p.innerText = "Error!";
  console.error(e);
  messagesOut?.appendChild(p);
});

socket.on("message", (msg) => {
  const p = document.createElement("p");
  p.innerText = "Message: " + JSON.stringify(msg);
  messagesOut?.appendChild(p);
});

socket.on("targetsUpdated", (targets) => {
  targetOut!.innerHTML = "";
  targets.forEach((t) => {
    const p = document.createElement("p");
    p.innerText = JSON.stringify(t);
    targetOut?.appendChild(p);
  });
});

connectBtn?.addEventListener("click", async () => {
  console.log("Connecting...");
  await socket.connect();
});

listenBtn?.addEventListener("click", async () => {
  await socket.listen(input.value);
});

unlistenBtn?.addEventListener("click", async () => {
  await socket.unlisten(input.value);
});
