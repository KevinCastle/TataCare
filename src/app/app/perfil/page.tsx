import type { Metadata } from 'next';
import { usuarioActual } from '@/lib/access';
import { db } from '@/lib/db';
import { iniciales } from '@/lib/utils';
import { actualizarMiAvatar } from '@/lib/actions/users';
import { cerrarSesion } from '@/lib/actions/auth';
import { AppBar, Content } from '@/components/shell';
import { Avatar, Card } from '@/components/ui';
import { PerfilForm } from './perfil-form';

export const metadata: Metadata = { title: 'Mi perfil' };

export default async function PerfilPage() {
  const sesion = await usuarioActual();
  const user = await db.user.findUnique({ where: { id: sesion.id } });
  if (!user) return null;

  return (
    <>
      <AppBar title="Mi perfil" backHref="/app" />
      <Content>
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <Avatar initials={iniciales(user.name, user.surname)} imageUrl={user.avatarUrl} size="lg" tone="copihue" />
          <div>
            <p className="text-xl font-bold">
              {user.name} {user.surname}
            </p>
            <p className="text-niebla">{user.email}</p>
          </div>
        </Card>

        <div className="mt-5">
          <PerfilForm action={actualizarMiAvatar} />
        </div>

        <form action={cerrarSesion} className="mt-10 text-center">
          <button type="submit" className="min-h-12 rounded-xl px-5 font-bold text-niebla hover:bg-pino/10 hover:text-tinta">
            Cerrar sesión
          </button>
        </form>
      </Content>
    </>
  );
}
