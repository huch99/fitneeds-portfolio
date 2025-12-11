import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Helmet>
        <title>Contact - FITNEEDS</title>
        <meta name="description" content="Get in touch with us" />
      </Helmet>
      {/* Page content*/}
        <section className="section-padding">
          <div className="section-container">
            {/* Contact form*/}
            <div className="contact-form-wrapper">
              <div className="contact-header">
                <div className="contact-icon">
                  <i className="bi bi-envelope"></i>
                </div>
                <h1 className="contact-title">Get in touch</h1>
                <p className="contact-subtitle">We'd love to hear from you</p>
              </div>
              <div className="section-row">
                <div className="section-col section-col-form">
                  <form id="contactForm" onSubmit={handleSubmit}>
                    {/* Name input*/}
                    <div className="form-group">
                      <input 
                        className="form-input" 
                        id="name" 
                        name="name"
                        type="text" 
                        placeholder="Enter your name..." 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                      <label htmlFor="name">Full name</label>
                    </div>
                    {/* Email address input*/}
                    <div className="form-group">
                      <input 
                        className="form-input" 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="name@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                      <label htmlFor="email">Email address</label>
                    </div>
                    {/* Phone number input*/}
                    <div className="form-group">
                      <input 
                        className="form-input" 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        placeholder="(123) 456-7890" 
                        value={formData.phone}
                        onChange={handleChange}
                        required 
                      />
                      <label htmlFor="phone">Phone number</label>
                    </div>
                    {/* Message input*/}
                    <div className="form-group">
                      <textarea 
                        className="form-input form-textarea" 
                        id="message" 
                        name="message"
                        placeholder="Enter your message here..." 
                        style={{height: '10rem'}} 
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                    {/* Submit Button*/}
                    <div className="form-submit">
                      <button className="button-primary button-large" id="submitButton" type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Contact cards*/}
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <h5 className="contact-card-title">Chat with us</h5>
                <p className="contact-card-text">Chat live with one of our support specialists.</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="contact-card-title">Ask the community</h5>
                <p className="contact-card-text">Explore our community forums and communicate with other users.</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-question-circle"></i>
                </div>
                <h5 className="contact-card-title">Support center</h5>
                <p className="contact-card-text">Browse FAQ's and support articles to find solutions.</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <h5 className="contact-card-title">Call us</h5>
                <p className="contact-card-text">Call us during normal business hours at (555) 892-9403.</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default Contact;


