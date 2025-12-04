import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Ruler, Building2, Briefcase, Award, Calendar, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/ArchitectTemplate.css'

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

const ArchitectTemplate = ({
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
    <div className="architect-template">
      {/* Full-width Hero with Overlay */}
      <motion.section 
        className="architect-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1>{portfolio.name}</h1>
            <p className="hero-subtitle">{portfolio.headline}</p>
            {portfolio.description && (
              <p className="hero-description">{portfolio.description}</p>
            )}

            {!isOwner && onScheduleAppointment && onSubscribe && (
              <div className="hero-actions">
                <button className="action-btn primary" onClick={onScheduleAppointment}>
                  <Video size={18} />
                  Book Consultation
                </button>
                <button 
                  className={`action-btn secondary ${isSubscribed ? 'subscribed' : ''}`}
                  onClick={onSubscribe}
                  disabled={subscribing}
                >
                  {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                  {subscribing ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      <div className="architect-container">
        {/* Projects Grid - Featured Work */}
        {portfolio.sections.projects && projects.length > 0 && (
          <motion.section 
            className="architect-section projects-showcase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <Building2 size={32} />
              <h2>{portfolio.sectionNames?.projects || 'Featured Projects'}</h2>
            </div>
            <div className="projects-masonry">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="project-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onProjectClick(project)}
                >
                  {project.images && project.images.length > 0 && (
                    <div className="project-image-wrapper">
                      <img src={project.images[0]} alt={project.title} />
                      <div className="project-overlay">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* About & Philosophy */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section 
            className="architect-section about-philosophy"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <Ruler size={32} />
              <h2>Design Philosophy</h2>
            </div>
            <p className="philosophy-text">{portfolio.description}</p>
          </motion.section>
        )}

        {/* Experience */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section 
            className="architect-section experience-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <Briefcase size={32} />
              <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
            </div>
            <div className="experience-grid">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div 
                  key={exp.id}
                  className="experience-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{exp.role}</h3>
                  <h4>{exp.company}</h4>
                  <p className="exp-date">
                    <Calendar size={14} />
                    {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                  </p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul>
                      {exp.achievements.map((achievement: string, i: number) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section 
            className="architect-section education-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <Award size={32} />
              <h2>{portfolio.sectionNames?.education || 'Education & Certifications'}</h2>
            </div>
            <div className="education-list">
              {portfolio.sectionContent.education.map((edu: any, index: number) => (
                <motion.div 
                  key={edu.id}
                  className="education-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{edu.schoolName}</h3>
                  <p className="edu-degree">{edu.level} - {edu.course}</p>
                  <p className="edu-date">{edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section 
            className="architect-section skills-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <h2>{portfolio.sectionNames?.skills || 'Expertise'}</h2>
            </div>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <motion.span 
                  key={skill.id}
                  className="skill-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Publications */}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
          <motion.section 
            className="architect-section publications-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <h2>{portfolio.sectionNames?.publications || 'Publications'}</h2>
            </div>
            <div className="publications-list">
              {portfolio.sectionContent.publications.map((pub: any, index: number) => (
                <motion.div 
                  key={pub.id}
                  className="publication-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{pub.title}</h3>
                  <p className="pub-org">{pub.organization}</p>
                  {pub.date && (
                    <p className="pub-date">{new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Testimonials */}
        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section 
            className="architect-section testimonials-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <h2>{portfolio.sectionNames?.testimonials || 'Client Testimonials'}</h2>
            </div>
            <div className="testimonials-slider">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="testimonial-card"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="testimonial-quote">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.company}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact */}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section 
            className="architect-section contact-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="section-title-wrapper">
              <h2>Let's Collaborate</h2>
            </div>
            <div className="contact-info">
              <a href={`mailto:${portfolio.contactEmail}`} className="contact-email">
                <Mail size={24} />
                {portfolio.contactEmail}
              </a>
              {portfolio.socialLinks && (
                <div className="social-links">
                  {portfolio.socialLinks.github && (
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github size={24} />
                    </a>
                  )}
                  {portfolio.socialLinks.linkedin && (
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={24} />
                    </a>
                  )}
                  {portfolio.socialLinks.twitter && (
                    <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter size={24} />
                    </a>
                  )}
                </div>
              )}
            </div>
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
              className="architect-section custom-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="architect-section-title">{sectionName}</h2>
              <div className="custom-section-grid">
                {sectionContent.map((item: any, itemIndex: number) => (
                  <motion.div 
                    key={itemIndex}
                    className="custom-item-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
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

export default ArchitectTemplate
