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
