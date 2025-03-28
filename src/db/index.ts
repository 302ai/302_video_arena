import Dexie, { Table } from "dexie";

import { History } from "./types";

class VideoArenaDB extends Dexie {
  history!: Table<History>;

  constructor() {
    super("video-arena-db");
    this.version(1).stores({
      history: "id, rawPrompt, taskId, type, createdAt",
    });
  }
}

export const db = new VideoArenaDB();
