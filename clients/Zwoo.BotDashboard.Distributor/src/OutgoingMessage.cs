namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// An outgoing message.
/// It encapsulates the message that is sent to the proxy with its header.
/// </summary>
public struct OutgoingMessage
{
    /// <summary>
    /// The ID used internally to represent the server. This is not a valid zwoo game engine lobby id.
    /// </summary>
    public static long ServerID = -1;

    /// <summary>
    /// The ID of the game.
    /// </summary>    
    public long GameId { get; set; }

    /// <summary>
    /// The ID of the sender.
    /// </summary>
    public long Sender { get; set; }

    /// <summary>
    /// The ID of the receiver.
    /// </summary>
    public long Receiver { get; set; }

    /// <summary>
    /// The zrp message.
    /// </summary>
    public string Message { get; set; }

    public OutgoingMessage(long gameId, long sender, long receiver, string message)
    {
        GameId = gameId;
        Sender = sender;
        Receiver = receiver;
        Message = message;
    }
}

/// <summary>
/// A factory for creating outgoing messages.
/// </summary>
public class OutgoingMessageFactory
{
    /// <summary>
    /// Creates a new outgoing message factory for the given game.
    /// </summary>
    public static OutgoingMessageFactory ForGame(long gameId)
    {
        return new OutgoingMessageFactory(gameId);
    }

    /// <summary>
    /// The ID of the game.
    /// </summary>
    private long _gameId;

    /// <summary>
    /// Creates a new outgoing message factory.
    /// </summary>
    private OutgoingMessageFactory(long gameId)
    {
        _gameId = gameId;
    }

    /// <summary>
    /// Creates a new outgoing message.
    /// </summary>
    public OutgoingMessage Create(long sender, long receiver, string message)
    {
        return new OutgoingMessage(_gameId, sender, receiver, message);
    }
}