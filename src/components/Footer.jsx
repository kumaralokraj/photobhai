export default function Footer() {
  return (
    <footer className="border-t border-slate-800 px-4 py-7 text-center text-sm text-slate-500">
      <p>
        © {new Date().getFullYear()} PhotoBhai.
        Made for quick, private image editing.
      </p>
    </footer>
  );
}