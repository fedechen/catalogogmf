const RESULT_STRING_BODY_LENGTH = 200;
const RESULT_STRING_TITLE_LENGTH = 75;

const CATEGORIES = [
  'Atratividade',
  'Suporte a Tarefa',
  'Motivação por Realização',
  'Motivação por Expressão',
  'Motivação por Relacionamento',
]


//-------------------------------------- Carregar todos os Indexados e armazenar globalmente
let indexados = [];

fetch("indexados.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    indexados = json;
  });
//--------------------------------------


//-------------------------------------- Definir a função que filtra as categorias a serem adicionadas no index
function filtraCategorias() {
  var index = elasticlunr(function () {
    this.addField("title");
    // this.addField("category");
    this.addField("body");
    this.setRef("id");
  });

  let selectedCategories = []

  //localizar (do html) todos os checkbox com id iniciando em "checkboxCategory"
  let checkboxes = $('[id^="checkboxCategory"]');

  //filtrar as categorias de acordo com o estado do checkbox
  checkboxes.each( (index, cb) => {
    categoryIndex = $(cb).attr("index");
    categoryName = CATEGORIES[categoryIndex];
    categoryIsChecked = $(cb).prop("checked");

    if(categoryIsChecked) selectedCategories.push(categoryName)
  })

  //adicionar ao "selectedCategories" somente as que estiverem selecionadas
  indexados.forEach((doc) => {
    if( selectedCategories.includes(doc.category) ){
      index.addDoc(doc);
    }
  });

  return index;
}
//--------------------------------------


//-------------------------------------- Função executada pelo botão "Busca"
function busca() {
  let inputValue = $("#inputBusca").val();

  let index = filtraCategorias();

  let results = index.search(inputValue);
 
  $("#containerResultados").empty();

  //mapear os resultados no HTML
  if (results.length == 0) {
    $("#containerResultados").append("<p>Nenhum resultado.</p>");
  } else {
    results.forEach((res) => {
      console.log(res.doc.id);
      console.log(res);

      $("#containerResultados").append("<h2>" + res.doc.category + "</h2>");
      $("#containerResultados").append(
        "<h2><a href=cartoes/"+
          res.doc.id.replaceAll(" ", "%20") +
          ">" +
          res.doc.title.substring(0, RESULT_STRING_TITLE_LENGTH) +
          "</a></h2>"
      );

      $("#containerResultados").append(
        "<p>" + res.doc.body.substring(0, RESULT_STRING_BODY_LENGTH) + "...</p>"
      );

      $("#containerResultados").append("<p></p>");
    });
  }
}
//--------------------------------------


//-------------------------------------- Inicialização da página
$(window).on("load", function () {

  CATEGORIES.forEach( (category, index) => {
    let id = 'checkboxCategory'+index;

    $("#inputCategories").append(
      `<input type="checkbox" id="${id}" name="${id}" index="${index}"/>
       <label for="${id}">${category}</label>`
    )
  })
  
  $("#buttonBusca").on("click", () => {
    busca();
  });

  $("#inputBusca").on("keypress", (e) => {
    if (e.which === 13) busca();
  });
});
//--------------------------------------
