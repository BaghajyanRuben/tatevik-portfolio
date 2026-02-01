import { motion } from 'framer-motion';

import cleveVenturesLogo from '../../../assets/logos/ic_cleve_entures.png';
import customCompilerLogo from '../../../assets/logos/ic_custom_compiler.png';
import verifiedVisitorsLogo from '../../../assets/logos/ic_verified_visitors.png';
import zfLogo from '../../../assets/logos/ic_zf_group.png';

const clients = [
  {
    id: 'zf',
    name: 'ZF Passau GmbH',
    logo: zfLogo,
    alt: 'ZF logo',
  },
  {
    id: 'verify-visitors',
    name: 'GleveVentures Ltd.',
    logo: verifiedVisitorsLogo,
    alt: 'Verify Visitors logo',
  },
  {
    id: 'custom-compiler',
    name: 'Synopsys Inc.',
    logo: customCompilerLogo,
    alt: 'Custom Compiler logo',
  },
  {
    id: 'x',
    name: 'GleveVentures Ltd.',
    logo: cleveVenturesLogo,
    alt: 'X logo',
  },
];

const ClientsSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col"
    >
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {clients.map((client) => (
          <li
            key={client.id}
            className="flex flex-col items-center gap-3 text-center"
          >
            <img
              src={client.logo}
              alt={client.alt}
              width={140}
              height={48}
              className="h-10 w-auto max-w-[140px] object-contain sm:h-12"
              loading="lazy"
            />
            <span className="text-sm text-muted">{client.name}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default ClientsSection;
