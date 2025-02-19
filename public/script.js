document.getElementById('urlForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const longUrl = document.getElementById('longUrl').value;

    // Send the long URL to the backend
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
    });
    const data = await response.json();

    // Display the shortened URL
    displayShortenedUrl(data.shortUrl, longUrl);
});

function displayShortenedUrl(shortUrl, longUrl) {
    const resultContainer = document.getElementById('result');

    // Create a new result item
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    // Add the shortened URL
    const link = document.createElement('a');
    link.href = shortUrl;
    link.textContent = shortUrl;
    link.target = '_blank';

    // Add the copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            alert('URL copied to clipboard!');
        });
    };

    // Add the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        resultContainer.removeChild(resultItem);
        // Optional: Send a request to the backend to delete the URL
    };

    // Add actions container
    const actions = document.createElement('div');
    actions.className = 'result-actions';
    actions.appendChild(copyBtn);
    actions.appendChild(deleteBtn);

    // Append everything to the result item
    resultItem.appendChild(link);
    resultItem.appendChild(actions);

    // Append the result item to the container
    resultContainer.appendChild(resultItem);
}