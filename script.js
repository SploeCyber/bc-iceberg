(async function () {
  const tabsContainer = document.getElementById('tabsContainer');

  function fetchData() {
    return fetch('entries.json')
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching data:', error);
        return [];
      });
  }

  function displayData(entries) {
    const allTags = new Set();
    const entryElements = [];

    entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('tab-content');
      entryDiv.dataset.tier = entry.tier || 'N/A';

      const title = document.createElement('h2');
      title.innerHTML = entry.name;
      entryDiv.appendChild(title);

      if (entry.description) {
        const description = document.createElement('p');
        description.innerHTML = entry.description;
        entryDiv.appendChild(description);
      }

      if (entry.media && entry.mediaType === 'image' && entry.media !== 'none') {
        const media = document.createElement('img');
        media.setAttribute('src', `media/${entry.media}`);
        media.setAttribute('alt', entry.name);
        entryDiv.appendChild(media);
      }

      const tierTag = document.createElement('p');
      tierTag.textContent = `Tier: ${entry.tier || 'N/A'}`;
      entryDiv.appendChild(tierTag);

      const tags = document.createElement('p');
      tags.classList.add('tags');
      if (entry.tags) {
        entry.tags.forEach(tag => allTags.add(tag));
        tags.innerHTML = `Tags: ${entry.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join(', ')}`;
      } else {
        tags.textContent = 'Tags: N/A';
      }
      entryDiv.appendChild(tags);

      entryElements.push(entryDiv);
    });

    tabsContainer.innerHTML = '';

    const uniqueTiers = findUniqueTiers(entries);
    uniqueTiers.forEach(tier => {
      const tabLink = document.createElement('div');
      tabLink.classList.add('tab-link');
      tabLink.textContent = `Tier ${tier}`;
      tabLink.setAttribute('data-tab', `tier${tier}`);
      tabsContainer.appendChild(tabLink);

      const tabContent = document.createElement('div');
      tabContent.classList.add('tab');
      tabContent.setAttribute('id', `tier${tier}`);
      document.body.appendChild(tabContent);
    });

    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tags-container');
    allTags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.classList.add('tag');
      tagElement.textContent = tag;
      tagElement.setAttribute('data-tag', tag);
      tagsContainer.appendChild(tagElement);
    });
    document.body.appendChild(tagsContainer);

    entryElements.forEach(entryElement => {
      const tierTab = document.getElementById(`tier${entryElement.dataset.tier}`);
      if (tierTab) {
        tierTab.appendChild(entryElement);
      }
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tabLink => {
      tabLink.addEventListener('click', () => {
        const tabName = tabLink.getAttribute('data-tab');
        switchTab(tabName);
      });
    });

    const tagElements = document.querySelectorAll('.tag');
    tagElements.forEach(tagElement => {
      tagElement.addEventListener('click', () => {
        const selectedTag = tagElement.getAttribute('data-tag');
        filterByTag(selectedTag);
      });
    });
  }

  function findUniqueTiers(entries) {
    const uniqueTiers = new Set();
    entries.forEach(entry => uniqueTiers.add(entry.tier));
    return Array.from(uniqueTiers).sort();
  }

 
