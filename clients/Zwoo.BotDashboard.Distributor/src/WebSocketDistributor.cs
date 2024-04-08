
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
    /// Creates a new web socket distributor.
    /// </summary>
    internal WebSocketDistributor(Configuration configuration)
    {
        _webSocket = new ClientWebSocket();
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
    /// Sends a message to the proxy.
    /// </summary>
    public async void Send(OutgoingMessage message)
    {
        string header = $"[{message.GameId};{message.Sender};{message.Receiver}]";
        await SendStringAsync(header + message.Message);
    }

    /// <summary>
    /// Sends a string as web socket message.
    /// </summary>
    private async Task SendStringAsync(string message)
    {
        if (_webSocket.State != WebSocketState.Open)
        {
            try
            {
                await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            catch { }
            await ConnectAsync();
        }

        var buffer = Encoding.UTF8.GetBytes(message);
        await _webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
    }
}