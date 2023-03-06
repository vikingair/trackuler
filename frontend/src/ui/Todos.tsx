import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Todo } from '../services/Types';
import { TrackService } from '../services/TrackService';
import { IconDelete, IconPlus } from '../icons/icon';
import { SingleInputForm } from './forms/SingleInputForm';
import { Utils } from '../services/utils';
import { EditableInput } from './forms/EditableInput';
import { Checkbox } from './base/Checkbox';
import { EditableTextarea } from './forms/EditableTextarea';

type TodoItemProps = { todo: Todo; onChange: (todo: Todo) => Promise<void>; onRemove: (todo: Todo) => Promise<void> };

const TodoItem: React.FC<TodoItemProps> = ({ todo, todo: { title, description, resolvedAt }, onChange, onRemove }) => {
    const onChangeTitle = useCallback((title: string) => onChange({ ...todo, title }), [onChange, todo]);
    const onChangeDescription = useCallback(
        (description: string) => onChange({ ...todo, description }),
        [onChange, todo]
    );
    const onChangeResolved = useCallback(
        (checked: boolean) => onChange({ ...todo, resolvedAt: checked ? new Date() : undefined }),
        [onChange, todo]
    );
    const _onRemove = useCallback(() => onRemove(todo), [onRemove, todo]);

    return (
        <details>
            <summary>
                <div
                    className="todo__summary"
                    onKeyUp={(e) => e.preventDefault() /* prevent collapsing of details on hitting "space" in input */}>
                    <EditableInput
                        value={title}
                        onChange={onChangeTitle}
                        inputName={'todo-title'}
                        className={'todo__sub-summary'}
                    />
                    <button
                        onClick={_onRemove}
                        className={'icon-button delete'}
                        title={'delete todo'}
                        aria-label={'delete todo'}>
                        <IconDelete />
                    </button>
                    <Checkbox name={'todo-resolved'} value={!!resolvedAt} onChange={onChangeResolved} />
                </div>
            </summary>
            <div className="todo__content">
                {resolvedAt && <p className="todo__resolved">Resolved at: {resolvedAt.toLocaleString()}</p>}
                <EditableTextarea
                    className={'todo__description'}
                    onChange={onChangeDescription}
                    value={description}
                    name={'todo-description'}
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
        (todo: Todo) => TrackService.current().createOrUpdateTodo(todo).then(setTodos),
        []
    );

    const removeTodo = useCallback((todo: Todo) => TrackService.current().removeTodo(todo).then(setTodos), []);

    const add = useCallback((title: string) => {
        const ID = Utils.uuid();
        const createdAt = new Date();
        const next: Todo = { ID, title, description: '', createdAt };
        return TrackService.current()
            .createOrUpdateTodo(next)
            .then(() => {
                setTodos((tt) => [next].concat(tt));
            });
    }, []);

    const [openTodos, resolvedTodos] = useMemo<[Todo[], Todo[]]>(
        () =>
            todos.reduce(
                (red, todo) => {
                    if (todo.resolvedAt) {
                        red[1].push(todo);
                    } else {
                        red[0].push(todo);
                    }
                    return red;
                },
                [[], []] as [Todo[], Todo[]]
            ),
        [todos]
    );

    return (
        <div className="todos">
            <div className="add-todo">
                <IconPlus />
                <SingleInputForm onChange={add} inputName={'toto-title'} />
            </div>
            <div className="todos__list">
                {openTodos.map((todo) => (
                    <TodoItem todo={todo} key={todo.ID} onChange={createOrUpdateTodo} onRemove={removeTodo} />
                ))}
            </div>
            <details>
                <summary>Resolved ✔</summary>
                <div className="todos__list">
                    {resolvedTodos.map((todo) => (
                        <TodoItem todo={todo} key={todo.ID} onChange={createOrUpdateTodo} onRemove={removeTodo} />
                    ))}
                </div>
            </details>
        </div>
    );
};
