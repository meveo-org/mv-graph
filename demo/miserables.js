/*
  DATA MODEL NOW
  {
    id : str,

    node: {
      id: str
      name: str
      grp: int <= (for node color)
    },
    
    link : {
      source: node id,
      target: node id,
      value: int
    }
  }
*/

const data = {
  "id": "orga",
  "nodes": [
    {
      "name": "S Michea",
      "grp": 1,
      "id": "SMichea"
    },
    {
      "name": "S Perrineau",
      "grp": 1,
      "id": "SPerrineau"
    },
    {
      "name": "A Grenier",
      "grp": 3,
      "id": "AGrenier"
    },
    {
      "name": "C Bareth",
      "grp": 1,
      "id": "CBareth"
    },
    {
      "name": "A Seurre",
      "grp": 2,
      "id": "ASeurre"
    },
    {
      "name": "L Haas",
      "grp": 1,
      "id": "LHaas"
    },
    {
      "name": "Q Tixier",
      "grp": 3,
      "id": "QTixier"
    },
    {
      "name": "P Stobart",
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
  ]
}


export default data;