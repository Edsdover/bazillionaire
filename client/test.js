var xhr = new XMLHttpRequest();   // new HttpRequest instance

// Define endpoint.
xhr.open("PUT", "/api/Ships/11");

xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        alert(xhr.responseText);
    }
}

xhr.send(JSON.stringify(
  {
  "data": {
    "id": "11",
    "type": "ships",
    "attributes": {
      "name": "Eds Ship"
    },
    "relationships": {
      "company": {
        "data": { "type": "Companies", "id": "1" }
      }
    }
  }
}
));
