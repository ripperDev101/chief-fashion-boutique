import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Dresses',
    slug: 'dresses',
    image: '/IMG_2221.PNG',
  },
];

export const Categories = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Browse
          </p>
          <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
            Shop by Category
          </h2>
        </div>

        <div className="mt-12 grid justify-center gap-6 sm:grid-cols-1 lg:mt-16 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative mx-auto w-full max-w-[420px] overflow-hidden rounded-xl opacity-0 shadow-md animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="aspect-[3/4]">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover object-center transition-transform duration-slow group-hover:scale-105"
              />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end p-6 lg:p-8">
                <div>
                  <h3 className="font-display text-2xl font-medium text-primary-foreground lg:text-3xl">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-wider text-primary-foreground/80 transition-colors group-hover:text-gold">
                    Shop Now
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
