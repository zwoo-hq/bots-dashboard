# Zwoo.BotDashboard.Distributor

A C# ZRPe distribution client.

![Zwoo.BotDashboard.Distributor](https://img.shields.io/nuget/v/Zwoo.BotDashboard.Distributor?style=for-the-badge&label=Zwoo.BotDashboard.Distributor)
![license](https://img.shields.io/github/license/bots-dashboard/theme-docs?style=for-the-badge)
![issues](https://img.shields.io/github/issues/bots-dashboard/theme-docs?style=for-the-badge)

## Quickstart

Install the package via dotnet CLI:

`dotnet add package Zwoo.BotDashboard.Distributor`

## Usage

```cs
using Zwoo.BotDashboard.Distributor;

// Create a new instance
var isEnabled = true;
var config = Configuration.FromEnv();
var distributor = DistributorFactory.CreateDistributorAsync(config, isEnabled);

// use it with a factory
var messageFactory = OutgoingMessageFactory.ForGame(1);
await distributor.SendAsync(messageFactory.Create(2, OutgoingMessage.ServerID, "xxx,{...}"))

// or without
await distributor.SendAsync(new OutgoingMessage 
{
    GameId = 1,
    Message = "xxx,{...}",
    Receiver = OutgoingMessage.ServerID,
    Sender = 2
})
```

Make sure, you provide

- `ZRP_DEBUG_ID` (ID of the distributor)
- `ZRP_DEBUG_INSTANCE` (the url of the game server)
- `ZRP_DEBUG_PROXY_URL` (the url to the zrp proxy)

as environment variables.