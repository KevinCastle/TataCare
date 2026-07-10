import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { usuarioActual } from '@/lib/access';
import { aceptarInvitacion } from '@/lib/actions/share';
import { Button, ButtonLink, Card } from '@/components/ui';
import { LogoMark } from '@/components/icons';

export const metadata: Metadata = { title: 'Invitación' };

export default async function InvitacionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  await usuarioActual();

  const invite = await db.invite.findUnique({
    where: { code },
    include: { elder: { select: { name: true, surname: true } }, createdBy: { select: { name: true } } },
  });

  const valida =
    invite && invite.kind === 'CAREGIVER' && !invite.usedAt && !invite.revokedAt && invite.expiresAt > new Date();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-5">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-pino text-papel">
        <LogoMark size={32} />
      </span>
      {valida ? (
        <>
          <Card className="w-full text-center">
            <h1 className="text-xl font-bold">
              {invite.createdBy.name} te invita a cuidar a {invite.elder.name} {invite.elder.surname}
            </h1>
            <p className="mt-2 text-niebla">
              Tendrás acceso {invite.role === 'VIEWER' ? 'de solo lectura' : 'para ver y editar'} a su ficha,
              remedios y bitácora.
            </p>
          </Card>
          <form action={aceptarInvitacion.bind(null, code)} className="w-full">
            <Button type="submit" className="w-full text-lg">
              Aceptar invitación
            </Button>
          </form>
        </>
      ) : (
        <>
          <Card className="w-full text-center">
            <h1 className="text-xl font-bold">Esta invitación ya no sirve</h1>
            <p className="mt-2 text-niebla">
              Puede que haya vencido, ya se haya usado o la hayan revocado. Pídele a quien te invitó que genere una
              nueva — toma 10 segundos.
            </p>
          </Card>
          <ButtonLink href="/app" variant="ghost" className="w-full">
            Ir a mis tatas
          </ButtonLink>
        </>
      )}
    </div>
  );
}
