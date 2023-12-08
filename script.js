
const departement = ['dep_01', 'dep_02', 'dep_03', 'dep_04', 'dep_05', 'dep_06', 'dep_07', 'dep_08', 'dep_09', 'dep_10', 'dep_11', 'dep_12', 'dep_13', 'dep_14', 'dep_15', 'dep_16', 'dep_17', 'dep_18', 'dep_19', 'dep_21', 'dep_22', 'dep_23', 'dep_24', 'dep_25', 'dep_26', 'dep_27', 'dep_28', 'dep_29', 'dep_30', 'dep_31', 'dep_32', 'dep_33', 'dep_34', 'dep_35', 'dep_36', 'dep_37', 'dep_38', 'dep_39', 'dep_40', 'dep_41', 'dep_42', 'dep_43', 'dep_44', 'dep_45', 'dep_46', 'dep_47', 'dep_48', 'dep_49', 'dep_50', 'dep_51', 'dep_52', 'dep_53', 'dep_54', 'dep_55', 'dep_56', 'dep_57', 'dep_58', 'dep_59', 'dep_60', 'dep_61', 'dep_62', 'dep_63', 'dep_64', 'dep_65', 'dep_66', 'dep_67', 'dep_68', 'dep_69', 'dep_70', 'dep_71', 'dep_72', 'dep_73', 'dep_74', 'dep_75', 'dep_76', 'dep_77', 'dep_78', 'dep_79', 'dep_80', 'dep_81', 'dep_82', 'dep_83', 'dep_84', 'dep_85', 'dep_86', 'dep_87', 'dep_88', 'dep_89', 'dep_90', 'dep_91', 'dep_92', 'dep_93', 'dep_94', 'dep_95', 'dep_2A', 'dep_2B']
// Fonction exécutée lorsqu'un département est cliqué

const endpointUrl = 'http://127.0.0.1:7200/repositories/test'; // Exemple avec DBpedia


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

function executerRequeteSPARQL(endpointUrl, query) {
    return fetch(endpointUrl + '?query=' + encodeURIComponent(query), {
        method: 'GET',
        headers: { 'Accept': 'application/sparql-results+json' }
    })
        .then(response => response.json())
        .then(data => {
            return data; // Retourne les données
        })
        .catch(error => {
            afficherErreur('Erreur lors de la requête SPARQL: ' + error);
            throw error;
        });
}


// Fonction pour générer la carte
async function createCard(departement) {
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
    try {
        const data_dep = await executerRequeteSPARQL(endpointUrl, query_dep)
        //const data_conso = executerRequeteSPARQL(endpointUrl, query_conso)

        if (data_dep.results.bindings.length > 0) {
            console.log(data_dep);
            const code_dep = data_dep.results.bindings[0].codeDep.value;
            const name_dep = data_dep.results.bindings[0].name.value;
            const flag_dep = data_dep.results.bindings[0].flag.value;
            const population_dep = data_dep.results.bindings[0].population.value;
            const image_dep = data_dep.results.bindings[0].image.value;
            console.log(code_dep, name_dep, flag_dep, population_dep, image_dep);

            const newCard = document.createElement('div');
            // Contenu de la carte
            newCard.innerHTML = `<div class="card" style="width: 75%; height: 85%;">
            <div class="image" >
            <img src="${image_dep}" class="card-img-top" style="max-width: 100%; max-height: 400px; height: auto;" alt="...">
            </div>
            <div class="card-body p-3">
            <h4 class="card-title">${name_dep} ${departement}</h4>
            </div>
            <div class="container mt-0">
            <h6>Données de consommation</h6>
            <ul class="list-group mt-3">
                <li class="list-group-item">Population actuelle du département: ${population_dep}</li>
                <li class="list-group-item"><a href="#" class="card-link">2019</a>
                <a href="#" class="card-link">2020</a>
                <a href="#" class="card-link">2020</a></li>
                <li class="list-group-item mb-2">Consommation E Totale (année : 2019):
                <ul class="list-group mt-2">
                    <li class="list-group-item">Conso agriculture : </li>
                    <li class="list-group-item">Conso tertiaire : </li>
                    <li class="list-group-item">Conso Industrie : </li>
                    <li class="list-group-item">Conso Autre : </li>
                    <li class="list-group-item">Conso résidentielle : </li>
                </ul>
                </li>
            </ul>
            </div>
            <!-- <div class="card-body">
            <a href="#" class="card-link">2019</a>
            <a href="#" class="card-link">2020</a>
            <a href="#" class="card-link">2020</a>
            </div>-->
        </div>`;
            return newCard;
        }
        else {
            console.log('Pas de données');
            const newCard = document.createElement('div');
            // Contenu de la carte
            newCard.innerHTML = `<div class="" style="width: 90%; height: 85%;">
            <div class="image" >
            <img src="./images/nodata.png" class="card-img-top" style="max-width: 100%; max-height: 400px; height: auto;" alt="...">
            </div>
            <div class="card-body p-3">
            <h1 class="card-title">Pas de données...</h1>
            </div>
        </div>`;
            return newCard;
        }
        // if (data_conso.results.bindings.length > 0) {
        //     const conso_dep = data_conso.results.bindings[0].conso.value;
        //     const consoT_dep = data_conso.results.bindings[0].consoT.value;
        //     const cA_dep = data_conso.results.bindings[0].cA.value;
        //     const cR_dep = data_conso.results.bindings[0].cR.value;
        //     const cT_dep = data_conso.results.bindings[0].cT.value;
        //     const cI_dep = data_conso.results.bindings[0].cI.value;
        //     const cAu_dep = data_conso.results.bindings[0].cAu.value;
        //     console.log(conso_dep, consoT_dep, cA_dep, cR_dep, cT_dep, cI_dep, cAu_dep);
        // }
        // else {
        //     console.log('Pas de données');
        // }
        //const data_conso = executerRequeteSPARQL(endpointUrl, query_conso);
    }
    catch (error) {
        console.error(error);
    }
}


let currentCard = null; // Stocke la référence de la carte actuelle

async function onClickDepartement(departement) {
    try {
        const newCard = await createCard(departement); // Attendre que la carte soit générée

        const carteElement = document.getElementById('carte');
        if (currentCard !== null && carteElement.contains(currentCard)) {
            carteElement.removeChild(currentCard);
        }
        carteElement.innerHTML = '';
        carteElement.appendChild(newCard);
        currentCard = newCard;
    } catch (error) {
        console.error(error);
    }
}

departement.forEach((element) => {
    document.getElementById(element).style.fill = '#2d453b';
    document.getElementById(element).addEventListener('mouseover', function () {
        document.getElementById(element).style.fill = '#452d37';
    });
    document.getElementById(element).addEventListener('mouseout', function () {
        document.getElementById(element).style.fill = '#2d453b';
    });

    document.getElementById(element).addEventListener('click', function () {
        onClickDepartement(element.replace('dep_', ''));
    });
});


