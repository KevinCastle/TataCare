import {
  Cake, CalendarDot, Drop, GenderMale, Heart, IdentificationCard,
} from '@phosphor-icons/react/dist/ssr';
import Card from '../../components/card';

const bloodTypeCompatibility = (bloodType: string): string => {
  const compatibility: { [blood: string]: string[] } = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['Todo tipo de sangre'],
  };

  return compatibility[bloodType].join(', ');
};

const page = () => (
  <>
    <header className="flex items-center">
      <IdentificationCard color="#006FEE" size={32} className="mr-2" />
      <p className="text-2xl font-medium mb-4">Ficha</p>
    </header>
    <article className="grid grid-cols-12 grid-rows-2">
      <section className="col-span-7 row-span-1">
        <Card
          avatar="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          title="Alberto"
        >
          <div className="grid grid-cols-2 grid-rows-3 gap-5">
            <div className="col-span-2 row-span-1">
              <p className="font-medium text-zinc-600">Sexo</p>
              <div className="flex items-center">
                <GenderMale size={20} color="#006FEE" />
                <p className="text-lg font-medium text-zinc-900 ms-1">Masculino</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <p className="font-medium text-zinc-600">Fecha de Nacimiento</p>
              <div className="flex items-center">
                <CalendarDot size={20} color="#006FEE" />
                <p className="text-lg font-medium text-zinc-900 ms-1">14 de Abril de 1952</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <p className="font-medium text-zinc-600">Edad</p>
              <div className="flex items-center">
                <Cake size={20} color="#006FEE" />
                <p className="text-lg font-medium text-zinc-900 ms-1">72 años</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <p className="font-medium text-zinc-600">Tipo de Sangre</p>
              <div className="flex items-center">
                <Drop size={20} color="#F31260" />
                <p className="text-lg font-medium text-zinc-900 ms-1">Sangre O+</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <p className="font-medium text-zinc-600">Puede recibir donación</p>
              <div className="flex items-center">
                <Heart size={20} color="#F31260" />
                <p className="text-lg font-medium text-zinc-900 ms-1">{bloodTypeCompatibility('O+')}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </article>
  </>
);

export default page;
