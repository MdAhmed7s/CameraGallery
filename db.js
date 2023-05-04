// Steps For DataBase
// 1: Open a Data-Base
// 2: Create Object-Store
// 3: Make  Transactions 


let db;
let openRequest = indexedDB.open("myDataBase");  // Request to open database

// we have three event listener
// 1 type
openRequest.addEventListener("success", (e)=>{
  db = openRequest.result; // 2nd time reload kare time value set and accessed 
})

// 2 type
openRequest.addEventListener("error", (e)=>{
  
})

//3 type
openRequest.addEventListener("upgradeneeded", (e)=>{
  db = openRequest.result; // upgrades and accessed in db initial phase

  // Object Store Creation
  db.createObjectStore("video", { keyPath: "id"}); // id for unique purpose
  db.createObjectStore("image", { keyPath: "id"});

})