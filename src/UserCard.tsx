import type { User } from './user';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const avatar =
    user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;

  return (
    <div className="card bg-base-100 shadow-md transition-shadow hover:shadow-lg">
      <div className="card-body items-center text-center">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-2">
            <img src={avatar} alt={fullName} />
          </div>
        </div>

        <h2 className="card-title">{fullName}</h2>
        <span className="badge badge-outline">{user.role ?? 'user'}</span>

        <div className="mt-2 space-y-0.5 text-sm opacity-80">
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p className="opacity-70">
            {user.age} лет · {user.gender === 'male' ? 'Мужской' : 'Женский'}
          </p>
        </div>

        <div className="card-actions mt-3">
          <button
            className="btn btn-info btn-outline btn-sm"
            onClick={() => onEdit(user)}
          >
            Изменить
          </button>
          <button
            className="btn btn-error btn-outline btn-sm"
            onClick={() => onDelete(user)}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}