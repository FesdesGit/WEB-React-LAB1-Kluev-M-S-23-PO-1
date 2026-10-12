import type {User, UserDraft, UsersResponse} from './user';

const DUMMY_URL = 'https://dummyjson.com/users';

export async function fetchUsers(limit = 30): Promise<User[]> {
  const res = await fetch(`${DUMMY_URL}?limit=${limit}`);
  if (!res.ok) throw new Error(`Не удалось загрузить пользователей (${res.status})`);
  const data = (await res.json()) as UsersResponse;
  return data.users;
}

export async function createUserRemote(draft: UserDraft): Promise<void> {
  const res = await fetch(`${DUMMY_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error(`Не удалось создать пользователя (${res.status})`);
}

export async function updateUserRemote(id: number, draft: UserDraft): Promise<void> {
  const res = await fetch(`${DUMMY_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error(`Не удалось обновить пользователя (${res.status})`);
}

export async function deleteUserRemote(id: number): Promise<void> {
  const res = await fetch(`${DUMMY_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Не удалось удалить пользователя (${res.status})`);
}