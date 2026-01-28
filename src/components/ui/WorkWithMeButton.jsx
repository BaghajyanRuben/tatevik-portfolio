import ActionButton from './ActionButton';

const WorkWithMeButton = ({ href, tone = 'dark', className = '', ...props }) => {
  if (!href) {
    return null;
  }

  return (
    <ActionButton
      href={href}
      label="Work with me"
      tone={tone}
      target="_blank"
      rel="noopener noreferrer"
      className={`sm:px-8 sm:py-4 sm:text-[20px] ${className}`}
      {...props}
    />
  );
};

export default WorkWithMeButton;
