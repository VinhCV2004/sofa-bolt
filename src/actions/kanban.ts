import type { UniqueIdentifier } from '@dnd-kit/core';
import type { IKanban, IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/mock-api';

// ----------------------------------------------------------------------

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type BoardData = {
  board: IKanban;
};

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR<BoardData>(
    KANBAN_ENDPOINT,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const tasks = data?.board.tasks ?? {};
    const columns = data?.board.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [data?.board.columns, data?.board.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData: IKanbanColumn) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId: UniqueIdentifier, columnName: string) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      const columns = board.columns.map((column) =>
        column.id === columnId
          ? {
              // Update data when found
              ...column,
              name: columnName,
            }
          : column
      );

      return { ...currentData, board: { ...board, columns } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns: IKanbanColumn[]) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      return { ...currentData, board: { ...board, columns: updateColumns } };
    },
    false
  );

}

// ----------------------------------------------------------------------

export async function clearColumn(columnId: UniqueIdentifier) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // remove all tasks in column
      const tasks = { ...board.tasks, [columnId]: [] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId: UniqueIdentifier) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // delete column in board.columns
      const columns = board.columns.filter((column) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key) => key !== columnId)
        .reduce((obj: IKanban['tasks'], key) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // add task in board.tasks
      const tasks = { ...board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // tasks in column
      const tasksInColumn = board.tasks[columnId];

      // find and update task
      const updateTasks = tasksInColumn.map((task) =>
        task.id === taskData.id
          ? {
              // Update data when found
              ...task,
              ...taskData,
            }
          : task
      );

      const tasks = { ...board.tasks, [columnId]: updateTasks };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveTask(updateTasks: IKanban['tasks']) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // update board.tasks
      const tasks = updateTasks;

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );

}

// ----------------------------------------------------------------------

export async function deleteTask(columnId: UniqueIdentifier, taskId: UniqueIdentifier) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task) => task.id !== taskId),
      };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}
