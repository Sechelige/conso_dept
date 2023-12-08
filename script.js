
const departement = ['dep_01', 'dep_02', 'dep_03', 'dep_04', 'dep_05', 'dep_06', 'dep_07', 'dep_08', 'dep_09', 'dep_10', 'dep_11', 'dep_12', 'dep_13', 'dep_14', 'dep_15', 'dep_16', 'dep_17', 'dep_18', 'dep_19', 'dep_21', 'dep_22', 'dep_23', 'dep_24', 'dep_25', 'dep_26', 'dep_27', 'dep_28', 'dep_29', 'dep_30', 'dep_31', 'dep_32', 'dep_33', 'dep_34', 'dep_35', 'dep_36', 'dep_37', 'dep_38', 'dep_39', 'dep_40', 'dep_41', 'dep_42', 'dep_43', 'dep_44', 'dep_45', 'dep_46', 'dep_47', 'dep_48', 'dep_49', 'dep_50', 'dep_51', 'dep_52', 'dep_53', 'dep_54', 'dep_55', 'dep_56', 'dep_57', 'dep_58', 'dep_59', 'dep_60', 'dep_61', 'dep_62', 'dep_63', 'dep_64', 'dep_65', 'dep_66', 'dep_67', 'dep_68', 'dep_69', 'dep_70', 'dep_71', 'dep_72', 'dep_73', 'dep_74', 'dep_75', 'dep_76', 'dep_77', 'dep_78', 'dep_79', 'dep_80', 'dep_81', 'dep_82', 'dep_83', 'dep_84', 'dep_85', 'dep_86', 'dep_87', 'dep_88', 'dep_89', 'dep_90', 'dep_91', 'dep_92', 'dep_93', 'dep_94', 'dep_95', 'dep_2a', 'dep_2b']
// Fonction exécutée lorsqu'un département est cliqué

const endpointUrl = '127.0.0.1:7200'; // Exemple avec DBpedia

function executerRequeteSPARQL(endpointUrl, query,) {
    fetch(endpointUrl + '?query=' + encodeURIComponent(query), {
        method: 'GET',
        headers: { 'Accept': 'application/sparql-results+json' }
    })
        .then(response => response.json())
        .then(data => {
            return (data);
        })
        .catch(error => {
            afficherErreur('Erreur lors de la requête SPARQL: ' + error);
        });
}

function get_flag(departement) {
    const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT * WHERE { 
        ?dep rdf:type iut:Departement ;
            iut:drapeau ?flag.
        FILTER(?codeDep = '${departement}')
    }`;
    const data = executerRequeteSPARQL(endpointUrl, query);
    return data;
}

// Fonction pour générer la carte
function createCard(departement) {
    const query_dep = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT * WHERE { 
        ?dep rdf:type iut:Departement ;
            iut:code ?codeDep;
            rdfs:label ?name;
            iut:drapeau ?flag;
            iut:population ?population;
            iut:image ?image.
        FILTER(?codeDep = '${departement}')
    }`;
    const data_dep = {
        "head": {
            "vars": [
                "dep",
                "codeDep",
                "name",
                "flag",
                "population",
                "image"
            ]
        },
        "results": {
            "bindings": [
                {
                    "dep": {
                        "type": "uri",
                        "value": "https://cours.iut-orsay.fr/npbd/projet/oueyeya/departement/01"
                    },
                    "codeDep": {
                        "type": "literal",
                        "value": "01"
                    },
                    "name": {
                        "xml:lang": "fr",
                        "type": "literal",
                        "value": "Ain"
                    },
                    "flag": {
                        "type": "uri",
                        "value": "http://commons.wikimedia.org/wiki/Special:FilePath/Flag%20of%20Ain.svg"
                    },
                    "population": {
                        "datatype": "http://www.w3.org/2001/XMLSchema#decimal",
                        "type": "literal",
                        "value": "657856"
                    },
                    "image": {
                        "type": "uri",
                        "value": "http://commons.wikimedia.org/wiki/Special:FilePath/Rivi%C3%A8re%20d%27Ain%20et%20hameau%20de%20Bombois%20%28Matafelon-Granges%29%20depuis%20Corveissiat.jpg"
                    }
                }
            ]
        }
    };//executerRequeteSPARQL(endpointUrl, query_dep);

    code_dep = data_dep.results.bindings[0].codeDep.value;
    name_dep = data_dep.results.bindings[0].name.value;
    flag_dep = data_dep.results.bindings[0].flag.value;
    population_dep = data_dep.results.bindings[0].population.value;
    image_dep = data_dep.results.bindings[0].image.value;

    console.log(code_dep, name_dep, flag_dep, population_dep, image_dep);
    const query_conso = `"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?conso ?consoT ?cA ?cR ?cT ?cI ?cAu WHERE { 
        
        ?dep rdf:type iut:Departement ;
             iut:code ?codeDep;
             iut:genere ?conso.     
        ?conso iut:annee ?annee;
               iut:conso_totale ?consoT;
               iut:conso_agri ?cA;
               iut:conso_resi ?cR;
               iut:conso_tert ?cT;
               iut:conso_indu ?cI;
               iut:conso_autre ?cAu.
        FILTER(?codeDep = '01')
    }
    ORDER BY ?codeDep
    `;
    //const data_conso = executerRequeteSPARQL(endpointUrl, query_conso);
    //console.log(data_conso);
    //Création d'une nouvelle carte
    const newCard = document.createElement('div');

    // Contenu de la carte
    newCard.innerHTML = `<div class="card" style="width: 75%; height: 85%;">
    <div class="image" >
    <img src="${image_dep}" class="card-img-top" style="max-width: 100%; max-height: 400px; height: auto;" alt="...">
    </div>
    <div class="card-body p-3">
    <h4 class="card-title">${departement} ${name_dep}</h4>
    </div>
    <div class="container mt-0">
      <h6>Données de consommation</h6>
      <ul class="list-group mt-3">
        <li class="list-group-item">Population actuelle du département: ${population_dep}</li>
        <li class="list-group-item">Année : 2019</li>
        <li class="list-group-item">Consommation E Totale (année : 2019): 12,331
          <ul class="list-group mt-2">
            <li class="list-group-item">Conso agriculture : 242,343</li>
            <li class="list-group-item">Conso tertiaire : 9,882</li>
            <li class="list-group-item">Conso Industrie : 8,987</li>
            <li class="list-group-item">Conso Autre : 9,809</li>
            <li class="list-group-item">Conso résidentielle : 32,932</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="card-body">
    <a href="#" class="card-link">2019</a>
    <a href="#" class="card-link">2020</a>
    <a href="#" class="card-link">2020</a>

    </div>
</div>`;
return newCard;
}

let currentCard = null; // Stocke la référence de la carte actuelle

function onClickDepartement(departement) {
    const newCard = createCard(departement); // Crée une nouvelle carte pour le département
    const carteElement = document.getElementById('carte');
    // Vérifie s'il existe déjà une carte précédente, puis la supprime
    if (currentCard !== null && carteElement.contains(currentCard)) {
        carteElement.removeChild(currentCard);
    }
        // Supprime le contenu initial
    carteElement.innerHTML = '';
    // Ajoute la nouvelle carte à l'élément 'carte'
    carteElement.appendChild(newCard);
    // Met à jour la référence de la carte actuelle
    currentCard = newCard;
}

departement.forEach((element) => {
    document.getElementById(element).style.fill = '#2d453b';
    document.getElementById(element).addEventListener('mouseover', function () {
        document.getElementById(element).style.fill = 'rgba(65, 194, 245, 0.986)';
    });
    document.getElementById(element).addEventListener('mouseout', function () {
        document.getElementById(element).style.fill = '#2d453b';
    });

    document.getElementById(element).addEventListener('click', function () {
        onClickDepartement(element.replace('dep_', ''));
    });
});


