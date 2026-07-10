import { accesoAlTata } from '@/lib/access';
import { TabBar } from '@/components/tab-bar';

export default async function TataLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ elderId: string }>;
}) {
  const { elderId } = await params;
  await accesoAlTata(elderId);

  return (
    <div className="lg:pl-52">
      {children}
      <TabBar elderId={elderId} />
    </div>
  );
}
