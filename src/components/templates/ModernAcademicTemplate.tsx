import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, BookOpen, Award, Code2, FileText, Calendar, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/ModernAcademicTemplate.css'

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

const ModernAcademicTemplate = ({
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
    <div className="modern-academic-template">
      <div className="modern-academic-container">
        {/* Hero Section with Gradient */}
        <motion.section 
          className="modern-academic-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-gradient-bg"></div>
          <div className="hero-content-wrapper">
            {portfolio.profilePicture && (
              <motion.div 
                className="hero-profile-image"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <img src={portfolio.profilePicture} alt={portfolio.name} />
              </motion.div>
            )}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {portfolio.name}
            </motion.h1>
            <motion.p 
              className="hero-headline"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {portfolio.headline}
            </motion.p>

            {/* Social Links */}
            {portfolio.socialLinks && (
              <motion.div 
                className="hero-social-links"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
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
                {portfolio.contactEmail && (
                  <a href={`mailto:${portfolio.contactEmail}`}>
                    <Mail size={20} />
                  </a>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            {!isOwner && onScheduleAppointment && onSubscribe && (
              <motion.div 
                className="hero-actions"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button className="action-btn primary" onClick={onScheduleAppointment}>
                  <Video size={18} />
                  Book Appointment
                </button>
                <button 
                  className={`action-btn secondary ${isSubscribed ? 'subscribed' : ''}`}
                  onClick={onSubscribe}
                  disabled={subscribing}
                >
                  {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                  {subscribing ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* About Section */}
        {portfolio.sections.about && portfolio.description && (
          <motion.section 
            className="modern-academic-section about-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>About</h2>
              <div className="section-divider"></div>
            </div>
            <p className="about-content">{portfolio.description}</p>
          </motion.section>
        )}

        {/* Education & Publications Grid */}
        <div className="two-column-grid">
          {/* Education Section */}
          {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
            <motion.section 
              className="modern-academic-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-header">
                <h2>
                  <BookOpen size={28} />
                  {portfolio.sectionNames?.education || 'Education'}
                </h2>
                <div className="section-divider"></div>
              </div>
              <div className="education-list">
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
                    <p className="education-date">
                      {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.gpa && <p className="education-gpa">GPA: {edu.gpa}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Publications Section */}
          {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
            <motion.section 
              className="modern-academic-section"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-header">
                <h2>
                  <FileText size={28} />
                  {portfolio.sectionNames?.publications || 'Publications'}
                </h2>
                <div className="section-divider"></div>
              </div>
              <div className="publications-list">
                {portfolio.sectionContent.publications.map((pub: any, index: number) => (
                  <motion.div 
                    key={pub.id} 
                    className="publication-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3>{pub.title}</h3>
                    <p className="publication-org">{pub.organization}</p>
                    {pub.date && (
                      <p className="publication-date">
                        <Calendar size={14} />
                        {new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                    {pub.description && <p className="publication-desc">{pub.description}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Research Projects Section */}
        {portfolio.sections.projects && projects.length > 0 && (
          <motion.section 
            className="modern-academic-section projects-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>
                <Award size={28} />
                {portfolio.sectionNames?.projects || 'Research Projects'}
              </h2>
              <div className="section-divider"></div>
            </div>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className="project-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onProjectClick(project)}
                >
                  {project.images && project.images.length > 0 && (
                    <div className="project-image">
                      <img src={project.images[0]} alt={project.title} />
                    </div>
                  )}
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="project-tech">
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section 
            className="modern-academic-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>
                <Code2 size={28} />
                {portfolio.sectionNames?.experience || 'Experience'}
              </h2>
              <div className="section-divider"></div>
            </div>
            <div className="experience-timeline">
              {portfolio.sectionContent.experience.map((exp: any, index: number) => (
                <motion.div 
                  key={exp.id} 
                  className="experience-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="experience-timeline-dot"></div>
                  <div className="experience-content">
                    <h3>{exp.role}</h3>
                    <h4>{exp.company} • {exp.type}</h4>
                    <p className="experience-date">
                      <Calendar size={14} />
                      {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                    </p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="experience-achievements">
                        {exp.achievements.map((achievement: string, i: number) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {portfolio.sections.skills && skills.length > 0 && (
          <motion.section 
            className="modern-academic-section skills-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>{portfolio.sectionNames?.skills || 'Skills & Expertise'}</h2>
              <div className="section-divider"></div>
            </div>
            <div className="skills-categories">
              {['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'].map(category => {
                const categorySkills = skills.filter(s => s.category === category)
                if (categorySkills.length === 0) return null
                return (
                  <div key={category} className="skill-category">
                    <h3>{category}</h3>
                    <div className="skill-tags">
                      {categorySkills.map(skill => (
                        <span key={skill.id} className="skill-tag">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Testimonials Section */}
        {portfolio.sections.testimonials && testimonials.length > 0 && (
          <motion.section 
            className="modern-academic-section testimonials-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>{portfolio.sectionNames?.testimonials || 'Recommendations'}</h2>
              <div className="section-divider"></div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id} 
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
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

        {/* Contact Section */}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section 
            className="modern-academic-section contact-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <h2>Get In Touch</h2>
              <div className="section-divider"></div>
            </div>
            <div className="contact-wrapper">
              <a href={`mailto:${portfolio.contactEmail}`} className="contact-email-btn">
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
              className="modern-academic-section custom-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="section-header">
                <h2>{sectionName}</h2>
                <div className="section-divider"></div>
              </div>
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

export default ModernAcademicTemplate
