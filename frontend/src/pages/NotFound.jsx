import Brand from "../components/Brand";
import ErrorState from "../components/ErrorState";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Brand />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <ErrorState title="Page not found" message="That route doesn't exist. Start a new summary from the home page." />
      </main>
    </div>
  );
}
