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

const defaultChannel = 'techguyweb';

// Form submit and change channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();
    const channel = channelInput.value;
    getChannel(channel);
});

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
            <ul class="list-group light-text">
                <li class="list-group-item">Title: ${channel.snippet.title}</li>
                <li class="list-group-item">ID: ${channel.id}</li>
                <li class="list-group-item">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
                <li class="list-group-item">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
                <li class="list-group-item">Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <div class="center-block">
                <a class="btn btn-danger" target="blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
            </div>
        `;
        showChannelData(output);

        const playlistId = channel.contentDetails.relatedPlaylists.uploads;
        requestVideoPlaylist(playlistId);
    })
    .catch(err => alert('No channel by that name'));
}

// Add commas to long numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get the playlist
function requestVideoPlaylist(id) {
    const requestOptions = {
        playlistId: id,
        part: 'snippet',
        maxResults: 10
    }

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        console.log(response);
        const playListItems = response.result.items;
        if(playListItems) {
            let output = '<h4 class="text-center">Latest Videos</h4>';

            // loop through playlist and append output
            playListItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;

                output += `
                    <div class="col-sm-3">
                        <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                `;
            });

            // Output videos
            videoContainer.innerHTML = output;
        }
        else {
            videoContainer.innerHTML = 'No Uploaded videos';
        }
    });
}