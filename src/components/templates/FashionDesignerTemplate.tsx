import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Sparkles, Scissors, TrendingUp, Calendar, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/FashionDesignerTemplate.css'

interface TemplateProps {
  portfolio: Portfolio
  projects: Project[]
  skills: Skill[]
  testimonials: Testimonial[]
  onProjectClick: (project: Project) => void
  onScheduleAppointment?: () => void
  onSubscribe?: () => void
  isSubscribed?: boolean
  subscribing?: boolean
  currentUser?: any
}

const FashionDesignerTemplate = ({
  portfolio,
  projects,
  skills,
  testimonials,
  onProjectClick,
  onScheduleAppointment,
  onSubscribe,
  isSubscribed,
  subscribing,
  currentUser
}: TemplateProps) => {
  const isOwner = currentUser?.id === portfolio.userId

  return (
    <div className="fashion-template">
      {/* Elegant Hero Banner */}
      <motion.section 
        className="fashion-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="hero-elegant-bg"></div>
        <div className="hero-content-center">
          {portfolio.profilePicture && (
            <motion.div 
              className="fashion-profile-frame"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <img src={portfolio.profilePicture} alt={portfolio.name} />
            </motion.div>
          )}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {portfolio.name}
          </motion.h1>
          <motion.p 
            className="fashion-tagline"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {portfolio.headline}
          </motion.p>

          {portfolio.socialLinks && (
            <motion.div 
              className="social-icons-elegant"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {portfolio.socialLinks.github && <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github size={22} /></a>}
              {portfolio.socialLinks.linkedin && <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={22} /></a>}
              {portfolio.socialLinks.twitter && <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={22} /></a>}
              {portfolio.contactEmail && <a href={`mailto:${portfolio.contactEmail}`}><Mail size={22} /></a>}
            </motion.div>
          )}

          {!isOwner && onScheduleAppointment && onSubscribe && (
            <motion.div 
              className="fashion-cta-buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button className="fashion-btn primary" onClick={onScheduleAppointment}>
                <Video size={18} />
                Book Session
              </button>
              <button 
                className={`fashion-btn secondary ${isSubscribed ? 'subscribed' : ''}`}
                onClick={onSubscribe}
                disabled={subscribing}
              >
                {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                {subscribing ? 'Loading...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      <div className="fashion-content">
        {/* About */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section 
            className="fashion-about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="fashion-section-title">
              <Sparkles size={28} />
              <h2>About Me</h2>
            </div>
            <p className="about-elegant">{portfolio.description}</p>
          </motion.section>
        )}

        {/* Projects/Collections Grid */}
        {portfolio.sections.projects && projects.length > 0 && (
          <motion.section 
            className="fashion-collections"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="fashion-section-title">
              <Scissors size={28} />
              <h2>{portfolio.sectionNames?.projects || 'Collections'}</h2>
            </div>
            <div className="collections-grid">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="collection-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onProjectClick(project)}
                >
                  {project.images && project.images.length > 0 && (
                    <div className="collection-image">
                      <img src={project.images[0]} alt={project.title} />
                      <div className="collection-overlay">
                        <h3>{project.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="collection-info">
                    <p>{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section 
            className="fashion-experience"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="fashion-section-title">
              <TrendingUp size={28} />
              <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
            </div>
            <div className="experience-elegant-list">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div 
                  key={exp.id}
                  className="experience-elegant-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{exp.role}</h3>
                  <h4>{exp.company} • {exp.type}</h4>
                  <p className="exp-dates">
                    <Calendar size={14} />
                    {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                  </p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul>
                      {exp.achievements.map((ach: string, i: number) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education, Publications, Skills, Testimonials - Similar pattern */}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section className="fashion-education" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="fashion-section-title"><h2>{portfolio.sectionNames?.education || 'Education'}</h2></div>
            <div className="education-elegant-grid">
              {portfolio.sectionContent.education.map((edu: any) => (
                <div key={edu.id} className="education-elegant-item">
                  <h3>{edu.schoolName}</h3>
                  <p>{edu.level} - {edu.course}</p>
                  <p className="edu-year">{edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
          <motion.section className="fashion-publications" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="fashion-section-title"><h2>{portfolio.sectionNames?.publications || 'Publications'}</h2></div>
            <div className="publications-elegant">
              {portfolio.sectionContent.publications.map((pub: any) => (
                <div key={pub.id} className="publication-elegant-item">
                  <h3>{pub.title}</h3>
                  <p className="pub-org">{pub.organization}</p>
                  {pub.date && <p className="pub-date">{new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section className="fashion-skills" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="fashion-section-title"><h2>{portfolio.sectionNames?.skills || 'Skills'}</h2></div>
            <div className="skills-elegant-tags">
              {skills.map(skill => (
                <span key={skill.id} className="skill-elegant-tag">{skill.name}</span>
              ))}
            </div>
          </motion.section>
        )}

        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section className="fashion-testimonials" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="fashion-section-title"><h2>{portfolio.sectionNames?.testimonials || 'Testimonials'}</h2></div>
            <div className="testimonials-elegant-grid">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-elegant-card">
                  <p className="testimonial-elegant-quote">"{testimonial.content}"</p>
                  <div className="testimonial-elegant-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section className="fashion-contact" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="fashion-section-title"><h2>Get In Touch</h2></div>
            <a href={`mailto:${portfolio.contactEmail}`} className="contact-elegant-button">
              <Mail size={20} />
              {portfolio.contactEmail}
            </a>
          </motion.section>
        )}

        {/* Custom Sections */}
        {portfolio.sectionOrder?.map((sectionKey, index) => {
          if (!portfolio.sections[sectionKey]) return null
          if (!sectionKey.startsWith('custom_')) return null
          
          const sectionName = portfolio.sectionNames?.[sectionKey] || 'Custom Section'
          const sectionContent = portfolio.sectionContent?.[sectionKey] || []
          
          return (
            <motion.section 
              key={sectionKey}
              className="fashion-section custom-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="fashion-section-title"><h2>{sectionName}</h2></div>
              <div className="custom-section-grid">
                {sectionContent.map((item: any, itemIndex: number) => (
                  <motion.div 
                    key={itemIndex}
                    className="custom-item-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIndex * 0.05 }}
                  >
                    {item.title && <h3>{item.title}</h3>}
                    {item.subtitle && <p className="custom-subtitle">{item.subtitle}</p>}
                    {item.description && <p className="custom-description">{item.description}</p>}
                    {item.date && <p className="custom-date">{item.date}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="custom-link">
                        <ExternalLink size={16} />
                        Learn More
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>
    </div>
  )
}

export default FashionDesignerTemplate
