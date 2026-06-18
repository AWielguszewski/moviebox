export function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-6 text-center text-xs text-muted sm:px-6">
      <p>
        Data provided by{" "}
        <a
          href="https://www.omdbapi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          OMDb API
        </a>
        . Built with Next.js.
      </p>
    </footer>
  );
}
