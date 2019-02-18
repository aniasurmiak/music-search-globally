// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector) {
    // Getting a dom-element
    this.container = document.querySelector(domSelector)
    // Store my data
    this.data = null
    // Represents the currently displayed data
    this.viewData = null
    // Show stuff
    this.render()
  }

  modViewData(newData) {
    this.viewData = newData
    this.render()
  }

  template(music) {
    // Mapping over data and returning HTML String
    // For now we just assume that all data is there and that it is
    // from datatype string
    // TODO: create a template function
    const trackList = music.map(

      track => {
        const { trackId, trackName, artistName, collectionName, releaseDate, artworkUrl100, trackPrice, currency, previewUrl } = track;

        const divElement = `
  <div class="row">
    <div>
    <img src="${artworkUrl100}"></div>
    <div>${trackName} <p>Released: ${new Date(releaseDate).toLocaleDateString()}</p></div>
    <div>${artistName}<p>${collectionName}</p></div>
    <div>${trackPrice == -1 ? "Only album" : trackPrice} ${currency == "USD" ? trackPrice == -1 ? "" : "$" : "€"}</div>
    <div>
    <i class="fas fa-play" id="${trackId}"></i>
    <i class="fas fa-pause" id="${trackId}"></i>
    </div>
  </div>
  `

        return divElement

      }
    ).join("")

    return trackList
  }
  
  // Search filter
  filterTracks(search) {
    const newData = this.data.filter(track => track.artistName.toLowerCase().includes(search.toLowerCase()) || track.trackName.toLowerCase().includes(search.toLowerCase()))
    this.modViewData(newData)
  }
  updateData(data) {
    // Store my data
    this.data = data
    // Represents the currently displayed data
    this.viewData = data

    this.render()
  }

  defaultTemplate() {
    return `
    <div>Search to see music</div>`
    
  }
  isSorted(array, prop) {
    return array.slice(1).every((item, i) => array[i][prop] <= item[prop])
  }

  sortPricing() {
    // Sort by trackPrice
    const isAscending = this.isSorted(this.viewData, 'trackPrice')
    console.log(!isAscending ? "Not ASC -> sort ASC" : isAscending ? "It's ASC -> sort Desc" : '')
    const newData = (!isAscending ? this.viewData.sort((a, b) => a.trackPrice - b.trackPrice)
      : isAscending ? this.viewData.reverse()
        : "")
    this.modViewData(newData)
  }


  sortArtist() {
    // Sort by artistName
    const isAlphabetic = this.isSorted(this.viewData, 'artistName')
    console.log(!isAlphabetic ? "Not Alphabetically -> sort Alphabetically" : isAlphabetic ? "It's Alphabetically -> reverse order" : '')

    const newData = (!isAlphabetic ? this.viewData.sort((a, b) => a.artistName.localeCompare(b.artistName)) : isAlphabetic ? this.viewData.reverse() : '')
    this.modViewData(newData)
  }

  addEventListeners() {
    // All DOM on-event handlers

    // GlobalEventHandler to filter input
    document.querySelector("#filter-input").onkeyup =
      event => {
        console.log(`Searching: ${event.target.value}`)
        myTrackList.filterTracks(event.target.value)
      }

    // Event listener to sort price and artist
    document.querySelector("#price").addEventListener("click", () => this.sortPricing())
    document.querySelector("#artist").addEventListener("click", () => this.sortArtist())
    // Create event listeners for any play-button
    let playLinks = document.querySelectorAll(".fa-play")
    let data = this.data
    playLinks.forEach(
      function (link) {
        link.addEventListener("click", function (event) {
          console.log(`Playing ${event.target.id}`)
          // Retrieve the data for the selected track
          let myTrack = data.filter(track => track.trackId == event.target.id)
          // Create an audio player for the selected track
          document.querySelector("#play").innerHTML = `<audio id="player_${event.target.id}" src="${myTrack[0].previewUrl} "></audio>`
          document.querySelector(`#player_${event.target.id}`).play()
        })
      })


    // Create event listeners for any pause button   
    let pauseLinks = document.querySelectorAll(".fa-pause")
    pauseLinks.forEach(
      link => {
        link.addEventListener("click", () => {
          //Select and stop the running audio player
          let sounds = document.querySelector("audio")
          sounds.pause()
          console.log("Stop music!")
        })
      })
  }


  render() {
    // Out put will hold the complete view
    let output = ""
    // Setting up data for our view
    const header = "<h1>My tracks</h1>"
    // template methode accepts data to view and returns html string
    const template = this.viewData
    ? this.template(this.viewData)
    : this.defaultTemplate()
    // Adding data in to our view !Order Matters!
    output += header
    output += "<p>Data from iTunes</p>"
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output
    // Add EventLiseners
   
  }
}

const myTrackList = new TrackList("#tracks")
const search = "jack johnson"
const url = `https://dci-fbw12-search-itunes.now.sh/?term=${search}`
const req = new XMLHttpRequest()
req.open("GET", url, true)
req.responseType = "json"
req.onload = function() {
  var jsonResponse = req.response
  console.log(jsonResponse.results)
  myTrackList.updateData(jsonResponse.results)
  myTrackList.data = jsonResponse.results
  myTrackList.viewData = jsonResponse.results
  myTrackList.render()
  // do something with jsonResponse
}
document.querySelector(".request").addEventListener("input", function() {
  const search = document.querySelector(".request").value;
  const modSearch = search.replace(" ", "%20");
  const url = `https://dci-fbw12-search-itunes.now.sh/?term=${modSearch}`;
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "json";
  req.onload = function() {
    var jsonResponse = req.response;
    console.log(jsonResponse.results);
    myTrackList.updateData(jsonResponse.results);
    // do something with jsonResponse
  };

  req.send(null);
});

req.send(null)
