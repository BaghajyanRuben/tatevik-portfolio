import { ArrowUpRight } from 'lucide-react';
import Button from './Button';

const toneClasses = {
  dark: 'bg-primary text-secondary hover:bg-primary/90',
  light: 'bg-[#EAEAEA] text-black hover:bg-white',
};

const ActionButton = ({
  label,
  href,
  onClick,
  tone = 'dark',
  className = '',
  showIcon = true,
  iconClassName = 'h-5 w-5',
  ...props
}) => {
  return (
    <Button
      href={href}
      onClick={onClick}
      className={`w-fit gap-2 px-6 py-3 text-base font-normal leading-6 transition-smooth ${toneClasses[tone]} ${className}`}
      {...props}
    >
      <span>{label}</span>
      {showIcon ? <ArrowUpRight className={iconClassName} aria-hidden="true" /> : null}
    </Button>
  );
};

export default ActionButton;
