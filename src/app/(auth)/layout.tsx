import Link from 'next/link';
import { LogoMark } from '@/components/icons';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-5 py-10">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <span className="flex size-10 items-center justify-center rounded-xl bg-pino text-papel">
          <LogoMark size={24} />
        </span>
        Tata<span className="-ml-1 text-pino-oscuro">Care</span>
      </Link>
      <main id="contenido" className="w-full max-w-sm">
        {children}
      </main>
    </div>
  );
}
