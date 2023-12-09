const departement = ['dep_01', 'dep_02', 'dep_03', 'dep_04', 'dep_05', 'dep_06', 'dep_07', 'dep_08', 'dep_09', 'dep_10', 'dep_11', 'dep_12', 'dep_13', 'dep_14', 'dep_15', 'dep_16', 'dep_17', 'dep_18', 'dep_19', 'dep_21', 'dep_22', 'dep_23', 'dep_24', 'dep_25', 'dep_26', 'dep_27', 'dep_28', 'dep_29', 'dep_30', 'dep_31', 'dep_32', 'dep_33', 'dep_34', 'dep_35', 'dep_36', 'dep_37', 'dep_38', 'dep_39', 'dep_40', 'dep_41', 'dep_42', 'dep_43', 'dep_44', 'dep_45', 'dep_46', 'dep_47', 'dep_48', 'dep_49', 'dep_50', 'dep_51', 'dep_52', 'dep_53', 'dep_54', 'dep_55', 'dep_56', 'dep_57', 'dep_58', 'dep_59', 'dep_60', 'dep_61', 'dep_62', 'dep_63', 'dep_64', 'dep_65', 'dep_66', 'dep_67', 'dep_68', 'dep_69', 'dep_70', 'dep_71', 'dep_72', 'dep_73', 'dep_74', 'dep_75', 'dep_76', 'dep_77', 'dep_78', 'dep_79', 'dep_80', 'dep_81', 'dep_82', 'dep_83', 'dep_84', 'dep_85', 'dep_86', 'dep_87', 'dep_88', 'dep_89', 'dep_90', 'dep_91', 'dep_92', 'dep_93', 'dep_94', 'dep_95', 'dep_2A', 'dep_2B'];
const endpointUrl = 'http://127.0.0.1:7200/repositories/Projet'; // Exemple avec DBpedia

// Fonction pour exécuter une requête SPARQL pour récupérer les drapeaux des départements à partir de wikidata
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

// Fonction pour exécuter une requête SPARQL
function executerRequeteSPARQL(endpointUrl, query) {
    return fetch(endpointUrl + '?query=' + encodeURIComponent(query), {
        method: 'GET',
        headers: { 'Accept': 'application/sparql-results+json' }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            afficherErreur('Erreur lors de la requête SPARQL: ' + error);
            throw error;
        });
}

// Fonction pour créer le graphique à partir des données récupérées avec une requête SPARQL (à partir du csv open data)
async function create_graph() {
    const query_conso = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?annee (SUM(?cA) as ?conso_agriculture) (SUM(?cR) as ?conso_residentiel) (SUM(?cT) as ?conso_tertiaire) (SUM(?cI) as ?conso_Industriel) (SUM(?cAu) as ?conso_autres) WHERE { 
        
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
    GROUP BY ?annee
    ORDER BY ?annee
    `;

    const data_graph = await executerRequeteSPARQL(endpointUrl, query_conso);

    try {
        if (data_graph.results.bindings.length > 0) {
            // Traitement des données pour le graphique
            const labels = data_graph.results.bindings.map(entry => entry.annee.value);

            const datasets = data_graph.head.vars
                .filter(key => key !== 'annee')
                .map((key, index) => {
                    const values = data_graph.results.bindings.map(entry => parseInt(entry[key].value));
                    const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

                    return {
                        label: data_graph.head.vars[index + 1],
                        data: values,
                        backgroundColor: colorPalette[index % colorPalette.length],
                        borderColor: colorPalette[index % colorPalette.length],
                        borderWidth: 1
                    };
                });
            // Configuration des options du graphique
            const options = {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            };

            const ctx = document.getElementById('stackedBarChart').getContext('2d');
            const data = { labels, datasets };
            const stackedBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
            });
        }
    } catch (error) {
        console.log(error);
    }
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
    try {
        const data_dep = await executerRequeteSPARQL(endpointUrl, query_dep)
        //const data_conso = executerRequeteSPARQL(endpointUrl, query_conso)

        if (data_dep.results.bindings.length > 0) {
            const code_dep = data_dep.results.bindings[0].codeDep.value;
            const name_dep = data_dep.results.bindings[0].name.value;
            const flag_dep = data_dep.results.bindings[0].flag.value;
            const population_dep = data_dep.results.bindings[0].population.value;
            const image_dep = data_dep.results.bindings[0].image.value;
            console.log(code_dep, name_dep, flag_dep, population_dep, image_dep);

            const newCard = document.createElement('div');
            // Contenu de la carte
            newCard.innerHTML = `
            <div class="card">
            <div class="image" >
            <img src="${image_dep}" class="card-img-top" style="width: 640px; height: 360px;" alt="...">
            </div>
            <div class="card-body p-3">
            <h4 class="card-title"> <img src="${flag_dep}" alt="flag" style="width:auto; height:30px; margin-bottom:5px; margin-right:20px;">${name_dep} (${departement})</h4>
            </div>
            <div class="container mt-0">
            <h5>Données de consommation :</h5>
            <ul class="list-group mt-3">
                <li class="list-group-item">Population actuelle du département: <strong> ${population_dep}</strong> habitants</li>
                <li class="list-group-item mb-2"><strong>Consomation d'électricté par secteur (en KWh)</strong>
                <style>
                .chart {
                  width: 400px; /* Largeur souhaitée */
                  height: 300px; /* Hauteur souhaitée */
                  margin: 0 auto;
                }
              </style>
            
            <div class="chart mt-2">
            <canvas id="stackedBarChart" width="600" height="400"></canvas>
            </div>
                </li>
            </ul>
            </div>
        </div>`;
            return newCard;
        }
        else {
            console.log('Pas de données');
            const newCard = document.createElement('div');
            // Contenu de la carte en cas d'erreur, manque de données
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

    }
    catch (error) {
        console.error(error);
    }
}

let currentCard = null;

// Fonction pour gérer le clic sur un département et afficher la carte correspondante
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
        create_graph();
    } catch (error) {
        console.error(error);
    }
}

// Gestion des événements sur les départements
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


