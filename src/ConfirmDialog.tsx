interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Удалить',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && <p className="py-4">{description}</p>}
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            Отмена
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onCancel} />
    </div>
  );
}