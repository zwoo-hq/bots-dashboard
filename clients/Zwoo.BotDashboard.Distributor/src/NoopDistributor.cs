namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A distributor that does nothing.
/// </summary>
internal class NoopDistributor : IDistributor
{
    /// <summary>
    /// do nothing.
    /// </summary>
    public Task SendAsync(OutgoingMessage message)
    {
        return Task.CompletedTask;
    }
}