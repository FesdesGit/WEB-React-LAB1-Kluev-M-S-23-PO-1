import { useCallback, useEffect, useState } from 'react';
import {
  createUserRemote,
  deleteUserRemote,
  fetchUsers,
  updateUserRemote,
} from './users';
import type { User, UserDraft } from './user';

const isLocal = (id: number) => id < 0;

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await fetchUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addUser = useCallback(async (draft: UserDraft) => {
    await createUserRemote(draft);
    const created: User = { ...draft, id: -Date.now() };
    setUsers((prev) => [created, ...prev]);
    return created;
  }, []);

  const editUser = useCallback(async (id: number, draft: UserDraft) => {
    if (!isLocal(id)) {
      await updateUserRemote(id, draft);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...draft } : u)),
    );
  }, []);

  const removeUser = useCallback(async (id: number) => {
    if (!isLocal(id)) {
      await deleteUserRemote(id);
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return { users, loading, error, reload, addUser, editUser, removeUser };
}