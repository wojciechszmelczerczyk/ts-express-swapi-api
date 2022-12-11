# Get favorite films list by id

## Description

Get favorite films list by id.

<b>URL :</b> `/favorites/:id`

<b>URL parameter:</b> `id=[integer]` where `id` is integer value.

<b>Method:</b> `GET`

## Success Response

Code: `200 OK`

Condition: If film with provided correctly id exists.

Return list of favorite films with characters unique entries.

### Context example

```json
{
  "characters": [
    {
      "id": 1,
      "listId": 1,
      "name": "Luke Skywalker"
    },
    {
      "id": 2,
      "listId": 1,
      "name": "C-3PO"
    },
    {
      "id": 3,
      "listId": 1,
      "name": "R2-D2"
    },
    {
      "id": 4,
      "listId": 1,
      "name": "Darth Vader"
    },
    {
      "id": 5,
      "listId": 1,
      "name": "Leia Organa"
    },
    {
      "id": 6,
      "listId": 1,
      "name": "Obi-Wan Kenobi"
    },
    {
      "id": 7,
      "listId": 1,
      "name": "Chewbacca"
    },
    {
      "id": 8,
      "listId": 1,
      "name": "Han Solo"
    },
    {
      "id": 9,
      "listId": 1,
      "name": "Wedge Antilles"
    },
    {
      "id": 10,
      "listId": 1,
      "name": "Yoda"
    },
    {
      "id": 11,
      "listId": 1,
      "name": "Palpatine"
    },
    {
      "id": 12,
      "listId": 1,
      "name": "Boba Fett"
    },
    {
      "id": 13,
      "listId": 1,
      "name": "IG-88"
    },
    {
      "id": 14,
      "listId": 1,
      "name": "Bossk"
    },
    {
      "id": 15,
      "listId": 1,
      "name": "Lando Calrissian"
    },
    {
      "id": 16,
      "listId": 1,
      "name": "Lobot"
    }
  ],
  "films": [
    {
      "id": 1,
      "listId": 1,
      "release_date": "1980-05-17",
      "title": "The Empire Strikes Back"
    }
  ],
  "id": 1,
  "name": "Angel Saga"
}
```

## Error Response

Code: `404 NOT FOUND`

Condition: If provided id has incorrect type.

```json
{
  "err": "Provided id has to be a number.",
  "fail": true
}
```

Code: `404 NOT FOUND`

Condition: If list with provided id doesn't exist.

```json
{
  "err": "List with provided id not found",
  "fail": true
}
```
