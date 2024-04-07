using System.Text.Json;
using System.Text.Json.Serialization;

namespace Zwoo.BotDashboard.Distributor;

/// <summary>
/// Represents the meta data of the distributor for the proxy.
/// </summary>
public struct DistributorData
{
    /// <summary>
    /// The distributor ID.
    /// Taken from <see cref="Configuration.Id" />.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The distributor instance (the url of the distributor).
    /// Taken from <see cref="Configuration.Instance" />.
    /// </summary>
    public string Instance { get; set; }
}

/// <summary>
/// A JsonSerializerContext for a source generation powered json serializer.
/// </summary>
[JsonSerializable(typeof(DistributorData))]
[JsonSerializable(typeof(OutgoingMessage))]
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
public partial class DistributorSerializerContext : JsonSerializerContext { }