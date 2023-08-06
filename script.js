(async function () {
  const tabsContainer = document.getElementById('tabsContainer');

  async function fetchData() {
    try {
      const response = await fetch('entries.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  function displayData(entries) {
    tabsContainer.innerHTML = '';

    const uniqueTiers = findUniqueTiers(entries);
    createTabs(uniqueTiers);

    entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('tab-content');
      entryDiv.dataset.tier = entry.tier || 'N/A';

      const title = document.createElement('h2');
      title.textContent = entry.name;
      entryDiv.appendChild(title);

      if (entry.description) {
        const description = document.createElement('p');
        description.textContent = entry.description;
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
        tags.innerHTML = `Tags: ${entry.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join(', ')}`;
      } else {
        tags.textContent = 'Tags: N/A';
      }
      entryDiv.appendChild(tags);

      const tierTab = document.getElementById(`tier${entry.tier}`);
      if (tierTab) {
        tierTab.appendChild(entryDiv);
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

  function createTabs(uniqueTiers) {
    uniqueTiers.forEach(tier => {
      const tabLink = document.createElement('div');
      tabLink.classList.add('tab-link');
      tabLink.textContent = `Tier ${tier}`;
      tabLink.setAttribute('data-tab', `tier${tier}`);
      tabsContainer.appendChild(tabLink);

      const tabContent = document.createElement('div');
      tabContent.classList.add('tab');
      tabContent.setAttribute('id', `tier${tier}`);
      tabsContainer.appendChild(tabContent);
    });
  }

  function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.toggle('active', tab.id === tabName));

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tabLink => tabLink.classList.toggle('active', tabLink.getAttribute('data-tab') === tabName));
  }

  function filterByTag(tag) {
    const allTabContent = document.querySelectorAll('.tab-content');
    allTabContent.forEach(tabContent => {
      const tags = tabContent.querySelectorAll('.tag');
      if (tags.length > 0) {
        const containsTag = Array.from(tags).some(tagElement => tagElement.getAttribute('data-tag') === tag);
        tabContent.style.display = containsTag ? 'block' : 'none';
      }
    });
  }

  const data = await fetchData();
  displayData(data);
})();
