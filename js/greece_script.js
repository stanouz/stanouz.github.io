// Initialize Leaflet Map
var map = L.map('map').setView([38.464524, 21.7726815], 9); // Set to Athens, Greece coordinates

// Add OpenStreetMap Tile Layer
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
    attribution: ''
}).addTo(map);


var gpxUrl = 'data/test.gpx';
fetch(gpxUrl)
    .then(response => response.text()) // Read file as text
    .then(data => {
        // Parse the GPX data as XML
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "application/xml");
        parseGPX(xmlDoc);
    })
    .catch(error => console.error("Error loading GPX file:", error));

// Step 4: Parse GPX data and plot it on the map
function parseGPX(xmlDoc) {
    var latLngs = [];
    var trkpts = xmlDoc.getElementsByTagName('trkpt');

    for (var i = 0; i < trkpts.length; i++) {
        var lat = trkpts[i].getAttribute('lat');
        var lon = trkpts[i].getAttribute('lon');
        latLngs.push([parseFloat(lat), parseFloat(lon)]);
    }

    // Step 5: Draw the polyline on the map
    var polyline = L.polyline(latLngs, { color: 'blue' }).addTo(map);

    // Optionally, fit the map bounds to the polyline
    map.fitBounds(polyline.getBounds());
    console.log(polyline.getBounds());
    // print mean bounds
    console.log(polyline.getBounds().getCenter());
}




// Example marker (optional)
// L.marker([37.9838, 23.7275]).addTo(map)
//     .bindPopup('Athens, Greece')
//     .openPopup();


// fetch data folder and display folder inside 
fetch('data/files.json')
    .then(response => response.json())
    .then(data => {
            data.forEach(element => {
                
                fetch("data/"+element.folder+"/"+element.txt_file)
                .then(response => response.text())
                .then(text => {
                    let all_lines = text.split(/\r?\n|\r/);
                    
                    let groups = [];
                    let tmp_group = "";

                    all_lines.forEach(line => {
                        
                         // remove  \n
                        line = line.replace("\n", "");   
                        if (line.length == 0) {
                            if (tmp_group != ""){
                                groups.push(tmp_group);
                            }
                            tmp_group = "";
                        }
                        tmp_group += line;
                        
                    });

                    if (tmp_group != ""){
                        groups.push(tmp_group);
                    }


                    


                    let html_element = document.getElementById("blog_content");

                    let title_date = document.createElement("p");
                    title_date.innerHTML = "<strong>"+element.folder+"</strong>";
                    title_date.className = "text-muted";
                    title_date.setAttribute("id", element.folder);
                    html_element.appendChild(title_date);
                
                    let tmp_div = document.createElement("div");
                    tmp_div.className = "post-content";


                    groups.forEach(group => {
                        if (group.startsWith("<img>")){

                            if(tmp_div.childElementCount > 0){
                                html_element.appendChild(tmp_div);
                                tmp_div = document.createElement("div");
                                tmp_div.className = "post-content";
                            }


                            let img = document.createElement("img");


                            let start_tag = group.indexOf("<img>");
                            let end_tag = group.indexOf("</img>");


                            img.src = "data/"+element.folder+"/"+group.substring(start_tag+5, end_tag);

                            img.className = "img-fluid mx-auto d-block mb-2 full-height-img";


                            let tmp_test = document.createElement("div");
                            tmp_test.appendChild(img);
                            tmp_test.className = "post-content";

                            html_element.appendChild(tmp_test);



                        }
                        else{
                            let p = document.createElement("p");
                            p.innerHTML = group;
                            tmp_div.appendChild(p);
                        }

                    });

                    if(tmp_div.childElementCount > 0){
                        html_element.appendChild(tmp_div);
                    }

                    let hr = document.createElement("hr");
                    html_element.lastChild.appendChild(hr);                        
                });



            });
        
        });