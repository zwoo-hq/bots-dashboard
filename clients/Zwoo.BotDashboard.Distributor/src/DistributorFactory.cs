namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A factory for creating distributors.
/// </summary>
public class DistributorFactory
{

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    /// <summary>
    /// Creates a new distributor.
    /// </summary>
    public static async Task<Distributor> CreateDistributorAsync(Configuration configuration)
    {
        Distributor instance;
#if ZRP_DEBUG
        instance = new WebSocketDistributor(configuration);
        await instance.ConnectAsync();
#else
        instance = new NoopDistributor();
#endif
        return instance;
    }
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously

}
