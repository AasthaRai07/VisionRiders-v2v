const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'mock-db.json');

let dbState = {};
if (fs.existsSync(DB_FILE)) {
  try {
    dbState = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    dbState = {};
  }
}

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
}

const FieldValue = {
  serverTimestamp: () => '__SERVER_TIMESTAMP__',
  increment: (val) => ({ __type__: 'increment', val })
};

function resolveValue(value, currentVal) {
  if (value && value.__type__ === 'increment') {
    return (Number(currentVal) || 0) + value.val;
  }
  if (value === '__SERVER_TIMESTAMP__') {
    return new Date().toISOString();
  }
  return value;
}

function resolveObject(data, currentDoc) {
  const resolved = { ...data };
  for (const key in resolved) {
    resolved[key] = resolveValue(resolved[key], currentDoc ? currentDoc[key] : undefined);
  }
  return resolved;
}

class Query {
  constructor(collectionName, docs) {
    this.collectionName = collectionName;
    this.docs = docs;
  }

  where(field, op, value) {
    let filtered = this.docs.filter(doc => {
      const docVal = doc.data[field];
      if (op === '==') return docVal === value;
      if (op === '!=') return docVal !== value;
      if (op === '>') return docVal > value;
      if (op === '>=') return docVal >= value;
      if (op === '<') return docVal < value;
      if (op === '<=') return docVal <= value;
      if (op === 'array-contains') return Array.isArray(docVal) && docVal.includes(value);
      return false;
    });
    return new Query(this.collectionName, filtered);
  }

  orderBy(field, dir = 'asc') {
    let sorted = [...this.docs].sort((a, b) => {
      let aVal = a.data[field];
      let bVal = b.data[field];
      if (aVal instanceof Date || (typeof aVal === 'string' && !isNaN(Date.parse(aVal)))) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return dir === 'desc' ? 1 : -1;
      if (aVal > bVal) return dir === 'desc' ? -1 : 1;
      return 0;
    });
    return new Query(this.collectionName, sorted);
  }

  limit(n) {
    return new Query(this.collectionName, this.docs.slice(0, n));
  }

  async get() {
    const snapshots = this.docs.map(doc => new QueryDocumentSnapshot(doc.id, doc.data, this.collectionName));
    return new QuerySnapshot(snapshots);
  }
}

class CollectionReference extends Query {
  constructor(collectionName) {
    if (!dbState[collectionName]) {
      dbState[collectionName] = {};
    }
    const docs = Object.keys(dbState[collectionName]).map(id => ({
      id,
      data: dbState[collectionName][id]
    }));
    super(collectionName, docs);
  }

  doc(docId) {
    const id = docId || Math.random().toString(36).substring(2, 15);
    return new DocumentReference(this.collectionName, id);
  }

  async add(data) {
    const id = Math.random().toString(36).substring(2, 15);
    const docRef = new DocumentReference(this.collectionName, id);
    await docRef.set(data);
    return docRef;
  }
}

class DocumentReference {
  constructor(collectionName, docId) {
    this.collectionName = collectionName;
    this.id = docId;
  }

  async get() {
    const data = dbState[this.collectionName]?.[this.id];
    return new DocumentSnapshot(this.id, data);
  }

  async set(data, options = {}) {
    if (!dbState[this.collectionName]) {
      dbState[this.collectionName] = {};
    }
    const current = dbState[this.collectionName][this.id] || {};
    let resolved = resolveObject(data, current);
    if (options.merge) {
      dbState[this.collectionName][this.id] = { ...current, ...resolved };
    } else {
      dbState[this.collectionName][this.id] = resolved;
    }
    saveDb();
  }

  async update(data) {
    if (!dbState[this.collectionName] || !dbState[this.collectionName][this.id]) {
      throw new Error(`Document ${this.collectionName}/${this.id} does not exist`);
    }
    const current = dbState[this.collectionName][this.id];
    let resolved = resolveObject(data, current);
    dbState[this.collectionName][this.id] = { ...current, ...resolved };
    saveDb();
  }

  async delete() {
    if (dbState[this.collectionName] && dbState[this.collectionName][this.id]) {
      delete dbState[this.collectionName][this.id];
      saveDb();
    }
  }
}

class DocumentSnapshot {
  constructor(id, data) {
    this.id = id;
    this.exists = data !== undefined;
    this._data = data;
  }

  data() {
    return this._data;
  }
}

class QuerySnapshot {
  constructor(docs) {
    this.docs = docs;
    this.empty = docs.length === 0;
  }

  forEach(callback) {
    this.docs.forEach(callback);
  }
}

class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor(id, data, collectionName) {
    super(id, data);
    this.ref = new DocumentReference(collectionName, id);
  }
}

class WriteBatch {
  constructor() {
    this.operations = [];
  }

  set(docRef, data, options) {
    this.operations.push({ type: 'set', docRef, data, options });
  }

  update(docRef, data) {
    this.operations.push({ type: 'update', docRef, data });
  }

  delete(docRef) {
    this.operations.push({ type: 'delete', docRef });
  }

  async commit() {
    for (const op of this.operations) {
      if (op.type === 'set') {
        await op.docRef.set(op.data, op.options);
      } else if (op.type === 'update') {
        await op.docRef.update(op.data);
      } else if (op.type === 'delete') {
        await op.docRef.delete();
      }
    }
  }
}

const admin = {
  initializeApp: () => {},
  firestore: () => {
    return {
      collection: (name) => new CollectionReference(name),
      batch: () => new WriteBatch()
    };
  }
};
admin.firestore.FieldValue = FieldValue;

module.exports = admin;
