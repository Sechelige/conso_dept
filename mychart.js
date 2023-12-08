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

async function create_graph() {
    const endpointUrl = 'http://127.0.0.1:7200/repositories/Projet';
    const query = `
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

                SELECT ?annee (SUM(?consoT) as ?totalConsoT) (SUM(?cA) as ?totalCA) (SUM(?cR) as ?totalCR) (SUM(?cT) as ?totalCT) (SUM(?cI) as ?totalCI) (SUM(?cAu) as ?totalCAu) WHERE { 
                    
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

    const data_graph = await executerRequeteSPARQL(endpointUrl, query);

    try {
        if (data_graph.results.bindings.length > 0) {
            // Traitement des données pour le graphique
            const labels = data_graph.results.bindings.map(entry => entry.annee.value); // Récupération des années comme libellés

            const datasets = data_graph.head.vars
                .filter(key => key !== 'annee') // Filtrer les clés autres que 'annee'
                .map((key, index) => {
                    const values = data_graph.results.bindings.map(entry => parseInt(entry[key].value));
                    const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; // Palette de couleurs pour les datasets

                    return {
                        label: data_graph.head.vars[index + 1], // Utilisation du label de la clé correspondante
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

            // Obtention de la référence du canvas HTML où vous voulez dessiner le graphique
            const ctx = document.getElementById('stackedBarChart').getContext('2d');

            // Création du graphique de type 'bar' en utilisant les données et les options
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

create_graph();




// // Données pour le graphique
// const data = {
//   labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
//   datasets: [
//     {
//       label: 'Produit A',
//       data: [12, 19, 3, 5, 2],
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       borderColor: 'rgba(255, 99, 132, 1)',
//       borderWidth: 1
//     },
//     {
//       label: 'Produit B',
//       data: [7, 11, 5, 8, 3],
//       backgroundColor: 'rgba(54, 162, 235, 0.5)',
//       borderColor: 'rgba(54, 162, 235, 1)',
//       borderWidth: 1
//     },
//     {
//       label: 'Produit C',
//       data: [9, 15, 8, 12, 6],
//       backgroundColor: 'rgba(255, 206, 86, 0.5)',
//       borderColor: 'rgba(255, 206, 86, 1)',
//       borderWidth: 1
//     }
//   ]
// };

// // Options du graphique
// const options = {
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true
//     }
//   }
// };

// // Obtenez la référence du canvas HTML où vous voulez dessiner le graphique
// const ctx = document.getElementById('stackedBarChart').getContext('2d');

// // Créer un objet de graphique de type 'bar' en utilisant les données et les options
// const stackedBarChart = new Chart(ctx, {
//   type: 'bar',
//   data: data,
//   options: options
// });