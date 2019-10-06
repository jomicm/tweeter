/*eslint-env jquery*/
// eslint-disable-next-line no-undef
$(document).ready(function() {
  // Define jQuery elements once so it's more efficient
  const tweetContainer = $('#tweets-container');
  const tweetInput = $('#input-new-tweet');
  const letterCounter = $('.counter');
  const toggleMenuButton = $('.no-link');
  const goToSkyButton = $('#go-to-sky');
  const newTweetForm = $('#post-new-tweet');
  const error = $('#error');
  const closeErrorButton = $('#close-error-button');
  const errorMessage = $('#error-message');
  const newTweetSection = $('.new-tweet');
  // Appends all tweets to parten element
  const renderTweets = tweets => {
    // Reset all input elements so it is ready for a new tweet
    tweetContainer.html(null);
    tweetInput.val(null);
    letterCounter.html('140');
    // Appends all elements at once so it's more efficient
    const tweetElements = tweets.map(tweet => createTweetElement(tweet));
    tweetContainer.append(tweetElements.join(''));
    iconsToggle();
  };

  // Overrides form submit method to prevent reloading the page
  newTweetForm.submit(e => {
    e.preventDefault();
    if (!validateNewTweet()) return;
    error.fadeOut();
    const data  = $(e.currentTarget).serialize();
    const actionURL = e.currentTarget.action;
    pushTweets(actionURL, data);
  });

  // AJAX GET - Loads all existing tweets
  const loadTweets = async() => {
    try {
      const tweets = await $.ajax('/tweets', { method: 'GET' });
      renderTweets(tweets.sort((a, b) => b.created_at - a.created_at));
    } catch (err) {
      console.error(err);
    }
  };
  loadTweets();

  // AJAX POST - Push new tweets
  const pushTweets = async(actionURL, data) => {
    try {
      await $.ajax(actionURL, { method: 'POST', data });
      loadTweets();
    } catch (err) {
      console.log('Error while Pushig tweets!', err);
    }
  };

  // Toggle buttons to navigate to new tweet input
  let isOpen = false;
  toggleMenuButton.on('click', e => {
    if (!toggleNewTweet) {
      newTweetSection.slideUp('slow', 'linear');
      tweetContainer.css('margin-top','30px');
      isOpen = false;
    } else if (!isOpen) {
      newTweetSection.slideDown('slow', 'linear');
      tweetContainer.css('margin-top','100px');
      if ($(window).width() < 768) {
        $('html').animate({scrollTop: $('.new-tweet').offset().top},'slow');
      }
      tweetInput.focus();
      isOpen = true;
    }
    toggleNewTweet = !toggleNewTweet;
    
  });
  goToSkyButton.on('click', e => {
    $('html').animate({scrollTop: $('html').offset().top},'slow');
    setTimeout(() => {
      // $('.new-tweet').slideDown('slow', 'linear');
      // tweetContainer.css('margin-top','100px');
      if (!isOpen) {
        newTweetSection.slideDown('slow', 'linear');
        tweetContainer.css('margin-top','100px');
        tweetInput.focus();
        toggleNewTweet = !toggleNewTweet;
        isOpen = true;
      }
      if ($(window).width() < 768) {
        $('html').animate({scrollTop: $('.new-tweet').offset().top},'slow');
      }
      //$('html').animate({scrollTop: $('.new-tweet').offset().top},'slow');
    }, 500);
    tweetInput.focus();
  });

  // Display Go To Sky button
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > 450) {
      //goToSkyButton.css('display', 'block');
      goToSkyButton.fadeIn();
      toggleMenuButton.fadeOut();
    } else {
      goToSkyButton.css('display', 'none');
      goToSkyButton.fadeOut();
      toggleMenuButton.fadeIn();
    }
  });

  // Error section
  closeErrorButton.on('click', () => {
    error.fadeOut();
  });
  const launchError = message => {
    errorMessage.text(message);
    error.fadeIn();
  };

  // Validators
  const validateNewTweet = () => {
    let validationError = '';
    if (!tweetInput.val().trim().length) {
      validationError = 'Tweets cannot be empty!';
    } else if (tweetInput.val().length > 140) {
      validationError = 'Only 140 max length tweets allowed!';
    }
    if (validationError.length) {
      launchError(validationError);
      return false;
    }
    return true;
  };
});

// Global Variables
let toggleNewTweet = false;

// Helper infile functions
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
const escape =  str => {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
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