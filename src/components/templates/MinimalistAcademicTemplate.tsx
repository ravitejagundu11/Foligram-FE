import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, ExternalLink, Mail, Award, BookOpen, FileText, Video, Bell, BellOff } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/MinimalistAcademicTemplate.css'

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

const MinimalistAcademicTemplate = ({ 
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
    <div className="minimalist-academic-template">
      {/* Decorative Background */}
      <div className="academic-bg-pattern"></div>
      
      <div className="academic-container">
        {/* Header */}
        <motion.header
          className="academic-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-wrapper">
            {portfolio.profilePicture && (
              <div className="profile-image-wrapper">
                <img
                  src={portfolio.profilePicture}
                  alt={portfolio.name}
                  className="academic-profile-img"
                />
                <div className="profile-ring"></div>
              </div>
            )}
            <div className="header-content">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {portfolio.name}
              </motion.h1>
              <motion.p 
                className="academic-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {portfolio.headline}
              </motion.p>
              {portfolio.description && (
                <motion.p 
                  className="academic-bio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {portfolio.description}
                </motion.p>
              )}
              
              {/* Action Buttons */}
              <motion.div 
                className="header-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {onScheduleAppointment && (
                  <button className="academic-btn primary" onClick={onScheduleAppointment}>
                    <Video size={20} />
                    <span>Book Appointment</span>
                  </button>
                )}
                {onSubscribe && !isOwner && (
                  <button 
                    className={`academic-btn ${isSubscribed ? 'subscribed' : 'secondary'}`}
                    onClick={onSubscribe}
                    disabled={subscribing}
                  >
                    {isSubscribed ? <BellOff size={20} /> : <Bell size={20} />}
                    <span>{subscribing ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}</span>
                  </button>
                )}
              </motion.div>

              {/* Social Links */}
              {portfolio.socialLinks && (
                <motion.div 
                  className="academic-social"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {portfolio.socialLinks.github && (
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github size={20} />
                    </a>
                  )}
                  {portfolio.socialLinks.linkedin && (
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {portfolio.socialLinks.twitter && (
                    <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter size={20} />
                    </a>
                  )}
                  {portfolio.socialLinks.website && (
                    <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {portfolio.contactEmail && (
                    <a href={`mailto:${portfolio.contactEmail}`} aria-label="Email">
                      <Mail size={20} />
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* About Section */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">About</h2>
            <p className="academic-text">{portfolio.description}</p>
          </motion.section>
        )}

        {/* Education Section */}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <BookOpen size={28} />
              </div>
              <h2>{portfolio.sectionNames?.education || 'Education'}</h2>
            </div>
            <div className="academic-list">
              {portfolio.sectionContent.education.map((edu: any, index: number) => (
                <motion.div 
                  key={edu.id} 
                  className="academic-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-header">
                    <h3>{edu.schoolName}</h3>
                    <span className="academic-date">
                      {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="academic-subtitle">{edu.level} in {edu.course}</p>
                    {edu.gpa && (
                      <div className="academic-badge">
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Research / Projects */}
        {portfolio.sections.projects && projects.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <FileText size={28} />
              </div>
              <h2>Research & Publications</h2>
            </div>
            <div className="academic-list">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="academic-card clickable"
                  onClick={() => onProjectClick(project)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                >
                  <div className="card-header">
                    <h3>{project.title}</h3>
                  </div>
                  <div className="card-body">
                    <p className="academic-description">{project.description}</p>
                    {project.techStack.length > 0 && (
                      <div className="academic-tags">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="academic-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="academic-links">
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={16} />
                          <span>View Paper</span>
                        </a>
                      )}
                      {project.codeUrl && (
                        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Github size={16} />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <Award size={28} />
              </div>
              <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
            </div>
            <div className="academic-list">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div 
                  key={exp.id} 
                  className="academic-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-header">
                    <h3>{exp.role}</h3>
                    <span className="academic-date">
                      {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).getFullYear()}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="academic-subtitle">{exp.companyName}</p>
                    {exp.responsibilities && <p className="academic-description">{exp.responsibilities}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Publications */}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>
              <FileText size={24} />
              {portfolio.sectionNames?.publications || 'Publications'}
            </h2>
            <div className="academic-list">
              {portfolio.sectionContent.publications.map((pub: any) => (
                <div key={pub.id} className="academic-item">
                  <div className="academic-item-header">
                    <h3>{pub.title}</h3>
                    {pub.date && (
                      <span className="academic-date">
                        {new Date(pub.date).getFullYear()}
                      </span>
                    )}
                  </div>
                  <p className="academic-subtitle">{pub.organization}</p>
                  {pub.description && <p className="academic-description">{pub.description}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <h2>{portfolio.sectionNames?.skills || 'Skills & Expertise'}</h2>
            </div>
            <motion.div 
              className="academic-skills"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {skills.map((skill, index) => (
                <motion.span 
                  key={skill.id} 
                  className="academic-skill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Testimonials */}
        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section
            className="academic-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <h2>{portfolio.sectionNames?.testimonials || 'Recommendations'}</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id} 
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="quote-mark">"</div>
                  <p className="testimonial-quote">{testimonial.content}</p>
                  <div className="testimonial-author">
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
            className="academic-section contact-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">Contact</h2>
            <div className="contact-info">
              <a href={`mailto:${portfolio.contactEmail}`} className="contact-link">
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
              className="academic-section custom-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="section-heading">{sectionName}</h2>
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

export default MinimalistAcademicTemplate
