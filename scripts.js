// scripts.js
async function fetchData() {
  try {
    const response = await fetch('entries.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function displayData(entries) {
  const sortedEntries = entries.sort((a, b) => (a.tier || 0) - (b.tier || 0));
  const tabsContainer = document.getElementById('tabsContainer');
  tabsContainer.innerHTML = '';

  sortedEntries.forEach(entry => {
    const entryDiv = createEntryDiv(entry);
    tabsContainer.appendChild(entryDiv);
  });

  addTagEventListeners();
}

function createEntryDiv(entry) {
  const entryDiv = document.createElement('div');
  entryDiv.classList.add('tab-content');
  entryDiv.dataset.tier = entry.tier || 'N/A';

  const title = document.createElement('h2');
  title.innerHTML = entry.name; // Use innerHTML to render HTML tags in title
  entryDiv.appendChild(title);

  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = entry.description; // Use innerHTML to render HTML tags in description
  entryDiv.appendChild(descriptionElement);

  if (entry.media && entry.mediaType === 'image' && entry.media !== 'none') {
    const media = document.createElement('img');
    media.setAttribute('src', `media/${entry.media}`);
    media.setAttribute('alt', entry.name);
    entryDiv.appendChild(media);
  }

  const tierTag = document.createElement('p');
  tierTag.textContent = `Tier: ${entry.tier || 'N/A'}`;
  entryDiv.appendChild(tierTag);

  if (entry.tags && entry.tags.length > 0) {
    const tags = document.createElement('p');
    tags.classList.add('tags');
    tags.innerHTML = `Tags: ${entry.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join(', ')}`;
    entryDiv.appendChild(tags);
  }

  return entryDiv;
}

function addTagEventListeners() {
  const tagElements = document.querySelectorAll('.tag');
  tagElements.forEach(tagElement => {
    tagElement.addEventListener('click', () => {
      const selectedTag = tagElement.getAttribute('data-tag');
      filterByTag(selectedTag);
    });
  });
}

(async function () {
  try {
    const data = await fetchData();
    displayData(data);
  } catch (error) {
    console.error('Error:', error);
  }
})();
