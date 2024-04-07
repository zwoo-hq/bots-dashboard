namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// Represents a distributor that can send messages.
/// </summary>
public interface Distributor
{
    /// <summary>
    /// Sends a message to the zrp proxy.
    /// </summary>
    void Send(OutgoingMessage message);
}
