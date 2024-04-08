namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// Represents a distributor that can send messages.
/// </summary>
public interface IDistributor
{
    /// <summary>
    /// Sends a message to the zrp proxy.
    /// </summary>
    Task Send(OutgoingMessage message);
}
