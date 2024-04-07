namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A distributor that does nothing.
/// </summary>
internal class NoopDistributor : Distributor
{
    /// <summary>
    /// do nothing.
    /// </summary>
    public void Send(OutgoingMessage message) { }
}