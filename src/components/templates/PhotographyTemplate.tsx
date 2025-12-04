import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Camera, Image as ImageIcon, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/PhotographyTemplate.css'

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

const PhotographyTemplate = ({ 
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
    <div className="photography-template">
      {/* Full-Screen Hero */}
      <section className="photo-hero">
        <div className="photo-hero-overlay"></div>
        <div className="photo-hero-content">
          {portfolio.profilePicture && (
            <motion.img
              src={portfolio.profilePicture}
              alt={portfolio.name}
              className="photo-profile"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {portfolio.name}
          </motion.h1>
          <motion.p
            className="photo-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Camera size={20} />
            {portfolio.headline}
          </motion.p>

          <motion.div
            className="photo-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {onScheduleAppointment && (
              <button className="photo-btn primary" onClick={onScheduleAppointment}>
                <Video size={18} />
                Book Appointment
              </button>
            )}
            {onSubscribe && !isOwner && (
              <button 
                className={`photo-btn ${isSubscribed ? 'subscribed' : 'secondary'}`}
                onClick={onSubscribe}
                disabled={subscribing}
              >
                {isSubscribed ? <BellOff size={18} /> : <Bell size={18} />}
                {subscribing ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
              </button>
            )}
          </motion.div>

          {portfolio.socialLinks && (
            <motion.div
              className="photo-social"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery / Projects Masonry */}
      {portfolio.sections.projects && projects.length > 0 && (
        <section className="photo-gallery">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <ImageIcon size={28} />
            Portfolio
          </motion.h2>
          <div className="photo-masonry">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="photo-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onProjectClick(project)}
              >
                {project.images[0] && (
                  <img src={project.images[0]} alt={project.title} />
                )}
                <div className="photo-overlay">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length > 0 && (
        <motion.section
          className="photo-publications"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>{portfolio.sectionNames?.publications || 'Publications'}</h2>
          <div className="photo-publications-list">
            {portfolio.sectionContent.publications.map((pub: any) => (
              <div key={pub.id} className="photo-publication-item">
                <h3>{pub.title}</h3>
                <p className="pub-org">{pub.organization}</p>
                {pub.date && (
                  <span className="pub-date">
                    {new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
                {pub.description && <p className="pub-desc">{pub.description}</p>}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* About */}
      {portfolio.sections.about && portfolio.description && (
        <motion.section
          className="photo-about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>About</h2>
          <p>{portfolio.description}</p>
        </motion.section>
      )}

      {/* Skills */}
      {portfolio.sections.skills && skills.length > 0 && (
        <motion.section
          className="photo-skills"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>{portfolio.sectionNames?.skills || 'Skills'}</h2>
          <div className="photo-skills-list">
            {skills.map((skill) => (
              <span key={skill.id}>{skill.name}</span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience & Education */}
      <div className="photo-info-grid">
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length > 0 && (
          <motion.section
            className="photo-info-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.experience || 'Experience'}</h2>
            {portfolio.sectionContent.experience.map((exp: any) => (
              <div key={exp.id} className="photo-info-item">
                <h3>{exp.role}</h3>
                <p>{exp.companyName}</p>
                <span>{exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).getFullYear()}</span>
              </div>
            ))}
          </motion.section>
        )}

        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length > 0 && (
          <motion.section
            className="photo-info-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>{portfolio.sectionNames?.education || 'Education'}</h2>
            {portfolio.sectionContent.education.map((edu: any) => (
              <div key={edu.id} className="photo-info-item">
                <h3>{edu.schoolName}</h3>
                <p>{edu.level} - {edu.course}</p>
                <span>{edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}</span>
              </div>
            ))}
          </motion.section>
        )}
      </div>

      {/* Testimonials */}
      {portfolio.sections.testimonials && testimonials.length > 0 && (
        <motion.section
          className="photo-testimonials"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>{portfolio.sectionNames?.testimonials || 'Testimonials'}</h2>
          <div className="photo-testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="photo-testimonial">
                <p>"{testimonial.content}"</p>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.company}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Contact */}
      {portfolio.sections.contact && portfolio.contactEmail && (
        <motion.section
          className="photo-contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Get In Touch</h2>
          <a href={`mailto:${portfolio.contactEmail}`}>
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
            className="photo-section custom-section"
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
  )
}

export default PhotographyTemplate
