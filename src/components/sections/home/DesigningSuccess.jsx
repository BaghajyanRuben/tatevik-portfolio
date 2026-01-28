import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../ui';


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

      <Button
        onClick={() => navigate('/projects')}
        className="w-fit gap-2 px-6 py-3 text-base font-normal leading-6 transition-smooth sm:px-8 sm:py-4 sm:text-[20px] bg-[#EAEAEA] text-black hover:bg-white"
      >
        <span>Explore</span>
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default DesigningSuccess;
