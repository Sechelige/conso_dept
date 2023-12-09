# Projet Nouveaux Paradigmes de BD

## Comment puis-je collecter les données sur la consommation électrique générée annuellement par les divers départements français ?

Nous avons décidé afin de répondre à notre question de récupérer différentes informations comme le nom, le drapeau, une image représentative, la population actuelle sur le endpoint de Wikidata.

### Requête 1 : Lier les entités au graphes externes

```sparql
prefix iut: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/> 
prefix dep: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/departement/> 
prefix xsd: <http://www.w3.org/2001/XMLSchema#> 
prefix cons: <https://cours.iut-orsay.fr/npbd/projet/oueyeya/consomation/> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

INSERT {
   ?dep owl:sameAs ?depWD;
        rdfs:label ?name;
        iut:drapeau ?flag;
        iut:population ?population;
        iut:image ?image.
}
WHERE {
    ?dep rdf:type iut:Departement ;
          iut:code ?codeDep .
          SERVICE <https://query.wikidata.org/bigdata/namespace/wdq/sparql> {
        ?depWD wdt:P31 wd:Q6465;
               rdfs:label ?name ;
               wdt:P2586 ?codeWD;
               wdt:P41 ?flag;
        	   wdt:P1082 ?population;
       		   wdt:P18 ?image.
    }
    FILTER (LANG(?name) = "fr")
    FILTER (?codeDep = ?codeWD)
}

    

```

### Requête 2 : Récupérer les infos d'un département

```sparql
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
    FILTER(?codeDep = '01')
}
```

##### Résultats des informations sur le département

| dep | codeDep | name          | flag                                                                                                    | population        | image                                                                                                                |
|-----|---------|---------------|---------------------------------------------------------------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------|
| 1   | [iut:departement/01](iut:departement/01) | "01"          | "Ain"@fr                                                                                                | "657856"^^xsd:decimal | [Flag of Ain](http://commons.wikimedia.org/wiki/Special:FilePath/Flag%20of%20Ain.svg) / [Rivière d'Ain et hameau de Bombois (Matafelon-Granges) depuis Corveissiat](http://commons.wikimedia.org/wiki/Special:FilePath/Rivi%C3%A8re%20d%27Ain%20et%20hameau%20de%20Bombois%20%28Matafelon-Granges%29%20depuis%20Corveissiat.jpg) |


### Requête 3 : Récupérer les consommations électriques par département

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
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
```

##### Résultats de la consommation par département

| conso | consoT  | cA    | cR     | cT   | cI    | cAu   |
|-------|---------|-------|--------|------|-------|-------|
| 1     | [iut:consomation/134](iut:consomation/134) | "2161634"^^xsd:int | "0"^^xsd:int | "0"^^xsd:int | "1412896"^^xsd:int | "748738"^^xsd:int | "0"^^xsd:int |
| 2     | [iut:consomation/404](iut:consomation/404) | "93381"^^xsd:int | "3084"^^xsd:int | "64331"^^xsd:int | "2114"^^xsd:int | "4517"^^xsd:int | "19335"^^xsd:int |


