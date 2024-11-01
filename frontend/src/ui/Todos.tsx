import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconDelete, IconPlus } from "../icons/icon";
import { TrackService } from "../services/TrackService";
import { Todo } from "../services/Types";
import { Utils } from "../services/utils";
import { Checkbox } from "./base/Checkbox";
import { EditableInput } from "./forms/EditableInput";
import { EditableTextarea } from "./forms/EditableTextarea";
import { SingleInputForm } from "./forms/SingleInputForm";
import { getTagAndTextForDescription } from "./TrackDescriptionText";

const navigateFocusOfSummaries = (
  e: React.KeyboardEvent,
  summary?: HTMLElement | null,
): boolean | undefined => {
  if (e.code === "ArrowDown" || e.code === "ArrowUp") {
    const details = summary?.parentElement;
    const detailsContainer = details?.parentElement;
    if (detailsContainer) {
      const thisIndex = [...detailsContainer.children].indexOf(details);

      const nextTarget = detailsContainer.children[
        thisIndex + (e.code === "ArrowDown" ? 1 : -1)
      ]?.firstChild as HTMLElement;

      if (nextTarget) {
        e.preventDefault();
        nextTarget.focus();
        return true;
      }
    }
  }
};

type NestedTodos = { list: Todo[]; nested: Record<string, Todo[]> };

const convertListToNested = (list: Todo[]): NestedTodos =>
  list.reduce<NestedTodos>(
    (red, cur) => {
      const [tag] = getTagAndTextForDescription(cur.title);
      if (!tag) red.list = [...red.list, cur];
      else {
        red.nested[tag] ??= [];
        red.nested[tag] = [...red.nested[tag], cur];
      }
      return red;
    },
    { list: [], nested: {} },
  );

type TodoItemsProps = {
  todos: Todo[];
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (todo: Todo) => Promise<void>;
  onMove: (todoID: string, index: number) => Promise<void>;
  noTag?: boolean;
};

const TodoItems: React.FC<TodoItemsProps> = ({ todos, ...rest }) => (
  <div className="todos__list">
    {todos.map((todo, index) => (
      <TodoItem todo={todo} key={todo.ID} index={index} {...rest} />
    ))}
  </div>
);

type TodoItemProps = {
  todo: Todo;
  index: number;
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (todo: Todo) => Promise<void>;
  onMove: (todoID: string, index: number) => Promise<void>;
  noTag?: boolean;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todo: { title, description, resolvedAt },
  onChange,
  onRemove,
  index,
  onMove,
  noTag,
}) => {
  const onChangeTitle = useCallback(
    (title: string) => onChange({ ...todo, title }),
    [onChange, todo],
  );
  const onChangeDescription = useCallback(
    (description: string) => onChange({ ...todo, description }),
    [onChange, todo],
  );
  const onChangeResolved = useCallback(
    (checked: boolean) =>
      onChange({ ...todo, resolvedAt: checked ? new Date() : undefined }),
    [onChange, todo],
  );
  const _onRemove = useCallback(() => onRemove(todo), [onRemove, todo]);

  const ref = useRef<HTMLElement>(null);
  const enterCount = useRef(0);

  const onDragEnter = useCallback(() => {
    if (!enterCount.current)
      ref.current?.style.setProperty("--todo-color-outline", "white");
    enterCount.current++;
  }, []);

  const onDragLeave = useCallback(() => {
    enterCount.current--;
    if (!enterCount.current)
      ref.current?.style.removeProperty("--todo-color-outline");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      // simulate that the drag ended
      enterCount.current = 1;
      onDragLeave();
      onMove!(e.dataTransfer.getData("todo"), index);
    },
    [index, onDragLeave, onMove],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName?.toLowerCase() === "input") return;
    if (navigateFocusOfSummaries(e, ref.current)) return;
  }, []);

  return (
    <details>
      <summary
        ref={ref}
        tabIndex={0}
        draggable={!!onMove}
        onDragStart={(e) => e.dataTransfer.setData("todo", todo.ID)}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onKeyDown={onKeyDown}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          className="todo__summary"
          onKeyUp={
            (e) =>
              e.preventDefault() /* prevent collapsing of details on hitting "space" in input */
          }
        >
          <EditableInput
            value={title}
            onChange={onChangeTitle}
            inputName={"todo-title"}
            className={"todo__sub-summary"}
            hideTag={noTag}
          />
          <button
            onClick={_onRemove}
            className={"icon-button delete"}
            title={"delete todo"}
            aria-label={"delete todo"}
          >
            <IconDelete />
          </button>
          <Checkbox
            name={"todo-resolved"}
            value={!!resolvedAt}
            onChange={onChangeResolved}
          />
        </div>
      </summary>
      <div className="todo__content">
        {resolvedAt && (
          <p className="todo__resolved">
            Resolved at: {resolvedAt.toLocaleString()}
          </p>
        )}
        <EditableTextarea
          className={"todo__description"}
          onChange={onChangeDescription}
          value={description}
          name={"todo-description"}
        />
      </div>
    </details>
  );
};
export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    TrackService.current().getTodos().then(setTodos);
  }, []);

  const createOrUpdateTodo = useCallback(
    (todo: Todo) =>
      TrackService.current().createOrUpdateTodo(todo).then(setTodos),
    [],
  );

  const removeTodo = useCallback(
    (todo: Todo) => TrackService.current().removeTodo(todo).then(setTodos),
    [],
  );

  const add = useCallback((title: string) => {
    const ID = Utils.uuid();
    const createdAt = new Date();
    const next: Todo = { ID, title, description: "", createdAt };
    return TrackService.current()
      .createOrUpdateTodo(next)
      .then(() => {
        setTodos((tt) => [next].concat(tt));
      });
  }, []);

  const moveTodo = useCallback(
    (todoID: string, index: number) =>
      TrackService.current().moveTodo(todoID, index).then(setTodos),
    [],
  );

  const [openTodos, resolvedTodos] = useMemo<NestedTodos[]>(
    () =>
      todos
        .reduce<[Todo[], Todo[]]>(
          (red, todo) => {
            if (todo.resolvedAt) {
              red[1].push(todo);
            } else {
              red[0].push(todo);
            }
            return red;
          },
          [[], []],
        )
        .map(convertListToNested),
    [todos],
  );

  const handlers = {
    onChange: createOrUpdateTodo,
    onRemove: removeTodo,
    onMove: moveTodo,
  };

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (navigateFocusOfSummaries(e, e.target as HTMLElement)) return;
  }, []);

  return (
    <div className="todos">
      <div className="add-todo">
        <IconPlus />
        <SingleInputForm onChange={add} inputName={"toto-title"} />
      </div>
      {Object.entries(openTodos.nested).map(([tag, todos]) => (
        <details className="todos_group" key={tag}>
          <summary onKeyDown={onKeyDown}>{tag}</summary>
          <TodoItems todos={todos} {...handlers} noTag />
        </details>
      ))}
      <TodoItems todos={openTodos.list} {...handlers} />
      <details className="todos_resolved">
        <summary>Resolved ✔</summary>
        <div className="todos_resolved_items">
          {Object.entries(resolvedTodos.nested).map(([tag, todos]) => (
            <details className="todos_group" key={tag}>
              <summary onKeyDown={onKeyDown}>{tag}</summary>
              <TodoItems todos={todos} {...handlers} noTag />
            </details>
          ))}
          <TodoItems todos={resolvedTodos.list} {...handlers} />
        </div>
      </details>
    </div>
  );
};
