import { Plugin } from "./models/Plugin";

export interface Register {
  register: (plugin: Plugin) => void;
}
