# mongoose-simple-fixtures

Simple default data for mongoose models.

### usage

#### `msf([mongoose], directory, [validate], [callback])`

 - `mongoose` - optional reference to mongoose
 - `directory` - the path to the data, i.e. `./fixtures`
 - `validate` - optional boolean to disable schema validation
 - `callback` - optional `function(err, results) {}`

```javascript
// assuming a mongoose connection and models defined above
var path = require('path')
  , msf = require('mongoose-simple-fixtures')
  , dir = path.resolve(__dirname, "./fixtures")
  ;

msf(dir, function(err, results) {
    if (err) console.log("loading data failed");
});
```

`mongoose-simple-fixtures` supports simple JSON files as well as [extended-JSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/)
 files, the sort that [`mongoexport`](http://docs.mongodb.org/v2.2/reference/mongoexport/) generates.

Each filename in the `directory` must correspond to the model name in mongoose. For example, if you used the directory `fixtures` and it contained two files:

```bash
$ ls fixtures/
templates.json users.json
```

then `mongoose-simple-fixtures` would look for two models on the mongoose reference called `templates` and `users`.  If those models do not exist, the data loading will fail.

The callback receives a `results` array with objects. Each object has a `name` property with the name of the model and three numbers `added`, `failed`, and `skipped` indicating what took place. `mongoose-simple-fixtures` will not add duplicate data by attempting to find a record before the insertion.  If that document already exists, the `skipped` count is incremented, if some odd error happens, the `failed` count is incremented, if the document is saved successfully, the `added` count is incremeneted.
