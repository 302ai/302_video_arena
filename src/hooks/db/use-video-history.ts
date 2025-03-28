import { createScopedLogger } from "@/utils/logger";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db";
import { History } from "@/db/types";
import { useCallback } from "react";
import { AddHistory } from "@/db/types";

const logger = createScopedLogger("use-video-history");
const DEFAULT_PAGE_SIZE = 10;

export const useVideoHistory = (
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  type?: "gen" | "pk"
) => {
  const offset = (page - 1) * pageSize;

  const videoHistory = useLiveQuery(async () => {
    let query = db.history.orderBy("createdAt");

    if (type) {
      query = query.filter((x) => x.type === type);
    }

    const result = await query
      .reverse()
      .offset(offset)
      .limit(pageSize)
      .toArray();
    return result;
  }, [page, pageSize, type]);

  const history = useLiveQuery(async () => {
    let baseQuery = db.history.orderBy("createdAt");

    if (type) {
      baseQuery = baseQuery.filter((x) => x.type === type);
    }

    const [items, total] = await Promise.all([
      baseQuery.reverse().offset(offset).limit(pageSize).toArray(),
      type ? db.history.where("type").equals(type).count() : db.history.count(),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }, [page, pageSize, type]);

  const addHistory = useCallback(async (history: AddHistory) => {
    const id = crypto.randomUUID();
    await db.history.add({
      ...history,
      id,
      createdAt: Date.now(),
    });
    return id;
  }, []);

  const updateHistory = useCallback((id: string, history: Partial<History>) => {
    db.history.update(id, history);
  }, []);

  const deleteHistory = useCallback((id: string) => {
    db.history.delete(id);
  }, []);

  const updateVideoStatus = useCallback(
    async (
      historyId: string,
      index: number,
      status: "pending" | "processing" | "success" | "failed"
    ) => {
      await db.history
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          if (history.videos && history.videos[index]) {
            history.videos[index].status = status;
          }
        });
    },
    []
  );

  const updateVideoUrl = useCallback(
    async (historyId: string, index: number, url: string) => {
      await db.history
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          if (history.videos && history.videos[index]) {
            history.videos[index].url = url;
          }
        });
    },
    []
  );

  const updateTaskId = useCallback(
    async (historyId: string, taskId: string) => {
      await db.history
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          history.taskId = taskId;
        });
    },
    []
  );

  return {
    videoHistory,
    history,
    addHistory,
    updateHistory,
    deleteHistory,
    updateVideoStatus,
    updateVideoUrl,
    updateTaskId,
  };
};
