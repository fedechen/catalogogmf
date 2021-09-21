const RESULT_STRING_BODY_LENGTH = 200;
const RESULT_STRING_TITLE_LENGTH = 75;

var index = elasticlunr(function () {
  this.addField("title");
  this.addField("category");
  this.addField("body");
  this.setRef("id");
});

fetch("indexados.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    json.forEach((doc) => {
      index.addDoc(doc);
    });
  });

//  ---- EXEMPLO DE USO DA BIBLIOTECA ----

// var doc1 = {
//   id: "www.google.com",
//   title: "Oracle released its latest database Oracle 12g",
//   body:
//     "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year.",
// };

// var doc2 = {
//   id: "http://test/sasd",
//   title: "Oracle released its profit report of 2015",
//   body:
//     "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion.",
// };

// index.addDoc(doc1);
// index.addDoc(doc2);
//--------- TESTE
var tempResults;
function searchOneWord(w) {
  tempResults = index.search(w);
  console.log(tempResults);
}
// --------- /TESTE
function busca() {
  let inputValue = $("#inputBusca").val();
  //--------- TESTE
  var words = inputValue.split(" ");
  words.forEach((w) => {
    //aqui chamo o searchOneWord

    searchOneWord(w);
  });
  //----------/TESTE

  let results = index.search(inputValue);

  $("#containerResultados").empty();

  if (results.length == 0) {
    $("#containerResultados").append("<p>Nenhum resultado.</p>");
  } else {
    results.forEach((res) => {
      console.log(res.doc.id);
      console.log(res);

      $("#containerResultados").append("<h2>" + res.doc.category + "</h2>");
      $("#containerResultados").append(
        "<a href=" +
          res.doc.id.replaceAll(" ", "%20") +
          ">" +
          res.doc.title.substring(0, RESULT_STRING_TITLE_LENGTH) +
          "</a>"
      );

      $("#containerResultados").append(
        "<p>" + res.doc.body.substring(0, RESULT_STRING_BODY_LENGTH) + "...</p>"
      );

      $("#containerResultados").append("<p></p>");
    });
  }
}

$(window).on("load", function () {
  $("#buttonBusca").on("click", () => {
    busca();
  });

  $("#inputBusca").on("keypress", (e) => {
    if (e.which === 13) busca();
  });
});
