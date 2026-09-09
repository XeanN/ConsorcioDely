export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-300 px-6 py-12 text-center">
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="text-sm text-neutral-500">{description}</p>
      {action}
    </div>
  );
}
