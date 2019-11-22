//database idb
var dbPromise = idb.open('soccer', 1, function (db) {
  if (!db.objectStoreNames.contains('fav-teams')) {
    db.createObjectStore('fav-teams', { keyPath: 'id' }); //membuat table
  }
});

function writeData(st, data) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.put(data);
            return tx.complete;
        })
}

function readAllData(st, data){
    return dbPromise
        .then(function(db){
            var tx = db.transaction(st, 'readonly');
            var store = tx.objectStore(st);
            return store.getAll();
        })
}

function deleteData(st,id){
    return dbPromise
        .then(function(db){
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.delete(id);
            return tx.complete;
        })
}
