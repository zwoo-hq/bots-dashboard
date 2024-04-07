namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// A factory for creating distributors.
/// </summary>
public class DistributorFactory
{

        /// <summary>
        /// Creates a new distributor.
        /// </summary>
        public static async Task<IDistributor> CreateDistributorAsync(Configuration configuration, bool debugEnabled = false)
        {
                IDistributor instance;
                if (debugEnabled)
                {
                        var wsInstance = new WebSocketDistributor(configuration);
                        await wsInstance.ConnectAsync();
                        instance = wsInstance;
                }
                else
                {
                        instance = new NoopDistributor();
                }
                return instance;
        }

}
