// Helper functions

// Get the time elapsed in a human readable format
const getElapsedTime = date => {
  const now = new Date();
  const diff = now.getTime() - (new Date(date)).getTime();
  let seconds = Math.ceil(diff / 1000);
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

// Create new tweet using template literals
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
                            <i data-icon="flag" data-selected="false" class="icons icon-flag fa fa-flag"></i>
                            <i data-icon="retweet" data-selected="false" class="icons icon-retweet fa fa-retweet"></i>
                            <i data-icon="heart" data-selected="false" class="icons icon-heart fa fa-heart"></i>
                          </div>
                      </footer>
                    </article>`;
  return resTweet;
};

// Escape code which could be a risk
const escape =  str => {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Allows in-memory changing colors to icons
const iconsToggle =  () => {
  const icons = $('.icons');
  icons.on('click', e => {
    const icon = $(e.target);
    const type = icon.data();
    if (type.icon === 'heart' && !type.selected) {
      icon.css('color', 'red');
      icon.data('selected', true);
    } else if (type.icon === 'retweet' && !type.selected) {
      icon.css('color', 'blue');
      icon.data('selected', true);
    } else if (type.icon === 'flag' && !type.selected) {
      icon.css('color', 'orange');
      icon.data('selected', true);
    } else if (type.selected) {
      icon.data('selected', false);
      icon.css('color', 'gray');
    }
  });
};