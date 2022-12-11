# Get film by id

## Description

Get film by id.

<b>URL :</b> `/films/:id`

<b>URL parameter:</b> `id=[integer]` where `id` is integer value.

<b>Method:</b> `GET`

## Success Response

Code: `200 OK`

Condition: If film with provided correctly id exists.

### Context example

```json
{
  "release_date": "1980-05-17",
  "title": "The Empire Strikes Back",
  "url": "2"
}
```

## Error Response

Code: `404 NOT FOUND`

Condition: If provided id has incorrect type.

```json
{
  "err": "id has to be number",
  "fail": true
}
```

Code: `404 NOT FOUND`

Condition: If film with provided id doesn't exist.

```json
{
  "err": "film with this id doesn't exist",
  "fail": true
}
```
