import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './BlogHome.css';

function BlogHome() {
  return (
    <>
      <Helmet>
        <title>Blog - FITNEEDS</title>
        <meta name="description" content="Read our latest blog posts" />
      </Helmet>
      {/* Page Content*/}
        <section className="section-padding">
          <div className="section-container">
            <h1 className="blog-page-title">Company Blog</h1>
            <div className="blog-featured-card">
              <div className="blog-featured-content">
                <div className="blog-featured-text">
                  <div className="blog-badge">News</div>
                  <h2 className="blog-featured-title">Article heading goes here</h2>
                  <p className="blog-featured-excerpt">Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique delectus ab doloremque, qui doloribus ea officiis...</p>
                  <Link className="blog-featured-link" to="/blog/post">
                    Read more
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="blog-featured-image" style={{backgroundImage: "url('https://dummyimage.com/700x350/343a40/6c757d')"}}></div>
            </div>
          </div>
        </section>
        <section className="section-padding section-light">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-news">
                <h2 className="news-section-title">News</h2>
                <div className="news-item">
                  <div className="news-date">May 12, 2023</div>
                  <Link className="news-link" to="/blog/post">
                    <h3>Start Bootstrap releases Bootstrap 5 updates for templates and themes</h3>
                  </Link>
                </div>
                <div className="news-item">
                  <div className="news-date">May 5, 2023</div>
                  <Link className="news-link" to="/blog/post">
                    <h3>Bootstrap 5 has officially landed</h3>
                  </Link>
                </div>
                <div className="news-item">
                  <div className="news-date">Apr 21, 2023</div>
                  <Link className="news-link" to="/blog/post">
                    <h3>This is another news article headline, but this one is a little bit longer</h3>
                  </Link>
                </div>
                <div className="news-more">
                  <Link className="news-more-link" to="/blog">
                    More news
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Blog preview section*/}
        <section className="section-padding">
          <div className="section-container">
            <h2 className="blog-section-title">Featured Stories</h2>
            <div className="blog-grid">
              <div className="blog-card">
                <img className="blog-image" src="https://dummyimage.com/600x350/ced4da/6c757d" alt="..." />
                <div className="blog-body">
                  <div className="blog-badge">News</div>
                  <Link className="blog-link" to="/blog/post">
                    <h5 className="blog-title">Blog post title</h5>
                  </Link>
                  <p className="blog-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <div className="blog-footer">
                  <div className="blog-author">
                    <img className="author-avatar-small" src="https://dummyimage.com/40x40/ced4da/6c757d" alt="..." />
                    <div className="author-info-small">
                      <div className="author-name-small">Kelly Rowan</div>
                      <div className="author-date">March 12, 2023 &middot; 6 min read</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-card">
                <img className="blog-image" src="https://dummyimage.com/600x350/adb5bd/495057" alt="..." />
                <div className="blog-body">
                  <div className="blog-badge">Media</div>
                  <Link className="blog-link" to="/blog/post">
                    <h5 className="blog-title">Another blog post title</h5>
                  </Link>
                  <p className="blog-text">This text is a bit longer to illustrate the adaptive height of each card. Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <div className="blog-footer">
                  <div className="blog-author">
                    <img className="author-avatar-small" src="https://dummyimage.com/40x40/ced4da/6c757d" alt="..." />
                    <div className="author-info-small">
                      <div className="author-name-small">Josiah Barclay</div>
                      <div className="author-date">March 23, 2023 &middot; 4 min read</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-card">
                <img className="blog-image" src="https://dummyimage.com/600x350/6c757d/343a40" alt="..." />
                <div className="blog-body">
                  <div className="blog-badge">News</div>
                  <Link className="blog-link" to="/blog/post">
                    <h5 className="blog-title">The last blog post title is a little bit longer than the others</h5>
                  </Link>
                  <p className="blog-text">Some more quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <div className="blog-footer">
                  <div className="blog-author">
                    <img className="author-avatar-small" src="https://dummyimage.com/40x40/ced4da/6c757d" alt="..." />
                    <div className="author-info-small">
                      <div className="author-name-small">Evelyn Martinez</div>
                      <div className="author-date">April 2, 2023 &middot; 10 min read</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-more">
              <Link className="blog-more-link" to="/blog">
                More stories
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}

export default BlogHome;


