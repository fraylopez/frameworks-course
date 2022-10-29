import { Plugin } from "../models/Plugin";

export class LauchPluginController {
  launchPlugin(plugin: Plugin) {
    plugin.launch();
  }
}
