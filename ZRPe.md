# ZRPe - Zwoo Request Protocol extended

ZRPe introduces new configuration commands. One of which must be sent by a party after the connection has opened.

- `!distribution,<id>` Indicates that the connection was started by a zwoo game server instance. Once sent, the connection will be interpreted as a distributing party which feeds a dashboard with zrp messages.
- `!dashboard` Indicates that the connection was started by a bots dashboard instance. Once sent, the connection will be interpreted as a receiving party which consumes zrp messages send by other distributors.
- `!listen,<id>` Tells the system, that a bot dashboard wants to listen from messages of a specific distributor.
- `!unlisten,<id>` Tells the system, that a bot dashboard does not want to receive zrp message of a specific distributor anymore.
- `!targets,<target list>` Once a connection identified itself as dashboard or a new distributor joined, it will receive this message containing a list 

## Payloads

### distribution identification

Sent as stringified json separated by comma (`,`) from the `!distribution` command.

```json
{
    "id": "<unique identifier of the distributor: string>",
    "instance": "<URL under which the server is accessible: string>" 
}
```

### listen/unlisten target

Sent in form of a plain string separated by comma (`,`) from the `!listen`/`!unlisten` command.

```
<id: id of the distributor to listen to>
```

### target list

Sent as stringified json separated by comma (`,`) from the `!targets` command.

```json
[
    {
        "id": "<unique identifier of the distributor: string>",
        "instance": "<URL under which the server is accessible: string>" 
    }
]
```

## ZRP masking

Since zrp messages itself don't contain any information about the sender nor receiver ZRPe must add this information to all its messages.

ZRPe adds this information like a header in front of the message itself. This header contains information about:

- the id of the game the message was sent in
- the player (or server) who sent this message
- the player (or server) who receives this message

As IDs the already existing, game scoped, lobby ids will be used.

The header will be encoded like this:

```
[gameId;senderId;receiverId]
```

ZRPe includes 2 special IDs:

- `-1`: ServerID: the server sends or receives the message
- `-2`: BroadcastID: the server broadcasts a message to the game