namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A distributor that does nothing.
/// </summary>
internal class NoopDistributor : IDistributor
{
    /// <summary>
    /// do nothing.
    /// </summary>
    public void Send(OutgoingMessage message) { }
}