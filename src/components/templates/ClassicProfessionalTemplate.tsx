import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ExternalLink, Star, Calendar, Mail, Video, Bell, BellOff } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/ClassicProfessionalTemplate.css'

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

const ClassicProfessionalTemplate = ({ 
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
    <div className="classic-professional-template">
      {/* Header with gradient background */}
      <header className="classic-header">
        <div className="classic-header-content">
          {portfolio.profilePicture && (
            <motion.img
              src={portfolio.profilePicture}
              alt={portfolio.name}
              className="classic-profile-picture"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
            />
          )}
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {portfolio.name}
          </motion.h1>
          <motion.p 
            className="classic-headline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {portfolio.headline}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div
            className="classic-action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {onScheduleAppointment && (
              <button className="classic-btn primary" onClick={onScheduleAppointment}>
                <Video size={18} />
                Book Appointment
              </button>
            )}
            {onSubscribe && !isOwner && (
              <button 
                className={`classic-btn ${isSubscribed ? 'subscribed' : 'secondary'}`}
                onClick={onSubscribe}
                disabled={subscribing}
              >
                {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                {subscribing ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
              </button>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="classic-social-links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {portfolio.socialLinks?.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Github size={22} />
              </a>
            )}
            {portfolio.socialLinks?.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={22} />
              </a>
            )}
            {portfolio.socialLinks?.twitter && (
              <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter size={22} />
              </a>
            )}
            {portfolio.socialLinks?.website && (
              <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={22} />
              </a>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="classic-container">
        {/* Left Sidebar */}
        <aside className="classic-sidebar">
          {/* About */}
          {portfolio.sections.about && portfolio.description && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>About</h2>
              <p>{portfolio.description}</p>
            </motion.section>
          )}

          {/* Contact */}
          {portfolio.sections.contact && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2>Contact</h2>
              <div className="classic-contact-info">
                {portfolio.contactEmail && (
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>{portfolio.contactEmail}</span>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Skills */}
          {portfolio.sections.skills && skills.length > 0 && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2>Skills</h2>
              <div className="classic-skills-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="classic-skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar">
                      <motion.div 
                        className="skill-progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency * 20}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </aside>

        {/* Main Content */}
        <main className="classic-main">
          {/* Education */}
          {portfolio.sections.education && portfolio.sectionContent?.education && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>{portfolio.sectionNames?.education || 'Education'}</h2>
              <div className="classic-timeline">
                {portfolio.sectionContent.education.map((edu: any, index: number) => (
                  <motion.div 
                    key={edu.id} 
                    className="classic-timeline-item"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="timeline-dot" />
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

          {/* Experience */}
          {portfolio.sections.experience && portfolio.sectionContent?.experience && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
              <div className="classic-timeline">
                {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                  <motion.div 
                    key={exp.id} 
                    className="classic-timeline-item"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h3>{exp.companyName}</h3>
                      <h4>{exp.role}</h4>
                      <p className="timeline-date">
                        <Calendar size={16} />
                        {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        {' - '}
                        {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                      {exp.responsibilities && <p className="experience-desc">{exp.responsibilities}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Publications */}
          {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h2>{portfolio.sectionNames?.publications || 'Publications'}</h2>
              <div className="classic-timeline">
                {portfolio.sectionContent.publications.map((pub: any, index: number) => (
                  <motion.div 
                    key={pub.id} 
                    className="classic-timeline-item"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h3>{pub.title}</h3>
                      <h4>{pub.organization}</h4>
                      {pub.date && (
                        <p className="timeline-date">
                          <Calendar size={16} />
                          {new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </p>
                      )}
                      {pub.description && <p className="experience-desc">{pub.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Projects */}
          {portfolio.sections.projects && projects.length > 0 && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2>{portfolio.sectionNames?.projects || 'Projects'}</h2>
              <div className="classic-projects-grid">
                {projects.map((project, index) => (
                  <motion.div 
                    key={project.id} 
                    className="classic-project-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onProjectClick(project)}
                    whileHover={{ y: -5 }}
                  >
                    {project.images[0] && (
                      <img src={project.images[0]} alt={project.title} className="project-thumbnail" />
                    )}
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-tech">
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Testimonials */}
          {portfolio.sections.testimonials && testimonials.length > 0 && (
            <motion.section 
              className="classic-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2>{portfolio.sectionNames?.testimonials || 'Testimonials'}</h2>
              <div className="classic-testimonials-grid">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={testimonial.id} 
                    className="classic-testimonial-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
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

          {/* Custom Sections */}
          {portfolio.sectionOrder?.map((sectionKey, index) => {
            if (!portfolio.sections[sectionKey]) return null
            if (!sectionKey.startsWith('custom_')) return null
            
            const sectionName = portfolio.sectionNames?.[sectionKey] || 'Custom Section'
            const sectionContent = portfolio.sectionContent?.[sectionKey] || []
            
            return (
              <motion.section 
                key={sectionKey}
                className="classic-section custom-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
        </main>
      </div>
    </div>
  )
}

export default ClassicProfessionalTemplate
