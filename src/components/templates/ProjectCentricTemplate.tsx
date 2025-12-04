import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ExternalLink, Star, Calendar, Mail, Briefcase, Video, Bell, BellOff, FileText } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/ProjectCentricTemplate.css'

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

const ProjectCentricTemplate = ({ 
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
  // Check if user owns portfolio
  const isOwner = currentUser && (
    portfolio.userId === currentUser.username || 
    portfolio.userId === currentUser.email ||
    portfolio.name === currentUser.username
  )

  return (
    <div className="project-centric-template">
      {/* Hero with projects showcase */}
      <section className="project-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content-wrapper">
          {portfolio.profilePicture && (
            <motion.img
              src={portfolio.profilePicture}
              alt={portfolio.name}
              className="project-profile-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {portfolio.name}
          </motion.h1>
          <motion.p
            className="hero-headline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {portfolio.headline}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {onScheduleAppointment && (
              <button className="action-btn primary" onClick={onScheduleAppointment}>
                <Video size={18} />
                Book Appointment
              </button>
            )}
            {onSubscribe && !isOwner && (
              <button 
                className={`action-btn ${isSubscribed ? 'subscribed' : 'secondary'}`}
                onClick={onSubscribe}
                disabled={subscribing}
              >
                {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                {subscribing ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
              </button>
            )}
          </motion.div>

          {/* Social Links */}
          {portfolio.socialLinks && (
            <motion.div
              className="hero-social"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter size={20} />
                </a>
              )}
              {portfolio.socialLinks.website && (
                <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={20} />
                </a>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <div className="project-container">
        {/* Featured Projects - Large Grid */}
        {portfolio.sections.projects && projects.length > 0 && (
          <section className="featured-projects-section">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Featured Projects
            </motion.h2>
            <div className="projects-masonry-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`project-masonry-card ${project.featured ? 'featured' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onProjectClick(project)}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {project.images[0] && (
                    <div className="project-image-container">
                      <img src={project.images[0]} alt={project.title} />
                      {project.featured && (
                        <div className="featured-badge">
                          <Star size={16} fill="currentColor" />
                          Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="project-details">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-badges">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span key={i} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={16} />
                          Demo
                        </a>
                      )}
                      {project.codeUrl && (
                        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Github size={16} />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section
            className="about-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>About</h2>
            <p>{portfolio.description}</p>
          </motion.section>
        )}

        {/* Skills Section */}
        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section
            className="skills-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.skills || 'Skills'}</h2>
            <div className="skills-cloud">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill.id}
                  className="skill-bubble"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill.name}
                  <span className="skill-level">
                    {[...Array(skill.proficiency)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section
            className="experience-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
            <div className="timeline-vertical">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div
                  key={exp.id}
                  className="timeline-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="timeline-icon">
                    <Briefcase size={20} />
                  </div>
                  <div className="timeline-info">
                    <h3>{exp.role}</h3>
                    <h4>{exp.companyName}</h4>
                    <p className="timeline-date">
                      <Calendar size={14} />
                      {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).getFullYear()}
                    </p>
                    {exp.responsibilities && <p className="exp-desc">{exp.responsibilities}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section
            className="education-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.education || 'Education'}</h2>
            <div className="education-cards">
              {portfolio.sectionContent.education.map((edu: any, index: number) => (
                <motion.div
                  key={edu.id}
                  className="education-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{edu.schoolName}</h3>
                  <h4>{edu.level} - {edu.course}</h4>
                  <p>{edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Testimonials */}
        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section
            className="testimonials-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.testimonials || 'Testimonials'}</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="testimonial-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.company}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Publications */}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
          <motion.section
            className="publications-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.publications || 'Publications'}</h2>
            <div className="timeline-vertical">
              {portfolio.sectionContent.publications.map((pub: any, index: number) => (
                <motion.div
                  key={pub.id}
                  className="timeline-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="timeline-icon">
                    <FileText size={20} />
                  </div>
                  <div className="timeline-info">
                    <h3>{pub.title}</h3>
                    <h4>{pub.organization}</h4>
                    {pub.date && (
                      <p className="timeline-date">
                        <Calendar size={14} />
                        {new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                    {pub.description && <p className="exp-desc">{pub.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact */}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section
            className="contact-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Get In Touch</h2>
            <div className="contact-info">
              <a href={`mailto:${portfolio.contactEmail}`}>
                <Mail size={20} />
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
              className="custom-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2>{sectionName}</h2>
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

export default ProjectCentricTemplate
