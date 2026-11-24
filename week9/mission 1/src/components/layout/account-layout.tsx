import type { ReactNode } from "react";

interface AccountLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function AccountLayout({ title, description, children, action }: AccountLayoutProps) {
  return (
    <main className="flex flex-1 px-4 pt-6 pb-7 sm:px-8 sm:pt-7">
      <section className="mx-auto flex w-full max-w-7xl flex-col" aria-labelledby="account-title">
        <div className="flex items-center justify-between gap-4">
        <div>
        <h1 id="account-title" className="text-[28px] leading-10 font-bold tracking-[-0.04em]">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
        </div>
        {action}
        </div>
        <div className="mt-7 flex flex-1 flex-col">{children}</div>
      </section>
    </main>
  );
}
