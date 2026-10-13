import { useMemo, useState } from 'react';
import { useUsers } from './useUsers';
import type { User, UserDraft } from './user';
import { ConfirmDialog } from './ConfirmDialog';
import { UserCard } from './UserCard';
import { UserForm } from './UserForm';

function toDraft({ id: _id, ...rest }: User): UserDraft {
  return rest;
}

export function UsersPage() {
  const { users, loading, error, reload, addUser, editUser, removeUser } = useUsers();

  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q),
    );
  }, [users, query]);

  const openCreate = () => {
    setEditing(null);
    setActionError(null);
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setActionError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (draft: UserDraft) => {
    try {
      if (editing) await editUser(editing.id, draft);
      else await addUser(draft);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка операции');
      throw e;
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await removeUser(pendingDelete.id);
      setPendingDelete(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка удаления');
    }
  };

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Пользователи</h1>
            <p className="text-sm opacity-70">
              Лаб-1 React
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => void reload()}>
              Обновить
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              + Добавить
            </button>
          </div>
        </header>

        <div className="mb-4">
          <input
            className="input input-bordered w-full max-w-sm"
            placeholder="Поиск по имени или email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {actionError && (
          <div className="alert alert-error mb-4">
            <span>{actionError}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button className="btn btn-sm" onClick={() => void reload()}>
              Повторить
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 text-center opacity-60">Пользователи не найдены</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onEdit={openEdit}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        )}

        <UserForm
          open={formOpen}
          initial={editing ? toDraft(editing) : null}
          onSubmit={handleSubmit}
          onClose={() => setFormOpen(false)}
        />

        <ConfirmDialog
          open={pendingDelete !== null}
          title="Удалить пользователя?"
          description={
            pendingDelete
              ? `${pendingDelete.firstName} ${pendingDelete.lastName} будет удалён.`
              : ''
          }
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setPendingDelete(null)}
        />
      </div>
    </div>
  );
}