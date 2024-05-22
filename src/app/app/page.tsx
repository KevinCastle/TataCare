'use client';

import {
  Card, CardBody, CardFooter, Image,
} from '@nextui-org/react';
import React from 'react';

const list = [
  {
    title: 'Orange',
    img: '/images/pexels-nashua-volquez-young-452210-1729931.jpg',
    price: '78 años',
  },
  {
    title: 'Tangerine',
    img: '/images/fruit-2.jpeg',
    price: '$3.00',
  },
  {
    title: 'Raspberry',
    img: '/images/fruit-3.jpeg',
    price: '$10.00',
  },
  {
    title: 'Lemon',
    img: '/images/fruit-4.jpeg',
    price: '$5.30',
  },
  {
    title: 'Avocado',
    img: '/images/fruit-5.jpeg',
    price: '$15.70',
  },
];

const page = () => (
  <main className="bg-zinc-200 min-h-svh">
    <article className="grid sm:grid-rows-3 h-full py-4">
      <section className="row-span-1 flex items-center justify-center py-10">
        <h1 className="text-3xl text-center">Lista de abuelitos</h1>
      </section>
      <section className="row-span-2 container flex flex-col h-full px-6 xs:px-0">
        <div className="flex flex-wrap justify-center items-center gap-6">
          {list.map((item) => (
            <Card className="xs:flex-[0_0_45%] sm:flex-[0_0_33.3333%] w-full sm:w-[200px]" shadow="sm" key={crypto.randomUUID()} isPressable onPress={() => console.log('item pressed')}>
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.title}
                  className="w-full object-cover object-top h-[200px]"
                  src={item.img}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <p className="text-xl font-bold">{item.title}</p>
                <p className="text-default-500">{item.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </article>
  </main>
);

export default page;
