# mongoose-simple-fixtures

provide initial data for mongoose models

### usage

```javascript
// mongoose is connection and models are already registered
var path = require('path')
  , msf = require('mongoose-simple-fixtures')
  , dir = path.resolve(__dirname, "./fixtures")
  ;

msf(dir, function(err, results) {
    if (err) console.log("loading data failed");
});
```

### api

#### `msf([mongoose], directory, [validate], [callback])`

 - `mongoose` - optional reference to mongoose
 - `directory` - the path to the data, i.e. `./fixtures`
 - `validate` - optional boolean to disable schema validation (default: `null`)
 - `callback` - optional `function(err, results) {}`

`callback` receives a `results` array. Each object in the array has a `name` property with the name of the model and three values, `added`, `failed`, and `skipped`, indicating the number of documents in that collection that were saved, failed to save, or already exist. (`mongoose-simple-fixtures` will not add duplicate data by attempting to find a record before the insertion.) The `records` inserted are also returned.

`validate` indicates whether schema validation should occur before inserting. For example, object reference validators which ensure the referenced document exists may prevent data from being loaded (i.e. cylical dependencies). To prevent this, invoke with the value of `false` to temporarily suspend the validators. After loading the data, the schema validation will be set to it's previous value. If no value is specified, `mongoose-prime` will not modify the model's validation settings. (cf. [`#validateBeforeSave`](http://mongoosejs.com/docs/guide.html#validateBeforeSave))

### setup

`mongoose-simple-fixtures` supports simple JSON files as well as [extended-JSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/)
 files, the sort that [`mongoexport`](http://docs.mongodb.org/v2.2/reference/mongoexport/) generates.

Each filename in the `directory` must correspond to the model name in mongoose. For example, if you used the directory `fixtures` and it contained two files:

```bash
$ ls fixtures/
templates.json users.json
```

then `mongoose-simple-fixtures` would look for two models on the mongoose reference called `templates` and `users`.  If those models do not exist, the data loading will fail. Any files not ending in `.json` are skipped.


### extra

`mongoose-simple-fixtures` utilizes [`mongoose-prime`](https://github.com/weisjohn/mongoose-prime) under the hood.