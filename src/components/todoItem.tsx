/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todoId: number, data: Partial<Todo>) => void;
  onError?: (message: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onUpdate,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = () => {
    onUpdate?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleDelete = () => {
    if (todo.id) {
      onDelete?.(todo.id);
    }
  };

  const handleUpdate = async () => {
    console.log('handleUpdate виклик');
    console.log('Edit Title:', editTitle);

    if (editTitle.trim()) {
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      try {
        await onUpdate?.(todo.id, { title: editTitle.trim() });

        setIsEditing(false);
      } catch {
        console.log('не оновлюється');
        onError?.('Unable to update a todo');
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('порожній тайтл');
      onError?.('Title should not be empty');
      setEditTitle(todo.title);
      handleDelete();
    }
  };

  const handleInputBlur = () => {
    if (editTitle.trim()) {
      handleUpdate();
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUpdate();
    } else if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed || isLoading}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isProcessed || isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
