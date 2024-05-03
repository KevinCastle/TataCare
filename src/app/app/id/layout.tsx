import Navbar from '../../components/navbar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 md:col-span-1">
        <Navbar />
      </div>
      <div className="col-span-4 md:col-span-3 p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

export default Layout;
