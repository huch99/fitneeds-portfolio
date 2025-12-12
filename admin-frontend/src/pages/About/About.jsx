import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.css';

function About() {
  return (
    <>
      <Helmet>
        <title>About - FITNEEDS</title>
        <meta name="description" content="Learn about our mission and team" />
      </Helmet>
      {/* Header*/}
        <header className="section-padding">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-header">
                <div className="page-header">
                  <h1 className="page-title">Our mission is to make building websites easier for everyone.</h1>
                  <p className="page-subtitle">Start Bootstrap was built on the idea that quality, functional website templates and themes should be available to everyone. Use our open source, free products, or support us by purchasing one of our premium products or services.</p>
                  <a className="button-primary button-large" href="#scroll-target">Read our story</a>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* About section one*/}
        <section className="section-padding section-light" id="scroll-target">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-image">
                <img className="section-image" src="https://dummyimage.com/600x400/343a40/6c757d" alt="..." />
              </div>
              <div className="section-col section-col-text">
                <h2 className="section-title">Our founding</h2>
                <p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto est, ut esse a labore aliquam beatae expedita. Blanditiis impedit numquam libero molestiae et fugit cupiditate, quibusdam expedita, maiores eaque quisquam.</p>
              </div>
            </div>
          </div>
        </section>
        {/* About section two*/}
        <section className="section-padding">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-image section-col-image-reverse">
                <img className="section-image" src="https://dummyimage.com/600x400/343a40/6c757d" alt="..." />
              </div>
              <div className="section-col section-col-text">
                <h2 className="section-title">Growth &amp; beyond</h2>
                <p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto est, ut esse a labore aliquam beatae expedita. Blanditiis impedit numquam libero molestiae et fugit cupiditate, quibusdam expedita, maiores eaque quisquam.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Team members section*/}
        <section className="section-padding section-light">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Our team</h2>
              <p className="section-subtitle">Dedicated to quality and your success</p>
            </div>
            <div className="team-grid">
              <div className="team-item">
                <div className="team-content">
                  <img className="team-avatar" src="https://dummyimage.com/150x150/ced4da/6c757d" alt="..." />
                  <h5 className="team-name">Ibbie Eckart</h5>
                  <div className="team-role">Founder &amp; CEO</div>
                </div>
              </div>
              <div className="team-item">
                <div className="team-content">
                  <img className="team-avatar" src="https://dummyimage.com/150x150/ced4da/6c757d" alt="..." />
                  <h5 className="team-name">Arden Vasek</h5>
                  <div className="team-role">CFO</div>
                </div>
              </div>
              <div className="team-item">
                <div className="team-content">
                  <img className="team-avatar" src="https://dummyimage.com/150x150/ced4da/6c757d" alt="..." />
                  <h5 className="team-name">Toribio Nerthus</h5>
                  <div className="team-role">Operations Manager</div>
                </div>
              </div>
              <div className="team-item">
                <div className="team-content">
                  <img className="team-avatar" src="https://dummyimage.com/150x150/ced4da/6c757d" alt="..." />
                  <h5 className="team-name">Malvina Cilla</h5>
                  <div className="team-role">CTO</div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default About;


