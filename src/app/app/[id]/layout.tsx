import Navbar from '../../components/navbar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 sm:rounded-3xl">
      <aside className="col-span-4 lg:col-span-1">
        <Navbar />
      </aside>
      <article className="col-span-4 lg:col-span-3 bg-zinc-200 px-4 md:px-8">{children}</article>
    </div>
  );
}

export default Layout;
