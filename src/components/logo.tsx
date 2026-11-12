/** @format */

export default function Logo({
  pequeno = false,
  escuro = false,
}: {
  pequeno?: boolean;
  escuro?: boolean;
}) {
  const tamanho = pequeno ? 32 : 42;
  return (
    <div className="flex items-center gap-3">
      <svg
        width={tamanho}
        height={tamanho}
        viewBox="0 0 42 42"
        aria-hidden="true"
      >
        <rect width="42" height="42" rx="10" fill="#2d5b49" />
        <path d="M11 10h13v6h-7v10h14v6H11z" fill="white" />
      </svg>
      <span
        className={`font-bold tracking-tight ${escuro ? "text-white" : "text-gray-900"} ${
          pequeno ? "text-2xl" : "text-4xl"
        }`}
      >
        LogMagna
      </span>
    </div>
  );
}
