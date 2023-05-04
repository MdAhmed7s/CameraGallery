let video = document.querySelector("video");

let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");

let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let transparentColor = "transparent"; //variable for filters store so that we can apply it to image
// For Toggling 
let recordFlag = false; 

let recorder;

// Media Data in chunks
let chunks = [];  // creating an array for storing data chunks

// Allowing video and audio access
let constraint = {
  video: true,
  audio: true
}

// Navigator -> Global Object >> Browser info 
// Accessing Video and Audio
// Main function for collecting the data from our camera
window.navigator.mediaDevices.getUserMedia(constraint)
  .then((stream) => {
    video.srcObject = stream;
    
    recorder = new MediaRecorder(stream);

    //Empty the array 
    recorder.addEventListener("start", (e)=>{
      chunks=[];
    })
    
    // Taking and Pushing the data in the array
    recorder.addEventListener("dataavailable", (e) =>{
      chunks.push(e.data);
    }) 

    //Stop the recording
    recorder.addEventListener("stop", (e)=>{
      // Conversion of media chunks data to video
      let blob = new Blob(chunks, { type: "video/mp4"});
      let videoURL = URL.createObjectURL(blob);

      // Database Transaction & adding the video to the Database (IndexedDB)
      if(db){
        let videoID = shortid();
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoEntry = {
          id: `vid-${videoID}`,
          blobData: blob
        }
        videoStore.add(videoEntry);
      }
      // let a = document.createElement("a");  // Downloading part from 48 - 51
      // a.href = videoURL;
      // a.download = "stream.mp4";
      // a.click();
    })

  })

  // Adding Event Listiner -> Record-Button

  recordBtnCont.addEventListener("click", (e) =>{

    if(!recorder) return;

    recordFlag = !recordFlag;  // toggling effect 

    if(recordFlag)  // Start
    {
      recorder.start();
      recordBtn.classList.add("scale-record");
      startTimer();
    }
    else // Stop
    {
      recorder.stop();
      recordBtn.classList.remove("scale-record");
      stopTimer();
    }

  })

  // Adding Event Listiner -> Capture-Button

  captureBtnCont.addEventListener("click", (e) =>{
    captureBtn.classList.add("scale-capture");
    
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d"); //Allows to draw
    tool.drawImage(video, 0, 0, canvas.width, canvas.height); // drawing on canvas

    //Applying Filters after taking image
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);


    let imageURL = canvas.toDataURL();//creating url for image

    // Database Transaction  & Adding Image to the DataBase Directly (IndexedDB)
    if(db){
      let imageID = shortid();
      let dbTransaction = db.transaction("image", "readwrite");
      let imageStore = dbTransaction.objectStore("image");
      let imageEntry = {
        id: `img-${imageID}`,
        url: imageURL
      }
      imageStore.add(imageEntry);
    }

    setTimeout(()=>{
      captureBtn.classList.remove("scale-capture");
    }, 1000)

    // Downloading code
    // let a = document.createElement("a"); 
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();


  })





  // Timer Function (Start & Stop)
  // start timer..
  let timerID;
  let timer = document.querySelector(".timer");
  let counter = 0;  // Represents Total Seconds

  function startTimer(){
    timer.style.display = "block";
    function displayTimer(){

      let totalSeconds = counter;

      let hours = Number.parseInt(counter/3600);  // hours
      totalSeconds = totalSeconds%3600; // remaning value

      let minutes = Number.parseInt(totalSeconds/60); //minutes
      totalSeconds = totalSeconds%60; //remaning value

      let seconds = totalSeconds;

      // modifying time
      hours = (hours < 10) ? `0${hours}` : hours;
      minutes = (minutes < 10) ? `0${minutes}` : minutes;
      seconds = (seconds < 10) ? `0${seconds}` : seconds;

      //Displaying the Timer on the camera...
      timer.innerText = ` ${hours}:${minutes}:${seconds} `;

      counter++;
    }
    timerID = setInterval(displayTimer, 1000);
  }
  // stop timer..
  function stopTimer(){
    clearInterval(timerID); //Null kare idr
    timer.innerText = "00:00:00";
    timer.style.display = "none";
  }


  // Filtering Logic
  let filterLayer = document.querySelector(".filter-layer");
  let allFilters = document.querySelectorAll(".filter");
  allFilters.forEach((filterElem) =>{
    filterElem.addEventListener("click", (e)=>{
      transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
      filterLayer.style.backgroundColor = transparentColor;
    })
  })

