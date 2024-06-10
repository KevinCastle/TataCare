import Navbar from '../../components/navbar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-cols-4">
      <aside className="col-span-4 md:col-span-1">
        <Navbar />
      </aside>
      <article className="col-span-4 md:col-span-3 bg-zinc-200 px-8 py-10">{children}</article>
    </main>
  );
}

export default Layout;
