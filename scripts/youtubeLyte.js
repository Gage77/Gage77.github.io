// Set YouTube API options
const CLIENT_ID = '1039077288974-8e027o4g9h12f9g5emnspuvrtuf08br0.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'thetechguy';

// Load Auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up signin listeners
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        // Listen for signin state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle initial signin state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        // Handle clicks of login and logout button
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

// Update UI signin state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    }
    else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';   
    }
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Display channel data
function showChannelData(data) {
    const channelData = document.getElementById('channel-data');
    channelData.innerHTML = data;
}

// Get channel from API
function getChannel(channel) {
    console.log(channel);
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
    .then(response => {
        console.log(response);
        const channel = response.result.items[0];

        const output = `
            <ul>
                <li>Title: ${channel.snippet.title}</li>
                <li>ID: ${channel.id}</li>
                <li>Subscribers: ${channel.statistics.subscriberCount}</li>
                <li>Views: ${channel.statistics.viewCount}</li>
                <li>Videos: ${channel.statistics.videoCount}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class="btn btn-primary" target="blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
        `;
        showChannelData(output);
    })
    .catch(err => alert('No channel by that name'));
}