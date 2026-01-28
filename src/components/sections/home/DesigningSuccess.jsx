import { useNavigate } from 'react-router-dom';
import { ActionButton } from '../../ui';


const DesigningSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
      <p className="text-[20px] font-normal text-primary sm:text-[24px]">
        Designing Success
      </p>

      <p className="max-w-3xl text-3xl leading-tight sm:text-4xl md:text-[40px]">
        <span className="text-primary">
          See how I&apos;ve turned ideas
          <br />
          into reality. Dive into the
          <br />
          stories of
        </span>
        <span className="text-muted">
          {' '}
          successful
          <br />
          product designs that make
          <br />
          a difference.
        </span>
      </p>

      <ActionButton
        onClick={() => navigate('/projects')}
        label="Explore"
        tone="light"
        className="sm:px-8 sm:py-4 sm:text-[20px]"
      />
    </div>
  );
};

export default DesigningSuccess;
