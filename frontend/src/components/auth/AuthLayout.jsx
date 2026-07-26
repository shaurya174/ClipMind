import Brand from "../Brand";

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Brand />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="animate-fadeUp">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-2 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-paper">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-sm text-paper-muted">{subtitle}</p>}

          <div className="mt-8 card p-6 sm:p-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-paper-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
