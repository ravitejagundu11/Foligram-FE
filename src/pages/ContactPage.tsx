import '../styles/ContactPage.css'

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>
      
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            type="text"
            id="name"
            className="contact-input"
            placeholder="Your name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            className="contact-input"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            className="contact-input"
            placeholder="How can we help?"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message *
          </label>
          <textarea
            id="message"
            rows={6}
            className="contact-textarea"
            placeholder="Your message..."
          />
        </div>
        
        <button
          type="submit"
          className="contact-button"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

export default ContactPage
