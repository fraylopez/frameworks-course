import prompt from 'prompt';
import { Plugin } from "../../models/Plugin";
import { LauncherView } from "../../views/View";
import { LauchPluginController } from "../../controllers/LauchPluginController";
export class LauncherConsoleView implements LauncherView {
  constructor(
    private readonly plugins: Plugin[],
    private readonly controller: LauchPluginController
  ) { }

  showPluginSelection() {
    console.log('Select app:');
    console.log(this.plugins.map((plugin, index) => `${index + 1}. ${plugin.name}`).join('\n'));
    prompt.get(["option"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const pluginNumber = parseInt(result.option.toString());
      this.controller.launchPlugin(this.plugins[pluginNumber - 1]);
    });
  }
}