const data = {
  "nodes": [
    {
      "name": "S Michea",
      "n": 1,
      "grp": 1,
      "id": "SMichea"
    },
    {
      "name": "S Perrineau",
      "n": 2,
      "grp": 1,
      "id": "SPerrineau"
    },
    {
      "name": "A Grenier",
      "n": 3,
      "grp": 3,
      "id": "AGrenier"
    },
    {
      "name": "C Bareth",
      "n": 4,
      "grp": 1,
      "id": "CBareth"
    },
    {
      "name": "A Seurre",
      "n": 5,
      "grp": 2,
      "id": "ASeurre"
    },
    {
      "name": "L Haas",
      "n": 6,
      "grp": 1,
      "id": "LHaas"
    },
    {
      "name": "Q Tixier",
      "n": 7,
      "grp": 3,
      "id": "QTixier"
    },
    {
      "name": "P Stobart",
      "n": 8,
      "grp": 2,
      "id": "PStobart"
    }
  ],
  "links": [
    {
      "source": "SMichea",
      "target": "SPerrineau",
      "value": 1
    },
    {
      "source": "SPerrineau",
      "target": "QTixier",
      "value": 1
    },
    {
      "source": "SPerrineau",
      "target": "CBareth",
      "value": 1
    },
    {
      "source": "AGrenier",
      "target": "CBareth",
      "value": 1
    },
    {
      "source": "AGrenier",
      "target": "SMichea",
      "value": 1
    },
    {
      "source": "SPerrineau",
      "target": "PStobart",
      "value": 1
    },
    {
      "source": "LHaas",
      "target": "SMichea",
      "value": 1
    }
  ],
  "attributes": {}
}


export default data;