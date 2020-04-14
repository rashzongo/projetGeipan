# Université Côte d'azur - Master 2 MBDS
## Technlogies JS : Projet Geipan

## Etudiants :
- DIAZ Gabriel
- ZONGO S. H. Rachida

## Enseignant :
- M. BUFFA Michel

## Compositon du projet
Le projet est composé de deux applications :
- Une application NodeJs backend composée d'une API de gestion des ressources
- Une application ReactJS portail utlisateur.

### Backend
- Point d'entrée API :
    | Points d'entrée | description |Paramètres (query)|
    | --------------- | ----------- |------------------| 
    | GET /importData| Insère les dans la base de données | Aucun
    | GET /zones| Liste toutes les zones dont a apparu au moins un cas | Aucun
    | GET /categories| Liste toutes les categories de cas | Aucun
    | GET /cas| Liste tous les cas |page, pageSize, zone, category, startDate, enDate
    | GET /cas/{id} | Récupère le cas assoccié à {id} | Aucun
    | GET /cas/{id}/temoignages | Recupère tous les temoiganges du cas associé à {id} | page, pageSize
    | GET //temoignages | Liste tous les temoiganges | page, pageSize
    | GET /temoignages/{id} | Récupère le temoignage assoccié à {id} |

- Exécution :
    Depuis le répertoire `./backend`
    1. `npm install`
    2. `npm start`
    
    L'application est accessible sur le port `1234`

### Frontend
- Principales pages :
    1. Import de données : permert à l'utilisateur d'importer les données des csv fournis dans la base de données
    2. Liste et Recherche de cas
    3. Détails Cas
    4. Détails témoignage
    5. Statistiques : graphes
    
- Exécution :
    Depuis le répertoire `./frontend/geipan`
    1. `npm install`
    2. `npm start`
    
    Vous pouvez accéder à l'application depuis http://localhost:3000/accueil 