namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// Represents the configuration for the distributor.
/// </summary>
public class Configuration
{
    /// <summary>
    /// Creates a new configuration from environment variables.
    /// </summary>
    /// <returns>the configuration</returns>
    public static Configuration FromEnv()
    {
        return new Configuration
        {
            Id = Environment.GetEnvironmentVariable("ZRP_DEBUG_ID") ?? string.Empty,
            Instance = Environment.GetEnvironmentVariable("ZRP_DEBUG_INSTANCE") ?? string.Empty,
            ProxyUrl = Environment.GetEnvironmentVariable("ZRP_DEBUG_PROXY_URL") ?? string.Empty
        };
    }

    /// <summary>
    /// The distributor ID.
    /// </summary>
    public required string Id { get; set; }

    /// <summary>
    /// The distributor instance (the url of the distributor).
    /// </summary>
    public required string Instance { get; set; }

    /// <summary>
    /// The url of the zrp proxy to connect to.
    /// </summary>
    public required string ProxyUrl { get; set; }

    private Configuration() { }
}