import { Plugin } from "./Plugin";

export interface Register {
  register: (plugin: Plugin) => void;
}
