import fs from 'fs';
import { ensureDirectoryExistence } from "./utils";
import prompt from 'prompt';
import { Plugin } from "./Plugin";
import { Channel } from "./Channel";

export class Core {
  private static configDir = `${process.cwd()}/.data`;
  private static configFilename = `${Core.configDir}/config.json`;
  private static pluginDir = `${process.cwd()}/src/plugins`;

  private config: any;
  private plugins: Plugin[];

  private channels: Map<string, Channel>;
  constructor() {
    this.plugins = [];
    this.config = { disabledPlugins: [] };// default config
    ensureDirectoryExistence(Core.configDir);
    this.channels = new Map();
  }

  init() {
    this.loadConfig();
    this.discoverPlugins();
    this.loadPlugins();
    this.launch();
  }

  send(data: string) {
    console.log(data);
  }

  private loadConfig() {
    let configFileExists = fs.existsSync(Core.configFilename);
    if (configFileExists) {
      let configBuffer = fs.readFileSync(Core.configFilename);
      this.config = JSON.parse(configBuffer.toString());
    }
    else {
      fs.writeFileSync(Core.configFilename, JSON.stringify(this.config));
    }
  }

  private discoverPlugins() {
    const plugins = fs.readdirSync(Core.pluginDir);
    for (let pluginStr of plugins) {
      const pluginPath = `${Core.pluginDir}/${pluginStr}`;
      const PluginKlass = require(pluginPath).default;
      const plugin = new PluginKlass();
      if (!this.config.disabledPlugins.includes(plugin.name)) {
        this.plugins.push(new PluginKlass());
      }
    }
  }

  private loadPlugins() {
    for (let plugin of this.plugins) {
      const channel = new Channel(plugin);
      this.channels.set(channel.id, channel);
      plugin.setup(channel);
    }
  }

  private launch() {
    console.log('Select app:');
    console.log(this.plugins.map((plugin, index) => `${index + 1}. ${plugin.name}`).join('\n'));
    prompt.get(["option"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const pluginNumber = parseInt(result.option.toString());
      this.runPlugin(this.plugins[pluginNumber - 1]);
    });
  }

  private runPlugin(plugin: Plugin) {
    console.log(``);
    console.log(`...Launching ${plugin.name}`);
    console.log(`Close the app with (Ctrl+C)`);
    console.log(``);
    plugin.launch();
  }
}


