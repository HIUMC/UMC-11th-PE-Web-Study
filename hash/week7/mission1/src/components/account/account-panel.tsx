import type { ReactNode } from "react";

export const accountInputClass =
  "w-full min-w-0 rounded-lg border border-[#dce0e9] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#6b7280] focus:border-[#4765df] focus:ring-1 focus:ring-[#4765df] aria-invalid:border-red-500 disabled:bg-gray-50";

export const accountButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#4765df] px-4 py-2 text-sm font-bold text-white hover:bg-[#3954c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df] disabled:cursor-not-allowed disabled:opacity-50";

export const accountLinkClass =
  "font-semibold text-[#344fc4] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]";

export function AccountPanel({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: "person" | "lock" | "edit";
  children: ReactNode;
}) {
  return (
    <main className="flex w-full flex-1 justify-center px-4 py-10 sm:py-16">
      <section
        aria-labelledby="account-title"
        className="w-full max-w-[480px] self-start rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-sm sm:p-8"
      >
        <header className="mb-6">
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[#edf0ff]">
            <img src={"/icons/" + icon + ".svg"} alt="" className="size-5" />
          </span>
          <h1 id="account-title" className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#555d6d]">{description}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
