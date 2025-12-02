import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ExternalLink, Star, Calendar, Mail, Code2, Briefcase, Video, Bell, BellOff, FileText } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/ModernDarkTemplate.css'

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

const ModernDarkTemplate = ({ 
  portfolio, 
  projects, 
  skills, 
  testimonials, 
  onProjectClick,
  onScheduleAppointment,
  onSubscribe,
  isSubscribed = false,
  subscribing = false,
  currentUser
}: TemplateProps) => {
  const isOwner = currentUser && (
    portfolio.userId === currentUser.username || 
    portfolio.userId === currentUser.email ||
    portfolio.name === currentUser.username
  )
  return (
    <div className="modern-dark-template">
      {/* Animated Background */}
      <div className="dark-background">
        <div className="dark-gradient-orb orb-1"></div>
        <div className="dark-gradient-orb orb-2"></div>
        <div className="dark-gradient-orb orb-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="dark-navbar">
        <div className="navbar-content">
          <motion.div 
            className="navbar-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {portfolio.name}
          </motion.div>
          <motion.div 
            className="navbar-links"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {portfolio.socialLinks?.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
            )}
            {portfolio.socialLinks?.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            )}
            {portfolio.socialLinks?.twitter && (
              <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
            )}
          </motion.div>
        </div>
      </nav>

      <div className="dark-container">
        {/* Hero Section */}
        <section className="dark-hero">
          <div className="hero-content-centered">
            {portfolio.profilePicture && (
              <motion.div 
                className="hero-image-wrapper-centered"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="image-glow-centered"></div>
                <img
                  src={portfolio.profilePicture}
                  alt={portfolio.name}
                  className="hero-image-centered"
                />
              </motion.div>
            )}
            
            <motion.div 
              className="hero-text-centered"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="glitch-text">{portfolio.name}</h1>
              <p className="hero-headline">{portfolio.headline}</p>
              {portfolio.description && (
                <p className="hero-description">{portfolio.description}</p>
              )}
              <div className="hero-cta">
                {onScheduleAppointment && (
                  <button className="cta-button primary" onClick={onScheduleAppointment}>
                    <Video size={20} />
                    Book Appointment
                  </button>
                )}
                {onSubscribe && !isOwner && (
                  <button 
                    className={`cta-button ${isSubscribed ? 'subscribed' : 'secondary'}`}
                    onClick={onSubscribe}
                    disabled={subscribing}
                  >
                    {isSubscribed ? <BellOff size={20} /> : <Bell size={20} />}
                    {subscribing ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
                  </button>
                )}
                {portfolio.contactEmail && (
                  <a href={`mailto:${portfolio.contactEmail}`} className="cta-button secondary">
                    <Mail size={20} />
                    Get In Touch
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section 
            className="dark-section about-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">About Me</h2>
            <p className="about-text">{portfolio.description}</p>
          </motion.section>
        )}

        {/* Skills Section */}
        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section 
            className="dark-section skills-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <Code2 size={32} />
              Technical Expertise
            </h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.id} 
                  className="skill-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <div className="skill-progress-bar">
                    <motion.div 
                      className="skill-progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency * 20}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Publications Section */}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
          <motion.section 
            className="dark-section publications-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <FileText size={32} />
              {portfolio.sectionNames?.publications || 'Publications'}
            </h2>
            <div className="publications-grid">
              {portfolio.sectionContent.publications.map((pub: any, index: number) => (
                <motion.div 
                  key={pub.id} 
                  className="publication-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3>{pub.title}</h3>
                  <p className="publication-org">{pub.organization}</p>
                  {pub.date && (
                    <p className="publication-date">
                      <Calendar size={16} />
                      {new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  {pub.description && <p className="publication-desc">{pub.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {portfolio.sections.projects && projects.length > 0 && (
          <motion.section 
            className="dark-section projects-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <Briefcase size={32} />
              Featured Projects
            </h2>
            <div className="projects-masonry">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className="project-card-dark"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onProjectClick(project)}
                  whileHover={{ y: -8 }}
                >
                  <div className="project-image-wrapper">
                    {project.images[0] && (
                      <img src={project.images[0]} alt={project.title} />
                    )}
                    <div className="project-overlay">
                      <ExternalLink size={24} />
                    </div>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-stack">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span key={i} className="stack-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Timeline */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && (
          <motion.section 
            className="dark-section experience-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <Briefcase size={32} />
              {portfolio.sectionNames?.experience || 'Experience'}
            </h2>
            <div className="experience-timeline">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div 
                  key={exp.id} 
                  className="timeline-item-dark"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="timeline-marker"></div>
                  <div className="timeline-content-dark">
                    <div className="timeline-date-badge">
                      <Calendar size={16} />
                      {exp.startDate && new Date(exp.startDate).getFullYear()}
                      {' - '}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).getFullYear()}
                    </div>
                    <h3>{exp.role}</h3>
                    <h4>{exp.companyName}</h4>
                    {exp.responsibilities && <p>{exp.responsibilities}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section 
            className="dark-section education-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <Code2 size={32} />
              {portfolio.sectionNames?.education || 'Education'}
            </h2>
            <div className="timeline-container">
              {portfolio.sectionContent.education.map((edu: any, index: number) => (
                <motion.div 
                  key={edu.id} 
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="timeline-content">
                    <h3>{edu.schoolName}</h3>
                    <h4>{edu.level} - {edu.course}</h4>
                    <p className="timeline-date">
                      <Calendar size={16} />
                      {edu.startDate && new Date(edu.startDate).getFullYear()}
                      {' - '}
                      {edu.endDate && new Date(edu.endDate).getFullYear()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Testimonials */}
        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section 
            className="dark-section testimonials-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              <Star size={32} />
              Client Testimonials
            </h2>
            <div className="testimonials-carousel">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id} 
                  className="testimonial-card-dark"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{testimonial.content}"</p>
                  <div className="testimonial-author-dark">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.company}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {/* Contact Section */}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section 
            className="dark-section contact-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <a href={`mailto:${portfolio.contactEmail}`} className="contact-email">
                <Mail size={24} />
                {portfolio.contactEmail}
              </a>
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
              className="dark-section custom-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h2 className="section-title">{sectionName}</h2>
              <div className="custom-section-content">
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

export default ModernDarkTemplate
