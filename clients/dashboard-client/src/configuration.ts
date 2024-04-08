export class Configuration {
  /**
   * create a new Configuration instance from the import.meta.env
   *
   * @static
   * @returns {Configuration}
   *
   * @memberOf Configuration
   */
  public static fromImportMeta(): Configuration {
    return new Configuration(import.meta.env.ZRP_DEBUG_PROXY_URL!);
  }

  /**
   * create a new Configuration instance from the process.env
   *
   * @static
   * @returns {Configuration}
   *
   * @memberOf Configuration
   */
  public static fromEnv(): Configuration {
    return new Configuration(process.env.ZRP_DEBUG_PROXY_URL!);
  }

  /**
   * create a new Configuration instance from the given proxyUrl
   *
   * @static
   * @param {string} proxyUrl the zrp proxy url
   * @returns {Configuration}
   *
   * @memberOf Configuration
   */
  public static withUrl(proxyUrl: string): Configuration {
    return new Configuration(proxyUrl);
  }

  private constructor(public readonly proxyUrl: string) {}
}
