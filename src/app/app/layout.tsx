function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-gradient-to-br from-indigo-600 to-teal-500 flex justify-center sm:p-4 2xl:py-8 min-h-svh">
      <div className="2xl:w-[1536px] w-full min-h-full sm:rounded-3xl overflow-hidden">
        {children}
      </div>
    </main>
  );
}

export default Layout;
