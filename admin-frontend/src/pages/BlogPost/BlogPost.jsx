import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './BlogPost.css';

function BlogPost() {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission here
    console.log('Comment submitted:', comment);
    setComment('');
  };

  return (
    <>
      <Helmet>
        <title>Blog Post - FITNEEDS</title>
        <meta name="description" content="Read our blog post" />
      </Helmet>
      {/* Header*/}
        <header className="section-padding">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-header">
                <div className="page-header">
                  <h1 className="page-title">Welcome to Blog Post!</h1>
                  <p className="page-subtitle">January 1, 2023 · News, Business</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Post content*/}
        <section className="section-padding section-light">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-text">
                <article>
                  {/* Post categories*/}
                  <div className="post-categories">
                    <a className="post-badge" href="#!">Web Design</a>
                    <a className="post-badge" href="#!">Freebies</a>
                  </div>
                  {/* Preview image figure*/}
                  <figure className="post-image">
                    <img className="post-image-img" src="https://dummyimage.com/900x400/ced4da/6c757d.jpg" alt="..." />
                  </figure>
                  {/* Post content*/}
                  <section className="post-content">
                    <p className="post-paragraph">Science is an enterprise that should be cherished as an activity of the free human mind. Because it transforms who we are, how we live, and it gives us an understanding of our place in the universe.</p>
                    <p className="post-paragraph">The universe is large and old, and the ingredients for life as we know it are everywhere, so there's no reason to think that Earth would be unique in that regard. Whether of not the life became intelligent is a different question, and we'll see if we find that.</p>
                    <p className="post-paragraph">If you get asteroids about a kilometer in size, those are large enough and carry enough energy into our system to disrupt transportation, communication, the food chains, and that can be a really bad day on Earth.</p>
                    <h2 className="post-subtitle">I have odd cosmic thoughts every day</h2>
                    <p className="post-paragraph">For me, the most fascinating interface is Twitter. I have odd cosmic thoughts every day and I realized I could hold them to myself or share them with people who might be interested.</p>
                    <p className="post-paragraph">Venus has a runaway greenhouse effect. I kind of want to know what happened there because we're twirling knobs here on Earth without knowing the consequences of it. Mars once had running water. It's bone dry today. Something bad happened there as well.</p>
                  </section>
                </article>
              </div>
            </div>
          </div>
        </section>
        {/* Comments section*/}
        <section className="section-padding">
          <div className="section-container">
            <div className="section-row">
              <div className="section-col section-col-text">
                <div className="comments-card">
                  {/* Comment form*/}
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea 
                      className="comment-input" 
                      rows="3" 
                      placeholder="Join the discussion and leave a comment!"
                      value={comment}
                      onChange={handleCommentChange}
                    ></textarea>
                    <button type="submit" className="button-primary">Submit Comment</button>
                  </form>
                  {/* Comment with nested comments*/}
                  <div className="comment">
                    {/* Parent comment*/}
                    <div className="comment-avatar">
                      <img className="comment-avatar-img" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
                    </div>
                    <div className="comment-content">
                      <div className="comment-author">Commenter Name</div>
                      <div className="comment-text">If you're going to lead a space frontier, it has to be government; it'll never be private enterprise. Because the space frontier is dangerous, and it's expensive, and it has unquantified risks.</div>
                      {/* Child comment 1*/}
                      <div className="comment comment-nested">
                        <div className="comment-avatar">
                          <img className="comment-avatar-img" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
                        </div>
                        <div className="comment-content">
                          <div className="comment-author">Commenter Name</div>
                          <div className="comment-text">And under those conditions, you cannot establish a capital-market evaluation of that enterprise. You can't get investors.</div>
                        </div>
                      </div>
                      {/* Child comment 2*/}
                      <div className="comment comment-nested">
                        <div className="comment-avatar">
                          <img className="comment-avatar-img" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
                        </div>
                        <div className="comment-content">
                          <div className="comment-author">Commenter Name</div>
                          <div className="comment-text">When you put money directly to a problem, it makes a good headline.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Single comment*/}
                  <div className="comment">
                    <div className="comment-avatar">
                      <img className="comment-avatar-img" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
                    </div>
                    <div className="comment-content">
                      <div className="comment-author">Commenter Name</div>
                      <div className="comment-text">When I look at the universe and all the ways the universe wants to kill us, I find it hard to reconcile that with statements of beneficence.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default BlogPost;


