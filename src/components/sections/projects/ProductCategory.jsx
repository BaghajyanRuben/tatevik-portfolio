import { ActionButton } from '../../ui';

const ProductCategory = ({
  titleDarkLines = [],
  titleLight,
  mode = 'left',
  href = '/projects',
  imageSrc,
  imageAlt = '',
}) => {
  const isImageLeft = mode === 'right';

  return (
    <section
      className={`flex flex-col gap-8 md:gap-12 md:flex-row md:items-stretch ${isImageLeft ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="hidden h-full w-full flex-col gap-6 md:flex md:w-1/2 md:aspect-square md:justify-between">
        <div className="text-[64px] leading-tight">
          <span className="block text-primary">
            {titleDarkLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          <span className="block max-w-[26ch] text-muted">
            {titleLight}
          </span>
        </div>
        <ActionButton
          href={href}
          label="Explore"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
      <div className="relative w-full md:w-1/2">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={600}
          loading="lazy"
          className="aspect-square h-full w-full rounded-[30px] object-cover md:rounded-[50px]"
        />
        <div className="absolute inset-0 rounded-[30px] bg-black/10 md:hidden" />
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:hidden">
          <div className="text-[32px] leading-tight">
            <span className="block text-white">
              {titleDarkLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
            <span className="block max-w-[22ch] text-white/70">
              {titleLight}
            </span>
          </div>
          <ActionButton
            href={href}
            label="Explore"
            iconClassName="h-4 w-4"
            className="px-4 py-2 text-sm font-normal leading-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
