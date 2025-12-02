import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Home, Palette, Layers, Calendar, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/InteriorDesignerTemplate.css'

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

const InteriorDesignerTemplate = ({portfolio,projects,skills,testimonials,onProjectClick,onScheduleAppointment,onSubscribe,isSubscribed,subscribing,currentUser}: TemplateProps) => {
  const isOwner = currentUser?.id === portfolio.userId
  return (
    <div className="interior-template">
      <motion.section className="interior-hero" initial={{opacity:0}} animate={{opacity:1}}>
        <div className="interior-hero-overlay"></div>
        <div className="interior-hero-content">
          {portfolio.profilePicture && <motion.img src={portfolio.profilePicture} alt={portfolio.name} className="interior-hero-img" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.2}}/>}
          <motion.h1 initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3}}>{portfolio.name}</motion.h1>
          <motion.p className="interior-subtitle" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.4}}>{portfolio.headline}</motion.p>
          {!isOwner && onScheduleAppointment && onSubscribe && (
            <motion.div className="interior-hero-actions" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5}}>
              <button className="interior-btn primary" onClick={onScheduleAppointment}><Video size={18}/>Consultation</button>
              <button className={`interior-btn secondary ${isSubscribed?'subscribed':''}`} onClick={onSubscribe} disabled={subscribing}>{isSubscribed?<BellOff size={18}/>:<Bell size={18}/>}{subscribing?'Loading...':isSubscribed?'Unsubscribe':'Subscribe'}</button>
            </motion.div>
          )}
        </div>
      </motion.section>
      <div className="interior-container">
        {portfolio.sections.about && portfolio.description && (
          <motion.section className="interior-section" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="interior-section-header"><Home size={30}/><h2>About</h2></div>
            <p className="interior-about-text">{portfolio.description}</p>
          </motion.section>
        )}
        {portfolio.sections.projects && projects.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><Palette size={30}/><h2>{portfolio.sectionNames?.projects||'Projects'}</h2></div>
            <div className="interior-projects-grid">
              {projects.map((project,index)=>(
                <motion.div key={project.id} className="interior-project-card" initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:index*0.1}} onClick={()=>onProjectClick(project)}>
                  {project.images&&project.images.length>0&&<div className="interior-project-img"><img src={project.images[0]} alt={project.title}/></div>}
                  <div className="interior-project-content"><h3>{project.title}</h3><p>{project.description}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><Layers size={30}/><h2>{portfolio.sectionNames?.experience||'Experience'}</h2></div>
            <div className="interior-exp-list">
              {portfolio.sectionContent.experience.map((exp:any,index:number)=>(
                <motion.div key={exp.id} className="interior-exp-card" initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:index*0.1}}>
                  <h3>{exp.role}</h3><h4>{exp.company} • {exp.type}</h4><p className="interior-exp-date"><Calendar size={14}/>{exp.startDate&&new Date(exp.startDate).getFullYear()}-{exp.endDate?new Date(exp.endDate).getFullYear():'Present'}</p>
                  {exp.achievements&&exp.achievements.length>0&&<ul>{exp.achievements.map((ach:string,i:number)=><li key={i}>{ach}</li>)}</ul>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><h2>{portfolio.sectionNames?.education||'Education'}</h2></div>
            <div className="interior-edu-list">{portfolio.sectionContent.education.map((edu:any)=><div key={edu.id} className="interior-edu-item"><h3>{edu.schoolName}</h3><p>{edu.level} - {edu.course}</p><p className="interior-edu-year">{edu.startDate&&new Date(edu.startDate).getFullYear()}-{edu.endDate&&new Date(edu.endDate).getFullYear()}</p></div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><h2>{portfolio.sectionNames?.publications||'Publications'}</h2></div>
            <div className="interior-pub-list">{portfolio.sectionContent.publications.map((pub:any)=><div key={pub.id} className="interior-pub-item"><h3>{pub.title}</h3><p className="interior-pub-org">{pub.organization}</p>{pub.date&&<p className="interior-pub-date">{new Date(pub.date).toLocaleDateString('en-US',{year:'numeric',month:'short'})}</p>}</div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.skills && skills.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><h2>{portfolio.sectionNames?.skills||'Skills'}</h2></div>
            <div className="interior-skills-tags">{skills.map(skill=><span key={skill.id} className="interior-skill-tag">{skill.name}</span>)}</div>
          </motion.section>
        )}
        {portfolio.sections.testimonials && testimonials.length>0 && (
          <motion.section className="interior-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><h2>{portfolio.sectionNames?.testimonials||'Testimonials'}</h2></div>
            <div className="interior-testimonials-grid">{testimonials.map(testimonial=><div key={testimonial.id} className="interior-testimonial-card"><p className="interior-testimonial-quote">"{testimonial.content}"</p><div className="interior-testimonial-author"><strong>{testimonial.name}</strong><span>{testimonial.company}</span></div></div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section className="interior-section interior-contact" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="interior-section-header"><h2>Contact</h2></div>
            <a href={`mailto:${portfolio.contactEmail}`} className="interior-contact-btn"><Mail size={20}/>{portfolio.contactEmail}</a>
            {portfolio.socialLinks&&<div className="interior-social-links">{portfolio.socialLinks.github&&<a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github size={22}/></a>}{portfolio.socialLinks.linkedin&&<a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={22}/></a>}{portfolio.socialLinks.twitter&&<a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={22}/></a>}</div>}
          </motion.section>
        )}
        {portfolio.sectionOrder?.map((sectionKey,index)=>{if(!portfolio.sections[sectionKey])return null;if(!sectionKey.startsWith('custom_'))return null;const sectionName=portfolio.sectionNames?.[sectionKey]||'Custom Section';const sectionContent=portfolio.sectionContent?.[sectionKey]||[];return(<motion.section key={sectionKey} className="interior-section custom-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:index*0.1}}><div className="interior-section-header"><h2>{sectionName}</h2></div><div className="custom-section-grid">{sectionContent.map((item:any,itemIndex:number)=><motion.div key={itemIndex} className="custom-item-card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:itemIndex*0.05}}>{item.title&&<h3>{item.title}</h3>}{item.subtitle&&<p className="custom-subtitle">{item.subtitle}</p>}{item.description&&<p className="custom-description">{item.description}</p>}{item.date&&<p className="custom-date">{item.date}</p>}{item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="custom-link"><ExternalLink size={16}/>Learn More</a>}</motion.div>)}</div></motion.section>)})}
      </div>
    </div>
  )
}
export default InteriorDesignerTemplate
