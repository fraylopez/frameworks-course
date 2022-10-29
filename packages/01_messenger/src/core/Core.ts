import fs from 'fs';
import { ensureDirectoryExistence } from "./utils";
import { Plugin } from "./models/Plugin";
import { RabbitMQPubSub } from "./adapters/services/RabbitMQPubSub";
import { PubSub } from "./services/PubSub";
import { LauncherConsoleView } from "./adapters/views/LauncherView";
import { LauchPluginController } from "./controllers/LauchPluginController";
import { MessageController } from "./controllers/MessageController";

export class Core {
  private static configDir = `${process.cwd()}/.data`;
  private static configFilename = `${Core.configDir}/config.json`;
  private static pluginDir = `${process.cwd()}/src/plugins`;

  private config: any;
  private plugins: Plugin[];

  private pubsub: PubSub;
  private launcherView: LauncherConsoleView;
  private messageController: MessageController;
  constructor() {
    this.plugins = [];
    this.config = { disabledPlugins: [] };// default config
    ensureDirectoryExistence(Core.configDir);
    ensureDirectoryExistence(Core.pluginDir);
    this.pubsub = new RabbitMQPubSub("amqp://guest:guest@localhost:5673");
    this.launcherView = new LauncherConsoleView(this.plugins, new LauchPluginController());
    this.messageController = new MessageController(this.pubsub);
  }

  async init() {
    this.loadConfig();
    this.discoverPluginsAt(Core.pluginDir);
    await this.initServices();
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

  private discoverPluginsAt(pluginDir: string) {
    const plugins = fs.readdirSync(pluginDir);
    for (let pluginStr of plugins) {
      const pluginPath = `${pluginDir}/${pluginStr}`;
      if (fs.lstatSync(pluginPath).isFile()) {
        const PluginKlass = require(pluginPath).default;
        const plugin = new PluginKlass();
        if (!this.config.disabledPlugins.includes(plugin.name)) {
          this.plugins.push(new PluginKlass());
        }
      }
    }
  }

  private loadPlugins() {
    for (let plugin of this.plugins) {
      plugin.setup(this.messageController);
    }
  }

  private async initServices() {
    await this.pubsub.connect();
  }

  private launch() {
    this.launcherView.showPluginSelection();
  }
}


