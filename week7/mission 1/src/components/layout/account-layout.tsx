import type { ReactNode } from "react";

interface AccountLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AccountLayout({ title, description, children }: AccountLayoutProps) {
  return (
    <main className="min-h-[calc(100dvh-90px)] flex-1 px-4 pt-16 pb-20 sm:pt-52">
      <section className="mx-auto w-full max-w-[424px]" aria-labelledby="account-title">
        <h1 id="account-title" className="text-[32px] leading-10 font-bold tracking-[-0.04em]">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
