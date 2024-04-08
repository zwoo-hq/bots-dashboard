namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A factory for creating distributors.
/// </summary>
public class DistributorFactory
{

        /// <summary>
        /// Creates a new distributor.
        /// </summary>
        public static IDistributor CreateDistributorAsync(Configuration configuration, bool debugEnabled = false)
        {
                return debugEnabled
                        ? new WebSocketDistributor(configuration)
                        : new NoopDistributor();
        }

}
