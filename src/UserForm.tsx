import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { UserDraft } from './user';

interface UserFormProps {
  open: boolean;
  initial: UserDraft | null;
  onSubmit: (draft: UserDraft) => Promise<void>;
  onClose: () => void;
}

const EMPTY: UserDraft = {
  firstName: '',
  lastName: '',
  age: 18,
  gender: 'male',
  email: '',
  phone: '',
  image: '',
  role: 'user',
};

export function UserForm({ open, initial, onSubmit, onClose }: UserFormProps) {
  const [draft, setDraft] = useState<UserDraft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(initial ?? EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof UserDraft>(key: K, value: UserDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.firstName.trim()) next.firstName = 'Введите имя';
    if (!draft.lastName.trim()) next.lastName = 'Введите фамилию';
    if (!/^\S+@\S+\.\S+$/.test(draft.email)) next.email = 'Некорректный email';
    if (draft.age <= 0 || draft.age > 120) next.age = 'Возраст должен быть 1–120';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(draft);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const title = initial ? 'Редактирование пользователя' : 'Новый пользователь';

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Имя" error={errors.firstName}>
              <input
                className="input input-bordered w-full"
                value={draft.firstName}
                onChange={(e) => set('firstName', e.target.value)}
              />
            </Field>
            <Field label="Фамилия" error={errors.lastName}>
              <input
                className="input input-bordered w-full"
                value={draft.lastName}
                onChange={(e) => set('lastName', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Возраст" error={errors.age}>
              <input
                type="number"
                className="input input-bordered w-full"
                value={draft.age}
                onChange={(e) => set('age', Number(e.target.value))}
              />
            </Field>
            <Field label="Пол">
              <select
                className="select select-bordered w-full"
                value={draft.gender}
                onChange={(e) => set('gender', e.target.value as UserDraft['gender'])}
              >
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input
              className="input input-bordered w-full"
              value={draft.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>

          <Field label="Телефон">
            <input
              className="input input-bordered w-full"
              value={draft.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </Field>

          <Field label="Роль">
            <input
              className="input input-bordered w-full"
              value={draft.role ?? ''}
              onChange={(e) => set('role', e.target.value)}
            />
          </Field>

          <Field label="Аватар (URL)">
            <input
              className="input input-bordered w-full"
              placeholder="https://…"
              value={draft.image ?? ''}
              onChange={(e) => set('image', e.target.value)}
            />
          </Field>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={submitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting && <span className="loading loading-spinner loading-sm" />}
              Сохранить
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-control w-full">
      <span className="label-text mb-1">{label}</span>
      {children}
      {error && <span className="text-error mt-1 text-xs">{error}</span>}
    </label>
  );
}