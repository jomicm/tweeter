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

  // Appends all tweets to parten element
  const renderTweets = tweets => {
    // Reset all input elements so it is ready for a new tweet
    tweetContainer.html(null);
    tweetInput.val(null);
    letterCounter.html('140');
    // Appends all elements at once so it's more efficient
    const tweetElements = tweets.map(tweet => createTweetElement(tweet));
    tweetContainer.append(tweetElements.join(''));
  };

  // Overrides form submit method to prevent reloading the page
  newTweetForm.submit(e => {
    e.preventDefault();
    console.log('e', e.currentTarget);
    const tmpdata  = $(e.currentTarget).serializeArray();
    console.log('tmpdata', tmpdata);
    console.log('tmpdata', tmpdata.deserialize());

    return;
    // Validates a correct tweet
    if (!validateNewTweet()) return;
    error.fadeOut();
    const data  = $(e.currentTarget).serialize();

    data.split('=')

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
  toggleMenuButton.on('click', e => {
    if (!toggleNewTweet) {
      // $('html,body').animate({scrollTop: $('#compose-tweet').offset().top},'slow');
      $('html,body').animate({scrollTop: 400},'slow');
      $('#arrow-toggle').addClass('rotated');
    } else {
      $('html,body').animate({scrollTop: $('html').offset().top},'slow');
      $('#arrow-toggle').removeClass('rotated');
    }
    toggleNewTweet = !toggleNewTweet;
    e.preventDefault();
    $("#txtIn").focus();
  });
  goToSkyButton.on('click', e => {
    //$('html,body').animate({scrollTop: $('html').offset().top},'slow');
    $('html,body').animate({scrollTop: $('#compose-tweet').offset().top}, 'slow');
    e.preventDefault();
    $("#txtIn").focus();
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
    if (!tweetInput.val().length) {
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
                          🇲🇽♼❤️
                        </div>
                      </footer>
                    </article>`;
  return resTweet;
};
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};