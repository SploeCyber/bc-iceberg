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
  const tabsContainer = document.getElementById('tabsContainer');
  tabsContainer.innerHTML = '';

  entries.forEach(entry => {
    const entryDiv = createEntryDiv(entry);
    tabsContainer.appendChild(entryDiv);
  });

  addTagEventListeners();
}

function createEntryDiv(entry) {
  const entryDiv = document.createElement('div');
  entryDiv.classList.add('tab-content');
  entryDiv.dataset.tier = entry.tier || 'N/A';

  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = entry.description;
  entryDiv.appendChild(descriptionElement);

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
