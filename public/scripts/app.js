/*eslint-env jquery*/
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// eslint-disable-next-line no-undef
$(document).ready(function() {

  const getElapsedTime = date => {
    const now = new Date();
    const diff = now.getTime() - (new Date(date)).getTime();
    let seconds = diff / 1000;
    let timeMeasure = 'seconds';
    let time = seconds;
    if (seconds > 60 * 60 * 24 * 365) {
      timeMeasure = 'year';
      time = Math.floor(seconds / (60 * 60 * 24 * 365));
    } else if (seconds > 60 * 60 * 24 * 7) {
      timeMeasure = 'week';
      time = Math.floor(seconds / (60 * 60 * 24 * 7));
    } else if (seconds > 60 * 60 * 24) {
      timeMeasure = 'day';
      time = Math.floor(seconds / (60 * 60 * 24));
    } else if (seconds > 60 * 60) {
      timeMeasure = 'hour';
      time = Math.floor(seconds / (60 * 60));
    } else if (seconds > 60) {
      timeMeasure = 'minute';
      time = Math.floor(seconds / 60);
    }
    return `${time} ${timeMeasure}${time > 1 ? 's' : ''} ago`;
  };

  const createTweetElement = tweet => {
    const elapsed = getElapsedTime(tweet.created_at);
    const resTweet = `<article class="tweet">
                        <header>
                          <div class="tweet-identity">
                            <img class="avatar" src="${tweet.user.avatars}"/>
                            <span>${tweet.user.name}</span>
                          </div>
                          <span class="right-align handle">${tweet.user.handle}</span>
                        </header>
                        <div class="tweet-content">
                          <span>${escape(tweet.content.text)}</span>
                        </div>
                        <div class="line"></div>
                        <footer>
                          <small>${elapsed}</small>
                          <div class="right-align">
                            🇲🇽♼❤️
                          </div>
                        </footer>
                      </article>`;
    return resTweet;
  };

  const renderTweets = tweets => {
    $('#tweets-container').html(null);
    $('#txtIn').val(null);
    $('.counter').html('140');
    const tweetElements = tweets.map(tweet => createTweetElement(tweet));
    tweetElements.map(tweetElement => $('#tweets-container').append(tweetElement));
  };

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(tweets => renderTweets(tweets.sort((a, b) => b.created_at - a.created_at)));
  };
  loadTweets();

  $("#post-new-tweet").submit(function(e) {
    e.preventDefault();
    const data = $("#post-new-tweet").serialize();
    let validationError = '';
    if (!$('#txtIn').val().length) {
      validationError = 'There is no message';
    } else if ($('#txtIn').val().length > 140) {
      validationError = 'Only 140 max length messages allowed';
    }
    if (validationError.length) {
      alert(validationError);
      return;
    }
    const actionurl = e.currentTarget.action;
    $.ajax(actionurl, { method: 'POST', data })
      .then(() => loadTweets())
      .fail((req, status, err) => console.log('Error while Pushig tweets!', err, 'st:',status));
  });
  
});