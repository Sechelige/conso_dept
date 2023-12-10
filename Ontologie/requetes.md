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
PREFIX rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns
    PREFIX iut: https://cours.iut-orsay.fr/npbd/projet/oueyeya/
    PREFIX rdfs: http://www.w3.org/2000/01/rdf-schema

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
```

##### Résultats de la consommation par département



| Année | TotalConsoT | TotalCA | TotalCR | TotalCT | TotalCI | TotalCAu |
|-------|-------------|---------|---------|---------|---------|----------|
| 2011  | 3962580     | 28496   | 1977575 | 737572  | 1180990 | 37948    |
| 2012  | 6301807     | 29907   | 2123743 | 2172604 | 1960070 | 15482    |
| 2013  | 5650135     | 32234   | 2200496 | 1422819 | 1959307 | 35279    |
| 2014  | 5572635     | 29371   | 2001719 | 1578582 | 1947633 | 15330    |
| 2015  | 6380042     | 39972   | 2143941 | 2217973 | 1925579 | 52577    |
| 2016  | 6431616     | 35497   | 2174343 | 2172198 | 2048661 | 918      |
| 2017  | 6476607     | 60468   | 2212359 | 2150022 | 2032781 | 20977    |
| 2018  | 6522078     | 66209   | 1743025 | 2626669 | 2014090 | 72085    |
| 2019  | 5675435     | 63728   | 1772622 | 1775397 | 2015642 | 48045    |
| 2020  | 5302885     | 67488   | 1805527 | 1755294 | 1658295 | 16280    |
| 2021  | 6237135     | 62753   | 1862766 | 2358827 | 1944008 | 8780     |


