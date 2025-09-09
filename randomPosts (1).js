let widgetCounter = typeof widgetCounter === 'undefined' ? 0 : widgetCounter + 1;

function randomPosts(document) {
  // Generate unique widget ID
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  let widgetId = 'randomPosts_' + widgetCounter;
  for (let i = 0; i < 16; i++) {
    widgetId += chars[Math.floor(Math.random() * chars.length)];
  }

  // Find script element
  const script = document.querySelector('script[src*="randomPosts.js"]') || document.currentScript;
  if (!script) {
    console.error('RandomPosts: Script element not found');
    return;
  }

  // Parse attributes with defaults
  const config = {
    numberOfPosts: parseInt(script.getAttribute('numberofposts')) || 3,
    label: script.getAttribute('label') ? `/-/${encodeURIComponent(script.getAttribute('label'))}` : '',
    titleSize: parseInt(script.getAttribute('titlesize')) || 14,
    textSize: parseInt(script.getAttribute('textsize')) || 15,
    borderWidth: parseInt(script.getAttribute('borderwidth')) || 2,
    borderStyle: ['solid', 'dashed', 'dotted'].includes(script.getAttribute('borderstyle')) ? script.getAttribute('borderstyle') : 'solid',
    titleColor: script.getAttribute('titlecolor') || '#0088ff',
    textColor: /^#[0-9A-Fa-f]{6}$/.test(script.getAttribute('textcolor')) ? script.getAttribute('textcolor') : '#112112',
    titleFont: script.getAttribute('titlefont') || '"Trebuchet MS", Helvetica, sans-serif',
    textFont: script.getAttribute('textfont') || 'Georgia, serif',
    thumbnailAlign: script.getAttribute('thumbnail') === 'none' ? 'display:none' : script.getAttribute('thumbnail') === 'right' ? 'float:right;margin:0 0 5px 5px' : 'float:left;margin:0 5px 5px 0',
    thumbnailSize: parseInt(script.getAttribute('thumbnailsize')) || 80,
    thumbnailRounding: parseInt(script.getAttribute('thumbnailrounding')) || 5,
    noThumbnail: script.getAttribute('nothumbnail') || 'https://3.bp.blogspot.com/-zP87C2q9yog/UVopoHY30SI/AAAAAAAAE5k/AIyPvrpGLn8/s1600/no-image.png',
    postInfoAlign: script.getAttribute('postinfo') === 'none' ? 'display:none' : script.getAttribute('postinfo') === 'right' ? 'text-align:right' : script.getAttribute('postinfo') === 'center' ? 'text-align:center' : 'text-align:left',
    postAuthor: script.getAttribute('postauthor') || 'none',
    publishDate: script.getAttribute('publishdate') || 'none',
    numOfComments: script.getAttribute('numofcomments') || 'none',
    postCategories: script.getAttribute('postcategories') || 'left',
    excerptLength: parseInt(script.getAttribute('excerptlength')) || 100
  };
  const marginBottom = config.textSize < 12 ? 2 : config.textSize < 21 ? 3 : 4;

  // Create container
  const container = document.createElement('div');
  container.id = widgetId;
  script.parentNode.insertBefore(container, script.nextSibling);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #${widgetId} { display: block; }
    #${widgetId} .pbprandompost { display: block; font-size: ${config.textSize}px; padding: 5px; border-bottom: ${config.borderWidth}px ${config.borderStyle} ${config.titleColor}; margin-bottom: ${marginBottom}px; font-family: ${config.textFont}; }
    #${widgetId} .pbprandompost .pbpostitle { display: block; font-size: ${config.titleSize}px; font-weight: bold; color: ${config.titleColor}; font-family: ${config.titleFont}; margin-bottom: ${marginBottom}px; }
    #${widgetId} .pbprandompost a { text-decoration: none; border: none; padding: 0; margin: 0; }
    #${widgetId} .pbprandompost a:hover .pbpostitle { text-decoration: underline; }
    #${widgetId} .pbprandompost a img { border-radius: ${config.thumbnailRounding}px; ${config.thumbnailAlign}; width: ${config.thumbnailSize}px; height: auto; padding: 0; border: 0; }
    #${widgetId} .pbprandompost a img:hover { opacity: 0.8; }
    #${widgetId} .pbpinfobox { display: block; ${config.postInfoAlign}; cursor: default; margin-bottom: ${marginBottom}px; }
    #${widgetId} .pbpautor { display: ${config.postAuthor === 'none' ? 'none' : 'inline-block'}; font-size: ${config.textSize}px; }
    #${widgetId} .pbpdatapubl { display: ${config.publishDate === 'none' ? 'none' : 'inline-block'}; font-size: ${config.textSize}px; }
    #${widgetId} .pbpkomenty { display: ${config.numOfComments === 'none' ? 'none' : 'inline-block'}; font-size: ${config.textSize}px; }
    #${widgetId} .pbptagi { display: ${config.postCategories === 'none' ? 'none' : 'block'}; white-space: nowrap; overflow-x: hidden; cursor: default; margin-bottom: ${marginBottom + 1}px; }
    #${widgetId} .pbptagi .pbplabel { display: inline-block; border: 1px solid ${config.textColor}; padding: 1px 3px; border-radius: 15%; margin-right: 4px; }
    #${widgetId} .pbpfragment { display: block; font-style: italic; text-align: justify; color: ${config.textColor}; }
    #${widgetId}:after { content: ""; display: block; clear: both; }
  `;
  document.head.appendChild(style);

  // Function to process a single post
  function processPost(entry, index) {
    const post = {
      link: entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '/',
      title: entry.querySelector('title')?.textContent || 'No title',
      summary: config.excerptLength > 0 ? (entry.querySelector('summary')?.textContent.replace(/<[^>]+>/g, '').substring(0, config.excerptLength) + '...' : '') || '',
      published: entry.querySelector('published')?.textContent.substring(0, 10) || '',
      thumbnail: entry.getElementsByTagName('media:thumbnail').length > 0 ? entry.getElementsByTagName('media:thumbnail')[0].getAttribute('url').replace(/s\d+-c/, `s${config.thumbnailSize}-c`) : config.noThumbnail,
      comments: entry.getElementsByTagName('thr:total').length > 0 ? Number(entry.getElementsByTagName('thr:total')[0].textContent) : 0,
      author: entry.querySelector('author name')?.textContent || 'Anonymous',
      categories: '',
      categoryList: ''
    };

    entry.querySelectorAll('category').forEach((cat, i) => {
      const term = cat.getAttribute('term');
      post.categories += `<span class="pbplabel">${term}</span>`;
      post.categoryList += term + (i < entry.querySelectorAll('category').length - 1 ? ', ' : '');
    });

    const postDiv = document.createElement('div');
    postDiv.className = 'pbprandompost';
    postDiv.setAttribute('post', `np7${index}s1`);
    postDiv.innerHTML = `
      <a href="${post.link}" target="_blank" title="${post.title}">
        <img src="${post.thumbnail}" alt="${post.title}" onerror="this.src='${config.noThumbnail}'">
        <div class="pbpostitle">${post.title}</div>
      </a>
      <div class="pbpinfobox">
        ${config.postAuthor !== 'none' ? `<span class="pbpautor" title="Published by ${post.author}">👤 ${post.author}</span>` : ''}
        ${config.publishDate !== 'none' ? `<span class="pbpdatapubl" title="Date of publication">📅 ${post.published}</span>` : ''}
        ${config.numOfComments !== 'none' ? `<span class="pbpkomenty" title="${post.comments} comments about ${post.title}">💬 ${post.comments}</span>` : ''}
      </div>
      <div class="pbptagi" title="Labels: ${post.categoryList}">${post.categories}</div>
      <div class="pbpfragment">${post.summary}</div>
    `;
    return postDiv;
  }

  // Cache settings
  const cacheKey = `randomPosts_${config.label}_${widgetId}`;
  const cacheTTL = 60 * 60 * 1000; // 1 hour
  const fragment = document.createDocumentFragment();

  // Check cache
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheKey + '_time');
  const now = Date.now();

  if (cachedData && cachedTime && now - parseInt(cachedTime) < cacheTTL) {
    console.log('RandomPosts: Using cached data');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cachedData, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    const totalPosts = parseInt(xmlDoc.querySelector('openSearch\\:totalResults')?.textContent || 0);

    if (totalPosts === 0) {
      container.innerHTML = '<p>No posts found for label: ' + decodeURIComponent(config.label.replace('/-/', '')) + '</p>';
      return;
    }

    const selectedIndices = [];
    while (selectedIndices.length < config.numberOfPosts && selectedIndices.length < totalPosts) {
      const index = Math.floor(Math.random() * totalPosts);
      if (!selectedIndices.includes(index)) selectedIndices.push(index);
    }

    selectedIndices.forEach((index, i) => {
      if (index < entries.length) {
        fragment.appendChild(processPost(entries[index], index + 1));
      }
    });

    container.appendChild(fragment);
  } else {
    console.log('RandomPosts: Fetching new data');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/feeds/posts/summary${config.label}?start-index=1&max-results=20`, true);
    xhr.onerror = function() {
      console.error('RandomPosts: API request failed');
      container.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    };
    xhr.onload = function() {
      if (xhr.status === 200) {
        localStorage.setItem(cacheKey, xhr.responseText);
        localStorage.setItem(cacheKey + '_time', now);
        console.log('RandomPosts: Data cached');

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
        const entries = xmlDoc.querySelectorAll('entry');
        const totalPosts = parseInt(xmlDoc.querySelector('openSearch\\:totalResults')?.textContent || 0);

        if (totalPosts === 0) {
          container.innerHTML = '<p>No posts found for label: ' + decodeURIComponent(config.label.replace('/-/', '')) + '</p>';
          return;
        }

        const selectedIndices = [];
        while (selectedIndices.length < config.numberOfPosts && selectedIndices.length < totalPosts) {
          const index = Math.floor(Math.random() * totalPosts);
          if (!selectedIndices.includes(index)) selectedIndices.push(index);
        }

        selectedIndices.forEach((index, i) => {
          if (index < entries.length) {
            fragment.appendChild(processPost(entries[index], index + 1));
          } else {
            const xhrSingle = new XMLHttpRequest();
            xhrSingle.open('GET', `/feeds/posts/summary?start-index=${index + 1}&max-results=1`, true);
            xhrSingle.onload = function() {
              if (xhrSingle.status === 200) {
                const singleDoc = parser.parseFromString(xhrSingle.responseText, 'text/xml');
                const entry = singleDoc.querySelector('entry');
                if (entry) fragment.appendChild(processPost(entry, index + 1));
                container.appendChild(fragment);
              }
            };
            xhrSingle.send();
          }
        });

        container.appendChild(fragment);
      } else {
        console.error('RandomPosts: API returned status ' + xhr.status);
        container.innerHTML = '<p>Error loading posts. Please try again later.</p>';
      }
    };
    xhr.send();
  }
}

// Initialize widget
randomPosts(document);
