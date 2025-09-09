let widgetCounter = typeof widgetCounter === 'undefined' ? 0 : widgetCounter + 1;

function randomPosts(selector, getAttribute, querySelector, getElementsByTagName, responseText, document) {
  // Generate unique ID for widget instance
  const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-';
  let widgetId = '';
  for (let i = 0; i < 16; i++) {
    widgetId += chars[Math.floor(Math.random() * chars.length)];
  }

  // Create style element
  const style = document.createElement('style');
  style.textContent = `#${widgetId}{display:block}`;
  document.head.appendChild(style);

  // Get script element
  const script = document.querySelector(`script[src="/path/to/randomPosts.js"]`);
  const fragment = document.createDocumentFragment();

  // Parse attributes with defaults
  const numberOfPosts = parseInt(script.getAttribute('numberofposts')) || 5;
  const label = script.getAttribute('label') ? `/-/${encodeURIComponent(script.getAttribute('label'))}` : '';
  const titleSize = parseInt(script.getAttribute('titlesize')) || 12;
  const textSize = parseInt(script.getAttribute('textsize')) || titleSize + 3;
  const marginBottom = textSize < 12 ? 2 : textSize < 21 ? 3 : 4;
  const borderWidth = parseInt(script.getAttribute('borderwidth')) || 1;
  const borderStyle = ['solid', 'dashed', 'dotted'].includes(script.getAttribute('borderstyle')) ? script.getAttribute('borderstyle') : 'solid';
  const titleColor = script.getAttribute('titlecolor') || '#333333';
  const textColor = script.getAttribute('textcolor') || '#333333';
  const titleFont = script.getAttribute('titlefont') || '"Trebuchet MS", Helvetica, sans-serif';
  const textFont = script.getAttribute('textfont') || 'Georgia, serif';
  const thumbnailAlign = script.getAttribute('thumbnail') === 'none' ? 'display:none' : script.getAttribute('thumbnail') === 'right' ? 'float:right;margin:0 0 5px 5px' : 'float:left;margin:0 5px 5px 0';
  const thumbnailSize = parseInt(script.getAttribute('thumbnailsize')) || 70;
  const thumbnailRounding = parseInt(script.getAttribute('thumbnailrounding')) || 0;
  const noThumbnail = script.getAttribute('nothumbnail') || 'https://3.bp.blogspot.com/.../s1600/no-image.png';
  const postInfoAlign = script.getAttribute('postinfo') === 'none' ? 'display:none' : script.getAttribute('postinfo') === 'right' ? 'display:block;text-align:right' : script.getAttribute('postinfo') === 'center' ? 'display:block;text-align:center' : 'display:block;text-align:left';
  const postAuthor = script.getAttribute('postauthor') || 'none';
  const publishDate = script.getAttribute('publishdate') || 'none';
  const numOfComments = script.getAttribute('numofcomments') || 'none';
  const postCategories = script.getAttribute('postcategories') || 'none';
  const excerptLength = parseInt(script.getAttribute('excerptlength')) || 200;

  // Generate CSS
  style.textContent += `
    #${widgetId} pbprandompost{display:block;font-size:${textSize}px;padding:5px;border-bottom:${borderWidth}px ${borderStyle} ${titleColor};margin-bottom:${marginBottom}px;font-family:${textFont}}
    #${widgetId} pbprandompost pbpostitle{display:${postInfoAlign};font-size:${titleSize}px;font-weight:bold;color:${titleColor};font-family:${titleFont};margin-bottom:${marginBottom}px}
    #${widgetId} pbprandompost a{text-decoration:none;border:none;padding:0;margin:0}
    #${widgetId} pbprandompost a:hover pbpostitle{text-decoration:underline}
    #${widgetId} pbprandompost a img{border-radius:${thumbnailRounding}px}
    #${widgetId} pbprandompost a img:hover{opacity:0.8}
    #${widgetId} pbpinfobox{display:${postInfoAlign};cursor:default;margin-bottom:${marginBottom}px}
    #${widgetId} pbpinfobox pbpautor{display:${postAuthor === 'none' ? 'none' : 'inline-block'};font-size:${textSize}px}
    #${widgetId} pbpinfobox pbpdatapubl{display:${publishDate === 'none' ? 'none' : 'inline-block'};font-size:${textSize}px}
    #${widgetId} pbpinfobox pbpkomenty{display:${numOfComments === 'none' ? 'none' : 'inline-block'};font-size:${textSize}px}
    #${widgetId} pbptagi{display:${postCategories === 'none' ? 'none' : 'block'};white-space:nowrap;overflow-x:hidden;cursor:default;margin-bottom:${marginBottom + 1}px}
    #${widgetId} pbptagi pbplabel{display:inline-block;border:1px solid ${textColor};padding:1px 3px;border-radius:15%;margin-right:4px}
    #${widgetId} pbpfragment{display:block;font-style:italic;text-align:justify}
    #${widgetId}:after{content:"";display:block;clear:both}
  `;

  // Function to process a single post
  function processPost(entry, index) {
    const post = {
      link: entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '/',
      title: entry.querySelector('title')?.textContent || 'No title',
      summary: excerptLength > 0 ? (entry.querySelector('summary')?.textContent.replace(/<[^>]+>/g, '').substring(0, excerptLength) + '...' : ''),
      published: entry.querySelector('published')?.textContent.substring(0, 10) || '',
      thumbnail: entry.getElementsByTagName('media:thumbnail').length > 0 ? entry.getElementsByTagName('media:thumbnail')[0].getAttribute('url') + `?w=${thumbnailSize}` : noThumbnail + `?w=${thumbnailSize}`,
      comments: entry.getElementsByTagName('thr:total').length > 0 ? Number(entry.getElementsByTagName('thr:total')[0].textContent) : 0,
      author: entry.querySelector('author name')?.textContent || 'Anonymous',
      categories: '',
      categoryList: ''
    };

    entry.querySelectorAll('category').forEach((cat, i) => {
      const term = cat.getAttribute('term');
      post.categories += `<pbplabel>${term}</pbplabel>`;
      post.categoryList += term + (i < entry.querySelectorAll('category').length - 1 ? ', ' : '');
    });

    const postDiv = document.createElement('div');
    postDiv.setAttribute('class', 'pbprandompost');
    postDiv.setAttribute('post', `np7${index}s1`);
    postDiv.innerHTML = `
      <a href="${post.link}" target="_blank" title="${post.title}">
        <img src="${post.thumbnail}" style="${thumbnailAlign};width:${thumbnailSize}px;height:auto;padding:0;border:0" alt="No image" onerror="this.src='${noThumbnail}'">
        <pbpostitle>${post.title}</pbpostitle>
      </a>
      <pbpinfobox>
        ${postAuthor !== 'none' ? `<pbpautor title="Published by ${post.author}">👤 ${post.author}</pbpautor>` : ''}
        ${publishDate !== 'none' ? `<pbpdatapubl title="Date of publication">📅 ${post.published}</pbpdatapubl>` : ''}
        ${numOfComments !== 'none' ? `<pbpkomenty title="${post.comments} comments about ${post.title}">💬 ${post.comments}</pbpkomenty>` : ''}
      </pbpinfobox>
      <pbptagi title="Labels: ${post.categoryList}">${post.categories}</pbptagi>
      <pbpfragment>${post.summary}</pbpfragment>
    `;
    fragment.appendChild(postDiv);
  }

  // Cache key and TTL (1 hour)
  const cacheKey = `randomPosts_${label}_${widgetId}`;
  const cacheTTL = 60 * 60 * 1000; // 1 hour in milliseconds

  // Check cache
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheKey + '_time');
  const now = Date.now();

  if (cachedData && cachedTime && now - parseInt(cachedTime) < cacheTTL) {
    // Use cached data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cachedData, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    const totalPosts = parseInt(xmlDoc.querySelector('openSearch\\:totalResults')?.textContent || 0);
    const selectedIndices = [];

    // Select random posts
    while (selectedIndices.length < numberOfPosts && selectedIndices.length < totalPosts) {
      const index = Math.floor(Math.random() * totalPosts + 1);
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
        const postDiv = document.createElement('div');
        postDiv.setAttribute('class', 'pbprandompost');
        postDiv.setAttribute('post', `np7${index}s1`);
        fragment.appendChild(postDiv);
      }
    }

    // Process cached posts
    selectedIndices.forEach((index, i) => {
      if (index <= entries.length) {
        processPost(entries[index - 1], index);
      }
    });

    // Append fragment to DOM
    document.querySelector(`#${widgetId}`).appendChild(fragment);
  } else {
    // Fetch new data
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/feeds/posts/summary${label}?start-index=1&max-results=20`);
    xhr.onload = function() {
      if (xhr.status === 200) {
        // Cache response
        localStorage.setItem(cacheKey, xhr.responseText);
        localStorage.setItem(cacheKey + '_time', now);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
        const entries = xmlDoc.querySelectorAll('entry');
        const totalPosts = parseInt(xmlDoc.querySelector('openSearch\\:totalResults')?.textContent || 0);
        const selectedIndices = [];

        // Select random posts
        while (selectedIndices.length < numberOfPosts && selectedIndices.length < totalPosts) {
          const index = Math.floor(Math.random() * totalPosts + 1);
          if (!selectedIndices.includes(index)) {
            selectedIndices.push(index);
            const postDiv = document.createElement('div');
            postDiv.setAttribute('class', 'pbprandompost');
            postDiv.setAttribute('post', `np7${index}s1`);
            fragment.appendChild(postDiv);
          }
        }

        // Process posts
        selectedIndices.forEach((index, i) => {
          if (index <= entries.length) {
            processPost(entries[index - 1], index);
          } else {
            const xhrSingle = new XMLHttpRequest();
            xhrSingle.open('GET', `/feeds/posts/summary?start-index=${index}&max-results=1`);
            xhrSingle.onload = function() {
              if (xhrSingle.status === 200) {
                const singleDoc = parser.parseFromString(xhrSingle.responseText, 'text/xml');
                processPost(singleDoc.querySelector('entry'), index);
              }
            };
            xhrSingle.send();
          }
        });

        // Append fragment to DOM
        document.querySelector(`#${widgetId}`).appendChild(fragment);
      }
    };
    xhr.send();
  }
}

// Initialize widget
randomPosts('querySelector', 'getAttribute', 'querySelector', 'getElementsByTagName', 'textContent', document);