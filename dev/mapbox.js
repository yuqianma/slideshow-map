import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF5cTA0MjIiLCJhIjoiY2phamMwOHV4MjllajMzbnFyeTMwcmZvYiJ9.aFMw4Aws5zY9Y4NwYqFMlQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [118.78, 32.04],
    maxZoom: 16,
    minZoom: 9,
    zoom: 9.68
});

window.map = map;

function playback(index) {

    // bug
    // highlightBorough(locations[index].id ? locations[index].id : '');

    // Animate the map position based on camera properties
    map.flyTo(locations[index].camera);

    map.once('moveend', function() {
        // Duration the slide is on screen after interaction
        window.setTimeout(function() {
            // Increment index
            index = (index + 1 === locations.length) ? 0 : index + 1;
            playback(index);
        }, 3000); // After callback, show the location for 3 seconds.
    });
}

map.on('load', function() {

    map.addLayer({
        "id": "highlight",
        "type": "fill",
        "source": {
            "type": "vector",
            "url": "mapbox://mapbox.8ibmsn6u"
        },
        "source-layer": "original",
        "paint": {
            "fill-color": "#fd6b50",
            "fill-opacity": 0.25
        },
        "filter": ["==", "borocode", ""]
    });

    // Start the playback animation for each borough
    // playback(0);

    flyTo.nanjing();

    map.once('moveend', () => {
        window.setTimeout(() => flyTo.wuxi(), 2000);
    });
});

window.flyTo = {
    nanjing: () => map.flyTo({
        center: [118.78, 32.04],
        zoom: 12.21,
        pitch: 50
    }),

    wuxi: () => map.flyTo({
        center: [120.299, 31.568],
        zoom: 12.21,
        pitch: 50,
        speed: 0.5
    })
};