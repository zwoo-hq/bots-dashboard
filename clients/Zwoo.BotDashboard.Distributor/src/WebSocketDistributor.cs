
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A distributor that sends messages to the proxy using a web socket.
/// </summary>
internal class WebSocketDistributor : IDistributor
{
    /// <summary>
    /// The web socket used to send messages.
    /// </summary>
    private ClientWebSocket _webSocket;

    /// <summary>
    /// The meta data of the distributor.
    /// </summary>
    private DistributorData _data;

    /// <summary>
    /// The configuration of the distributor.
    /// </summary>
    private Configuration _configuration;

    /// <summary>
    /// The queue of messages to send.
    /// </summary>
    private Queue<OutgoingMessage> _queue;

    /// <summary>
    /// Whether a loop is currently sending messages.
    /// </summary>
    private bool _senderRunning = false;

    /// <summary>
    /// Creates a new web socket distributor.
    /// </summary>
    internal WebSocketDistributor(Configuration configuration)
    {
        _webSocket = new ClientWebSocket();
        _queue = new();
        _configuration = configuration;
        _data = new DistributorData
        {
            Id = configuration.Id,
            Instance = configuration.Instance
        };
    }

    /// <summary>
    /// Connects to the proxy.
    /// </summary>
    private async Task ConnectAsync()
    {
        _webSocket = new ClientWebSocket();
        await _webSocket.ConnectAsync(new Uri(_configuration.ProxyUrl), CancellationToken.None);
        await SendStringAsync("!distribution," + JsonSerializer.Serialize(_data, DistributorSerializerContext.Default.DistributorData));
    }

    /// <summary>
    /// Tries to close the connection to the proxy.
    /// </summary>
    private async Task TryCloseAsync()
    {
        try
        {
            var timeout = new CancellationTokenSource(1000);
            await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", timeout.Token);
        }
        catch { }
    }

    /// <summary>
    /// Serializes a message to a string.
    /// </summary>
    /// <param name="message">The message to serialize.</param>
    /// <returns>The serialized message.</returns>
    private string Serialize(OutgoingMessage message)
    {
        string header = $"[{message.GameId};{message.Sender};{message.Receiver}]";
        return header + message.Message;
    }

    /// <summary>
    /// Sends a message to the proxy.
    /// </summary>
    /// <param name="message">The intercepted ZRP Message.</param>
    public async Task Send(OutgoingMessage message)
    {
        lock (_queue)
        {
            _queue.Enqueue(message);
            // one task is currently sending messages - return here
            // this prevents multiple websocket objects to be created created
            // when ConnectAsync() is called concurrently from multiple tasks
            if (_senderRunning) return;
            _senderRunning = true;
        }

        while (_queue.TryDequeue(out var messageToSend))
        {
            if (_webSocket.State != WebSocketState.Open)
            {
                await TryCloseAsync();
                await ConnectAsync();
            }

            string serialized = Serialize(messageToSend);
            try
            {
                await SendStringAsync(serialized);
            }
            catch (WebSocketException ex)
            {
                if (ex.WebSocketErrorCode == WebSocketError.ConnectionClosedPrematurely)
                {
                    // this error occurs when the proxy server closes the connection unexpectedly
                    // in this case we must setup a new connection and resend the message
                    await ConnectAsync();
                    await SendStringAsync(serialized);
                }
                else throw;
            }
        }
        _senderRunning = false;
    }

    /// <summary>
    /// Sends a string to the proxy.
    /// </summary>
    /// <param name="message">The message to send.</param>
    private async Task SendStringAsync(string message)
    {
        var buffer = Encoding.UTF8.GetBytes(message);
        await _webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
    }
}