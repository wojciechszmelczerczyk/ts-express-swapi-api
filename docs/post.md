# Add film to favorite film list

## Description

Add film to favorite film list and save in database.

<b>URL:</b> `/favorites`

<b>Method:</b> `POST`

## Data constraints

```json
{
  "id": "[integer]",
  "name": "[string]"
}
```

## Data example

```json
{
  "id": 2,
  "name": "Angel Saga"
}
```

## Success Response

Code: `200 OK`

Condition: If film with provided correctly id exist.

Return added film with corresponding array of characters and list to which film was added\*.

\* if list with provided name doesn't exist it will be created containing film in database.

### Context example

```json
{
  "film": {
    "characters": [
      "Luke Skywalker",
      "C-3PO",
      "R2-D2",
      "Darth Vader",
      "Leia Organa",
      "Owen Lars",
      "Beru Whitesun lars",
      "R5-D4",
      "Biggs Darklighter",
      "Obi-Wan Kenobi",
      "Wilhuff Tarkin",
      "Chewbacca",
      "Han Solo",
      "Greedo",
      "Jabba Desilijic Tiure",
      "Wedge Antilles",
      "Jek Tono Porkins",
      "Raymus Antilles"
    ],
    "release_date": "1977-05-25",
    "title": "A New Hope"
  },
  "filmList": {
    "id": 1,
    "name": "Angel Saga"
  }
}
```

## Error Response

Code: `404 NOT FOUND`

Condition: If provided id is incorrect.

```json
{
  "err": "id has to be number",
  "fail": true
}
```
