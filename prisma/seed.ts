/* Datos de demo para desarrollo: npx tsx prisma/seed.ts */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

function fechaISO(offsetDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(d);
}

async function main() {
  const password = await bcrypt.hash('tatacare123', 10);

  const kevin = await db.user.upsert({
    where: { email: 'demo@tatacare.cl' },
    update: {},
    create: { name: 'Kevin', surname: 'Castillo', email: 'demo@tatacare.cl', password },
  });

  const carmen = await db.user.upsert({
    where: { email: 'carmen@tatacare.cl' },
    update: {},
    create: { name: 'Carmen', surname: 'Soto', email: 'carmen@tatacare.cl', password },
  });

  const existe = await db.elder.findFirst({ where: { name: 'Luis', surname: 'Soto' } });
  if (existe) {
    console.log('Seed ya aplicado — nada que hacer.');
    return;
  }

  const luis = await db.elder.create({
    data: {
      name: 'Luis',
      surname: 'Soto',
      sex: 'masculino',
      birthdate: new Date('1944-03-12'),
      bloodType: 'O+',
      insurance: 'Fonasa',
      nationality: 'Chilena',
      identificationNumber: '12.345.678-9',
      weightKg: 75,
      caregivers: {
        create: [
          { userId: kevin.id, role: 'OWNER' },
          { userId: carmen.id, role: 'EDITOR' },
        ],
      },
    },
  });

  const [hipertension, diabetes] = await Promise.all([
    db.condition.create({
      data: { elderId: luis.id, type: 'DISEASE', name: 'Hipertensión', detail: 'Tomar presión en las mañanas', registeredBy: 'Carmen' },
    }),
    db.condition.create({
      data: { elderId: luis.id, type: 'DISEASE', name: 'Diabetes tipo 2', detail: 'Controlada · examen cada 3 meses', registeredBy: 'Carmen' },
    }),
  ]);

  await db.condition.createMany({
    data: [
      { elderId: luis.id, type: 'DISEASE', name: 'Artrosis de rodilla', detail: 'Evitar escaleras y cargar peso', registeredBy: 'Kevin' },
      { elderId: luis.id, type: 'ALLERGY', name: 'Penicilina', detail: 'Reacción grave — avisar siempre en urgencias', registeredBy: 'Carmen' },
      { elderId: luis.id, type: 'ALLERGY', name: 'Maní', detail: 'Hinchazón leve · evitar frutos secos', registeredBy: 'Kevin' },
    ],
  });

  const en38dias = new Date();
  en38dias.setDate(en38dias.getDate() + 38);
  const en6dias = new Date();
  en6dias.setDate(en6dias.getDate() + 6);

  await db.medication.createMany({
    data: [
      {
        elderId: luis.id,
        name: 'Losartán',
        dose: '50 mg',
        intervalHours: 12,
        pharmacy: 'Farmacia Ahumada',
        endDate: en38dias,
        favorite: true,
        conditionId: hipertension.id,
        instructions: 'Después del desayuno y la once, con agua',
        registeredBy: 'Carmen',
      },
      {
        elderId: luis.id,
        name: 'Metformina',
        dose: '850 mg',
        intervalHours: 8,
        pharmacy: 'Cruz Verde',
        endDate: en6dias,
        favorite: true,
        conditionId: diabetes.id,
        registeredBy: 'Carmen',
      },
      {
        elderId: luis.id,
        name: 'Paracetamol',
        dose: '500 mg',
        intervalHours: null,
        instructions: 'Solo si hay dolor · máximo 3 al día',
        favorite: false,
        registeredBy: 'Kevin',
      },
    ],
  });

  const contactoCarmen = await db.contact.create({
    data: { elderId: luis.id, name: 'Carmen Soto', role: 'Hija', phone: '+56 9 8765 4321', address: 'Ñuñoa, Santiago' },
  });
  await db.contact.create({
    data: { elderId: luis.id, name: 'Dr. Andrés Pino', role: 'Doctor de cabecera', phone: '+56 2 2345 6789', address: 'Clínica Santa María' },
  });
  await db.elder.update({ where: { id: luis.id }, data: { favoriteContactId: contactoCarmen.id } });

  await db.taste.createMany({
    data: [
      { elderId: luis.id, detail: 'El bolero — sobre todo Lucho Gatica', note: 'Ponerle música mientras almuerza', pleasure: true },
      { elderId: luis.id, detail: 'Té con dos de azúcar a las 17:00', pleasure: true },
      { elderId: luis.id, detail: 'La sopa fría y que le hablen fuerte', note: 'Oye bien — solo hablar claro y de frente', displeasure: true },
      { elderId: luis.id, detail: 'La sal en exceso', note: 'Por la presión — cocinar con poca sal', avoid: true },
      { elderId: luis.id, detail: 'Caminar a la plaza', activity: true, pleasure: true },
      { elderId: luis.id, detail: 'Dominó los domingos', activity: true },
    ],
  });

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  await db.dailyLog.createMany({
    data: [
      {
        elderId: luis.id,
        authorId: carmen.id,
        date: ayer,
        dayRating: 5,
        emotionRating: 4,
        digestionRating: 4,
        physicalActivity: true,
        note: 'Durmió toda la noche. Tomó todos sus remedios sin reclamar 😄',
      },
      {
        elderId: luis.id,
        authorId: kevin.id,
        dayRating: 4,
        emotionRating: 4,
        digestionRating: 3,
        physicalActivity: true,
        note: 'Caminamos a la plaza y almorzó completo. En la tarde estaba con sueño.',
      },
    ],
  });

  await db.shift.createMany({
    data: [
      { elderId: luis.id, userId: kevin.id, date: fechaISO(0) },
      { elderId: luis.id, userId: carmen.id, date: fechaISO(1) },
    ],
  });

  console.log('Seed listo: demo@tatacare.cl / tatacare123 (y carmen@tatacare.cl)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
