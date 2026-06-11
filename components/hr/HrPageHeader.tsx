type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export default function HrPageHeader({ title, subtitle, badge }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 sm:px-6 py-5">
      {badge ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-1">{badge}</p>
      ) : null}
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">{subtitle}</p> : null}
    </div>
  );
}
