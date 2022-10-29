export interface Consumer {
  id: string;
  consume: (data: object) => void;
}
