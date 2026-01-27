import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { AboutHero, SocialLinks } from '../components/about';
import SEO from '../components/SEO';
import aboutData from '../data/about.json';
import { useScrollAnimation, staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const About = () => {
  const { ref: skillsRef, isInView: skillsInView } = useScrollAnimation();
  const { ref: expRef, isInView: expInView } = useScrollAnimation();
  const { ref: eduRef, isInView: eduInView } = useScrollAnimation();
  const { ref: certRef, isInView: certInView } = useScrollAnimation();
  const photoUrl = `${import.meta.env.BASE_URL}${aboutData.photo.replace(/^\/+/, '')}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": aboutData.name,
      "jobTitle": aboutData.title,
      "description": aboutData.bio,
      "image": photoUrl,
      "url": "https://tatevikpetrosyan.com/about",
      "sameAs": [
        aboutData.social.behance,
        aboutData.social.upwork,
        aboutData.social.linkedin
      ].filter(Boolean),
      "knowsAbout": aboutData.skills,
      "email": aboutData.social.email,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Yerevan",
        "addressCountry": "Armenia"
      }
    }
  };

  return (
    <PageTransition>
      <SEO
        title="About"
        description={`${aboutData.bio} ${aboutData.bioExtended}`}
        url="/about"
        image={photoUrl}
        keywords={`${aboutData.name}, UI/UX Designer, ${aboutData.skills.join(', ')}, Designer Bio, Design Experience, Yerevan, Armenia`}
        structuredData={structuredData}
      />
      <main className="pb-20">
        <AboutHero
          name={aboutData.name}
          title={aboutData.title}
          photo={photoUrl}
          bio={aboutData.bio}
          bioExtended={aboutData.bioExtended}
          location={aboutData.location}
        />

        {/* Skills Section */}
        <section className="py-16 bg-primary/[0.02]">
          <div className="container">
            <motion.div
              ref={skillsRef}
              initial="hidden"
              animate={skillsInView ? 'visible' : 'hidden'}
              variants={staggerContainer}
            >
              <motion.h2 variants={staggerItem} className="heading-md mb-8">
                Skills & Tools
              </motion.h2>
              <div className="flex flex-wrap gap-3">
                {aboutData.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={staggerItem}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary border border-primary/10 hover:border-accent hover:text-accent transition-smooth"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16">
          <div className="container">
            <motion.div
              ref={expRef}
              initial="hidden"
              animate={expInView ? 'visible' : 'hidden'}
              variants={staggerContainer}
            >
              <motion.h2 variants={staggerItem} className="heading-md mb-8">
                Experience
              </motion.h2>
              <div className="space-y-4">
                {aboutData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-xl border border-primary/10 hover:border-primary/20 transition-smooth"
                  >
                    <div>
                      <h3 className="font-semibold text-primary">{exp.title}</h3>
                      <p className="text-muted">{exp.company}</p>
                    </div>
                    <p className="text-sm text-muted mt-2 md:mt-0">{exp.period}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        <section className="py-16 bg-primary/[0.02]">
          <div className="container">
            <motion.div
              ref={eduRef}
              initial="hidden"
              animate={eduInView ? 'visible' : 'hidden'}
              variants={staggerContainer}
            >
              <motion.h2 variants={staggerItem} className="heading-md mb-8">
                Education
              </motion.h2>
              <div className="space-y-4">
                {aboutData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-xl border border-primary/10 hover:border-primary/20 transition-smooth"
                  >
                    <div>
                      <h3 className="font-semibold text-primary">{edu.school}</h3>
                      <p className="text-muted">{edu.degree}</p>
                      <p className="text-sm text-muted/70">{edu.location}</p>
                    </div>
                    <p className="text-sm text-muted mt-2 md:mt-0">{edu.period}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certifications & Languages */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Certifications */}
              <motion.div
                ref={certRef}
                initial="hidden"
                animate={certInView ? 'visible' : 'hidden'}
                variants={staggerContainer}
              >
                <motion.h2 variants={staggerItem} className="heading-md mb-6">
                  Certifications
                </motion.h2>
                <div className="space-y-3">
                  {aboutData.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-primary/10"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-primary">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Languages */}
              <motion.div
                initial="hidden"
                animate={certInView ? 'visible' : 'hidden'}
                variants={staggerContainer}
              >
                <motion.h2 variants={staggerItem} className="heading-md mb-6">
                  Languages
                </motion.h2>
                <div className="space-y-3">
                  {aboutData.languages.map((lang, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary/10"
                    >
                      <span className="font-medium text-primary">{lang.language}</span>
                      <span className="text-sm text-muted">{lang.level}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-primary/[0.02]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="heading-md mb-4">Let's Work Together</h2>
              <p className="body-md mb-8">
                I'm always open to discussing new projects, creative ideas, or
                opportunities to collaborate. Let's create something amazing.
              </p>
              <SocialLinks social={aboutData.social} />
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default About;
