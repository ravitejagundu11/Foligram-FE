import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, BookOpen, Users, Award, GraduationCap, Calendar, Video, Bell, BellOff, ExternalLink } from 'lucide-react'
import type { Portfolio, Project, Skill, Testimonial } from '../../types/portfolio'
import '../../styles/templates/TeacherTemplate.css'

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

const TeacherTemplate = ({portfolio,projects,skills,testimonials,onProjectClick,onScheduleAppointment,onSubscribe,isSubscribed,subscribing,currentUser}: TemplateProps) => {
  const isOwner = currentUser?.id === portfolio.userId
  return (
    <div className="teacher-template">
      <motion.section className="teacher-hero" initial={{opacity:0}} animate={{opacity:1}}>
        <div className="teacher-hero-bg"></div>
        <div className="teacher-hero-content">
          {portfolio.profilePicture && <motion.div className="teacher-profile-circle" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.2}}><img src={portfolio.profilePicture} alt={portfolio.name}/></motion.div>}
          <motion.h1 initial={{y:25,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3}}>{portfolio.name}</motion.h1>
          <motion.p className="teacher-headline" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.4}}>{portfolio.headline}</motion.p>
          {portfolio.socialLinks && (
            <motion.div className="teacher-social" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5}}>
              {portfolio.socialLinks.github && <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github size={20}/></a>}
              {portfolio.socialLinks.linkedin && <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20}/></a>}
              {portfolio.socialLinks.twitter && <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={20}/></a>}
              {portfolio.contactEmail && <a href={`mailto:${portfolio.contactEmail}`}><Mail size={20}/></a>}
            </motion.div>
          )}
          {!isOwner && onScheduleAppointment && onSubscribe && (
            <motion.div className="teacher-actions" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.6}}>
              <button className="teacher-btn primary" onClick={onScheduleAppointment}><Video size={18}/>Schedule Class</button>
              <button className={`teacher-btn secondary ${isSubscribed?'subscribed':''}`} onClick={onSubscribe} disabled={subscribing}>{isSubscribed?<BellOff size={18}/>:<Bell size={18}/>}{subscribing?'Wait...':isSubscribed?'Unsubscribe':'Subscribe'}</button>
            </motion.div>
          )}
        </div>
      </motion.section>
      <div className="teacher-container">
        {portfolio.sections.about && portfolio.description && (
          <motion.section className="teacher-section" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="teacher-section-title"><BookOpen size={28}/><h2>About Me</h2></div>
            <p className="teacher-about-text">{portfolio.description}</p>
          </motion.section>
        )}
        {portfolio.sections.experience && portfolio.sectionContent?.experience && portfolio.sectionContent.experience.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><Users size={28}/><h2>{portfolio.sectionNames?.experience||'Teaching Experience'}</h2></div>
            <div className="teacher-exp-timeline">
              {portfolio.sectionContent.experience.map((exp:any,index:number)=>(
                <motion.div key={exp.id} className="teacher-exp-card" initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:index*0.1}}>
                  <div className="teacher-exp-dot"></div>
                  <h3>{exp.role}</h3><h4>{exp.company}</h4><p className="teacher-exp-date"><Calendar size={14}/>{exp.startDate&&new Date(exp.startDate).getFullYear()}-{exp.endDate?new Date(exp.endDate).getFullYear():'Present'}</p>
                  {exp.achievements&&exp.achievements.length>0&&<ul>{exp.achievements.map((ach:string,i:number)=><li key={i}>{ach}</li>)}</ul>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {portfolio.sections.education && portfolio.sectionContent?.education && portfolio.sectionContent.education.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><GraduationCap size={28}/><h2>{portfolio.sectionNames?.education||'Education'}</h2></div>
            <div className="teacher-edu-grid">{portfolio.sectionContent.education.map((edu:any)=><div key={edu.id} className="teacher-edu-card"><h3>{edu.schoolName}</h3><p className="teacher-edu-degree">{edu.level} - {edu.course}</p><p className="teacher-edu-year">{edu.startDate&&new Date(edu.startDate).getFullYear()}-{edu.endDate&&new Date(edu.endDate).getFullYear()}</p></div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.projects && projects.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><Award size={28}/><h2>{portfolio.sectionNames?.projects||'Courses & Projects'}</h2></div>
            <div className="teacher-projects-grid">
              {projects.map((project,index)=>(
                <motion.div key={project.id} className="teacher-project-card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*0.1}} onClick={()=>onProjectClick(project)}>
                  {project.images&&project.images.length>0&&<div className="teacher-project-img"><img src={project.images[0]} alt={project.title}/></div>}
                  <div className="teacher-project-info"><h3>{project.title}</h3><p>{project.description}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {portfolio.sections.publications && portfolio.sectionContent?.publications && portfolio.sectionContent.publications.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><h2>{portfolio.sectionNames?.publications||'Publications'}</h2></div>
            <div className="teacher-pub-list">{portfolio.sectionContent.publications.map((pub:any)=><div key={pub.id} className="teacher-pub-item"><h3>{pub.title}</h3><p className="teacher-pub-org">{pub.organization}</p>{pub.date&&<p className="teacher-pub-date">{new Date(pub.date).toLocaleDateString('en-US',{year:'numeric',month:'short'})}</p>}</div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.skills && skills.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><h2>{portfolio.sectionNames?.skills||'Skills & Expertise'}</h2></div>
            <div className="teacher-skills-list">{skills.map(skill=><span key={skill.id} className="teacher-skill-badge">{skill.name}</span>)}</div>
          </motion.section>
        )}
        {portfolio.sections.testimonials && testimonials.length>0 && (
          <motion.section className="teacher-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><h2>{portfolio.sectionNames?.testimonials||'Student Testimonials'}</h2></div>
            <div className="teacher-testimonials-grid">{testimonials.map(testimonial=><div key={testimonial.id} className="teacher-testimonial-card"><p className="teacher-testimonial-quote">"{testimonial.content}"</p><div className="teacher-testimonial-author"><strong>{testimonial.name}</strong><span>{testimonial.company}</span></div></div>)}</div>
          </motion.section>
        )}
        {portfolio.sections.contact && portfolio.contactEmail && (
          <motion.section className="teacher-section teacher-contact" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
            <div className="teacher-section-title"><h2>Contact Me</h2></div>
            <a href={`mailto:${portfolio.contactEmail}`} className="teacher-contact-btn"><Mail size={20}/>{portfolio.contactEmail}</a>
          </motion.section>
        )}
        {portfolio.sectionOrder?.map((sectionKey,index)=>{if(!portfolio.sections[sectionKey])return null;if(!sectionKey.startsWith('custom_'))return null;const sectionName=portfolio.sectionNames?.[sectionKey]||'Custom Section';const sectionContent=portfolio.sectionContent?.[sectionKey]||[];return(<motion.section key={sectionKey} className="teacher-section custom-section" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:index*0.1}}><div className="teacher-section-title"><h2>{sectionName}</h2></div><div className="custom-section-grid">{sectionContent.map((item:any,itemIndex:number)=><motion.div key={itemIndex} className="custom-item-card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:itemIndex*0.05}}>{item.title&&<h3>{item.title}</h3>}{item.subtitle&&<p className="custom-subtitle">{item.subtitle}</p>}{item.description&&<p className="custom-description">{item.description}</p>}{item.date&&<p className="custom-date">{item.date}</p>}{item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="custom-link"><ExternalLink size={16}/>Learn More</a>}</motion.div>)}</div></motion.section>)})}
      </div>
    </div>
  )
}
export default TeacherTemplate
