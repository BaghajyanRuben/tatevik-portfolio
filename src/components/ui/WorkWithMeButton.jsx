import { ArrowUpRight } from 'lucide-react';
import Button from './Button';

const toneClasses = {
  dark: 'bg-primary text-secondary hover:bg-primary/90',
  light: 'bg-[#EAEAEA] text-black hover:bg-white',
};

const WorkWithMeButton = ({ href, tone = 'dark', className = '', ...props }) => {
  if (!href) {
    return null;
  }

  return (
    <Button
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-fit gap-2 px-6 py-3 text-base font-normal leading-6 transition-smooth sm:px-8 sm:py-4 sm:text-[20px] ${toneClasses[tone]} ${className}`}
      {...props}
    >
      <span>Work with me</span>
      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
};

export default WorkWithMeButton;
